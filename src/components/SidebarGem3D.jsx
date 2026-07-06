import * as THREE from 'three';
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Outlines } from '@react-three/drei';
import { T } from '../data/tokens';

// 사이드바 포커스 마커용 작은 3D 보석 — Get Started 히어로 보석과 동일 형태/재질 계열
const gemGeometry = new THREE.IcosahedronGeometry(1, 0); // detail 0 = 20면 크리스털(작은 크기에서 또렷)
const gemMaterial = new THREE.MeshPhysicalMaterial({
  color: T.primary,      // Pintel Primary
  roughness: 0.22,
  metalness: 0.1,
  clearcoat: 1.0,
  clearcoatRoughness: 0.25,
  flatShading: true,     // 면을 살려 컷팅된 보석 느낌
  emissive: '#0a2a66',   // 어두운 면도 브랜드색으로 은은히 떠오름
  emissiveIntensity: 0.35,
});

function Gem() {
  const ref = useRef(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.9;
    ref.current.rotation.x += delta * 0.35;
  });
  return (
    <mesh ref={ref} geometry={gemGeometry} material={gemMaterial}>
      <Outlines thickness={0.03} color="#9ec2ff" />
    </mesh>
  );
}

export default function SidebarGem3D({ size = 22 }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 3.2], fov: 38, near: 0.1, far: 10 }}
      style={{ width: `${size}px`, height: `${size}px`, display: 'block', pointerEvents: 'none' }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[2, 3, 4]} intensity={1.5} color="#dfeaff" />
      <directionalLight position={[-3, -1, 2]} intensity={0.6} color={T.primaryStrong} />
      <Gem />
    </Canvas>
  );
}
