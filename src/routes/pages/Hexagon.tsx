import { MeshProps, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface HexagonProps {
  setSelectedCard: (index: number) => void;
}

const Hexagon = ({ setSelectedCard }: HexagonProps) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.01;
    }
  });

  const handleClick = (index: number) => {
    setSelectedCard(index);
  };

  return (
    <mesh ref={ref} scale={[1.5, 1.5, 1.5]}>
      <cylinderGeometry args={[1, 1, 1, 6]} />
      <meshStandardMaterial color="lightblue" wireframe />
      {[...Array(6)].map((_, i) => (
        <mesh key={i} position={[Math.cos((i * Math.PI) / 3), 0, Math.sin((i * Math.PI) / 3)]} onClick={() => handleClick(i)}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshBasicMaterial color="white" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </mesh>
  );
};

export default Hexagon;
