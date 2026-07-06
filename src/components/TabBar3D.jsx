import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { T } from '../data/tokens';

// 탭 인디케이터용 직사각형 3D 바 — 입체 박스가 빛을 받아 두께가 보임
const barMaterial = new THREE.MeshPhysicalMaterial({
  color: T.primary,      // Pintel Primary
  roughness: 0.28,
  metalness: 0.15,
  clearcoat: 1.0,
  clearcoatRoughness: 0.3,
  emissive: '#0a2a66',
  emissiveIntensity: 0.4,
});

// frameloop="demand"라 평소엔 렌더 정지(GPU 0). 탭 변경(spinKey) 시에만 정확히 한 바퀴 돌고 정면 안착.
const DURATION = 1000; // 회전 버스트(ms)
const easeInOut = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

function Bar({ spinKey }) {
  const ref = useRef(null);
  const { viewport, invalidate } = useThree();
  const startAt = useRef(-1); // -1 = 정지 상태

  useEffect(() => {
    startAt.current = performance.now(); // 버스트 시작
    invalidate(); // 렌더 루프 깨우기
  }, [spinKey, invalidate]);

  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    // 캔버스 크기에 맞춰 가로로 꽉 차게 + 살짝 기울여 윗면이 보이게(입체감)
    m.scale.set(viewport.width * 0.94, viewport.height * 0.34, viewport.height * 0.45);
    m.rotation.y = 0;
    m.rotation.z = 0;
    const REST = -0.5; // 평소 기울기(윗면이 살짝 보임)
    const t = startAt.current;
    if (t >= 0) {
      const p = (performance.now() - t) / DURATION;
      if (p < 1) {
        // 바의 긴 축(X)으로 정확히 한 바퀴 굴림 — 시작·끝 모두 같은 기울기
        m.rotation.x = REST + easeInOut(p) * Math.PI * 2;
        invalidate(); // 버스트 동안 자가 구동
      } else {
        m.rotation.x = REST; // 깔끔히 안착
        startAt.current = -1; // 정지 → 다음 프레임부터 렌더 멈춤
      }
    } else {
      m.rotation.x = REST;
    }
  });

  return (
    <mesh ref={ref} material={barMaterial}>
      <boxGeometry args={[1, 1, 1]} />
    </mesh>
  );
}

export default function TabBar3D({ width = 60, height = 18, spinKey }) {
  return (
    <Canvas
      frameloop="demand"
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 6], fov: 40, near: 0.1, far: 20 }}
      style={{ width: `${width}px`, height: `${height}px`, display: 'block', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[1, 4, 5]} intensity={1.6} color="#dfeaff" />
      <directionalLight position={[-3, -1, 2]} intensity={0.5} color={T.primaryStrong} />
      <Bar spinKey={spinKey} />
    </Canvas>
  );
}
