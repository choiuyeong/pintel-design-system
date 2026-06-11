import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Outlines, Environment, Text } from "@react-three/drei";
import { Physics, useSphere } from "@react-three/cannon";
import { EffectComposer, N8AO, SMAA, Bloom } from "@react-three/postprocessing";

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
const baubleMaterial = new THREE.MeshStandardMaterial({ 
  color: "#c3daf2", // premium soft light blue
  roughness: 0.32,  // softer specular highlight (less glossy)
  metalness: 0.18,  // reduced metalness to soften mirror reflections
  envMapIntensity: 0.85 // lower envMapIntensity to reduce overall reflection brightness
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
        <ambientLight intensity={0.35} />
        <spotLight 
          intensity={2.0} 
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
        </Physics>
        
        {/* Built-in environment map for realistic glossy reflections */}
        <Environment preset="studio" />

        {/* 3D Interactive Typography that reacts dynamically to the PointLight */}
        <Text
          position={[0, 0.2, -3.5]} // slightly offset vertically for visual balance
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
            emissive="#1751D9" // brand blue base glow
            emissiveIntensity={0.35} // significantly brighter default glow
          />
        </Text>
        
        {/* Post-processing effects */}
        <EffectComposer disableNormalPass multisampling={0}>
          <N8AO halfRes color="black" aoRadius={2} intensity={1.5} aoSamples={6} denoiseSamples={4} />
          <Bloom mipmapBlur levels={7} intensity={0.8} />
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

  useFrame(() => {
    if (!ref.current) return;
    
    for (let i = 0; i < 40; i++) {
      // Get the current translation matrix of the sphere instance
      ref.current.getMatrixAt(i, mat);
      
      // Calculate force directing each sphere back toward the center-point (0,0,0)
      const forceVec = vec.setFromMatrixPosition(mat);
      const dist = forceVec.length();
      
      // Soft pull force that scales with distance
      const force = forceVec.normalize().multiplyScalar(-30 - dist * 2);
      
      api.at(i).applyForce(force.toArray(), [0, 0, 0]);
    }
  });

  return (
    <instancedMesh 
      ref={ref} 
      castShadow 
      receiveShadow 
      args={[sphereGeometry, baubleMaterial, 40]}
    >
      <Outlines thickness={0.015} color="#8e8e93" />
    </instancedMesh>
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
      <pointLight intensity={16} distance={20} color="#00A3FF" />
    </mesh>
  );
}
