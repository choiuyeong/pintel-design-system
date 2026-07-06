import * as THREE from "three";
import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Outlines, Environment, Text } from "@react-three/drei";
import { Physics, useSphere } from "@react-three/cannon";
import { EffectComposer, N8AO, SMAA, Bloom } from "@react-three/postprocessing";
import { T } from "../data/tokens";

// Monkeypatch WebGL getContextAttributes() to prevent "alpha is null" crashes in postprocessing
if (typeof window !== "undefined") {
  const patchWebGLProto = (glClass) => {
    if (glClass && glClass.prototype && glClass.prototype.getContextAttributes) {
      const originalGetAttributes = glClass.prototype.getContextAttributes;
      glClass.prototype.getContextAttributes = function () {
        const attrs = originalGetAttributes.apply(this, arguments);
        return attrs ? { alpha: true, ...attrs } : { alpha: true };
      };
    }
  };
  if (typeof WebGLRenderingContext !== "undefined") patchWebGLProto(WebGLRenderingContext);
  if (typeof WebGL2RenderingContext !== "undefined") patchWebGLProto(WebGL2RenderingContext);
}

const rfs = THREE.MathUtils.randFloatSpread;
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const baubleMaterial = new THREE.MeshPhysicalMaterial({
  color: "#ffffff",        // 흰색 기본 → 인스턴스별 색(setColorAt)이 그대로 표현됨
  roughness: 0.35,         // 매트~새틴 사이
  metalness: 0.0,          // 비금속(세라믹/펄)
  clearcoat: 1.0,          // 래커 코팅 — 표면에 맑은 광택 층(고급 프로덕트 렌더 느낌)
  clearcoatRoughness: 0.30,  // 광택 코팅 거칠기 ↑ → 하이라이트가 넓게 퍼지며 약해짐
  iridescence: 0.3,        // 은은한 진주 광택(각도에 따라 미세한 무지개빛)
  iridescenceIOR: 1.3,
  envMapIntensity: 0.5     // 환경맵 반사 세기 ↓ → 반짝이는 하이라이트 완화
});

// 핀텔 대표색 "히어로" 구 — 각진 보석(faceted gem) 형태 + 폴리시 클리어코트
const brandGeometry = new THREE.IcosahedronGeometry(1.15, 1); // detail 1 = 면을 잘게 나눠 모서리 부드럽게(소프트 컷)
const brandMaterial = new THREE.MeshPhysicalMaterial({
  color: T.primary,        // Pintel Primary
  roughness: 0.22,
  metalness: 0.1,
  clearcoat: 1.0,          // 광택 코팅 — 보석 표면
  clearcoatRoughness: 0.25,  // 광택 코팅 거칠기 ↑ → 하이라이트 완화
  flatShading: true,       // 면을 살려 컷팅된 크리스털 느낌
  envMapIntensity: 0.6     // 환경맵 반사 세기 ↓ → 반짝이는 하이라이트 완화
});

export default function InteractiveClump3D() {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* 3D WebGL Canvas */}
      <Canvas 
        shadows 
        gl={{ antialias: false, alpha: true }} 
        dpr={[1, 1.5]} 
        camera={{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }}
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <ambientLight intensity={0.28} />
        <spotLight
          intensity={0.2}
          angle={0.25} 
          penumbra={1} 
          position={[30, 30, 30]} 
          castShadow 
          shadow-mapSize={[512, 512]} 
        />
        
        {/* Physics Environment */}
        <Physics gravity={[0, 0.5, 0]} iterations={10}>
          <Pointer />
          <Clump />
          <BrandBauble />
        </Physics>
        
        {/* Built-in environment map for realistic glossy reflections */}
        <Environment preset="studio" />

        {/* 3D Interactive Typography that reacts dynamically to the PointLight */}
        <Text
          position={[0, 0.2, -3.5]} // slightly offset vertically for visual balance
          renderOrder={10} // 클럼프보다 나중에 그려져 항상 앞에 표시
          fontSize={1.8} // enlarged size
          maxWidth={30} // prevents wrapping
          textAlign="center"
          fontStyle="normal"
          fontWeight={900}
          letterSpacing={-0.02}
        >
          PINTEL DESIGN SYSTEM 1.0
          <meshStandardMaterial
            color="#2d2d34" // lighter base color to make it more distinct in shadows
            roughness={0.25}
            metalness={0.8}
            emissive={T.primary} // brand blue base glow
            emissiveIntensity={0.35} // significantly brighter default glow
            depthTest={false}  // 깊이 무시 → 구체에 가리지 않고 글씨가 앞으로
            depthWrite={false}
          />
        </Text>
        
        {/* Post-processing effects */}
        <EffectComposer disableNormalPass multisampling={0}>
          <N8AO halfRes color="black" aoRadius={2} intensity={1.5} aoSamples={6} denoiseSamples={4} />
          <Bloom mipmapBlur levels={7} intensity={0.08} />
          <SMAA />
        </EffectComposer>
      </Canvas>
    </div>
  );
}

function Clump({ mat = new THREE.Matrix4(), vec = new THREE.Vector3() }) {
  // Creating a 3D sphere collider for each instanced sphere
  const [ref, api] = useSphere((index) => ({ 
    args: [1], 
    mass: 1, 
    angularDamping: 0.1, 
    linearDamping: 0.65, 
    position: [rfs(10), rfs(10), rfs(10)] 
  }));

  useFrame((state) => {
    if (!ref.current) return;

    // 인스턴스별 색(1회) — 펄 뉴트럴 클러스터 속에 핀텔 대표색(Primary #0066FF) 1개만 강조
    if (!ref.current.userData.tinted) {
      const c = new THREE.Color();
      for (let i = 0; i < 40; i++) {
        // 쿨 펄 뉴트럴 — 구슬마다 미세한 명도 변주로 평면감 제거(고급감)
        c.setHSL(0.6, 0.08, 0.9 + 0.035 * Math.sin(i * 1.7));
        ref.current.setColorAt(i, c);
      }
      if (ref.current.instanceColor) ref.current.instanceColor.needsUpdate = true;
      ref.current.userData.tinted = true;
    }

    // 시간 기반 ambient 흔들림 — 인터랙션 없이도 기본으로 부드럽게 출렁이게
    const t = state.clock.getElapsedTime();
    const sway = 20; // 출렁임 세기(중심 인력 -30 대비 약하게 → 잔잔한 흔들림)

    for (let i = 0; i < 40; i++) {
      // Get the current translation matrix of the sphere instance
      ref.current.getMatrixAt(i, mat);

      // Calculate force directing each sphere back toward the center-point (0,0,0)
      const forceVec = vec.setFromMatrixPosition(mat);
      const dist = forceVec.length();

      // Soft pull force that scales with distance
      const force = forceVec.normalize().multiplyScalar(-30 - dist * 2);

      api.at(i).applyForce(force.toArray(), [0, 0, 0]);

      // 구슬마다 위상·주파수를 달리해 유기적인 출렁임
      api.at(i).applyForce(
        [
          Math.sin(t * 1.1 + i * 0.7) * sway,
          Math.cos(t * 0.9 + i * 1.3) * sway,
          Math.sin(t * 1.4 + i * 0.5) * sway,
        ],
        [0, 0, 0]
      );
    }
  });

  return (
    <instancedMesh 
      ref={ref} 
      castShadow 
      receiveShadow 
      args={[sphereGeometry, baubleMaterial, 40]}
    >
      <Outlines thickness={0.015} color="#b3b9c4" />
    </instancedMesh>
  );
}

// 핀텔 대표색 히어로 — 각진 보석 1개. 다른 구슬과 같은 중심 인력·출렁임을 받아 클러스터에 섞임.
function BrandBauble() {
  const [ref, api] = useSphere(() => ({
    args: [1.15],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [rfs(6), rfs(6), rfs(6)],
  }));

  // 단일 물리 바디는 ref.position이 물리값을 반영하지 않으므로 실제 위치를 구독해서 읽는다
  const pos = useRef([0, 0, 0]);
  useEffect(() => api.position.subscribe((v) => { pos.current = v; }), [api]);

  useFrame((state) => {
    const [x, y, z] = pos.current;
    const dist = Math.hypot(x, y, z) || 1;
    const f = -30 - dist * 2; // 중심 인력(다른 구슬과 동일)
    api.applyForce([(x / dist) * f, (y / dist) * f, (z / dist) * f], [0, 0, 0]);
    const t = state.clock.getElapsedTime();
    api.applyForce([Math.sin(t * 1.1) * 20, Math.cos(t * 0.9) * 20, Math.sin(t * 1.4) * 20], [0, 0, 0]);
  });

  return (
    <mesh ref={ref} geometry={brandGeometry} material={brandMaterial} castShadow receiveShadow>
      <Outlines thickness={0.012} color="#9ec2ff" />
    </mesh>
  );
}

function Pointer() {
  const viewport = useThree((state) => state.viewport);
  const [ref, api] = useSphere(() => ({ 
    type: "Kinematic", 
    args: [3], 
    position: [0, 0, 0] 
  }));

  useFrame((state) => {
    // Coordinate conversion from 2D screen coordinates to 3D world coordinates
    const x = (state.mouse.x * viewport.width) / 2;
    const y = (state.mouse.y * viewport.height) / 2;
    api.position.set(x, y, 0);
  });

  return (
    <mesh ref={ref} scale={0.2}>
      <sphereGeometry />
      <meshBasicMaterial color={[4, 4, 4]} toneMapped={false} visible={false} />
      <pointLight intensity={2} distance={20} color="#cfe0ff" />
    </mesh>
  );
}
