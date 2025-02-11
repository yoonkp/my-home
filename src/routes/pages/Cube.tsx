import { useFrame } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";

interface CubeProps {
  selectedCard: number | null;
  setSelectedCard: (index: number | null) => void;
}

const Cube = ({ selectedCard, setSelectedCard }: CubeProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const baseURL = import.meta.env.BASE_URL;

  const textures = useTexture([
    `${baseURL}assets/images/c-1-hybeim.svg`, // 앞면 (Card 1)
    `${baseURL}assets/images/c-1-hybeim.svg`, // 뒷면 (Card 1)
    `${baseURL}assets/images/c-2-kcar.svg`, // 오른쪽 (Card 2)
    `${baseURL}assets/images/c-2-kcar.svg`, // 왼쪽 (Card 2)
    `${baseURL}assets/images/c-3-shinsegaetvshopping.svg`, // 윗면 (Card 3)
    `${baseURL}assets/images/c-3-shinsegaetvshopping.svg`, // 아랫면 (Card 3)
  ]);

  // 자동 회전 활성화 여부
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (selectedCard !== null) {
      setIsRotating(false);
      setTimeout(() => setIsRotating(true), 1000); // 🎯 1초 후 다시 회전
    }
  }, [selectedCard]);

  useFrame(() => {
    if (ref.current) {
      if (isRotating) {
        ref.current.rotation.y += 0.01;
        ref.current.rotation.x += 0.005;
      } else if (selectedCard !== null) {
        // 🎯 각 카드와 정확하게 매칭되도록 수정
        const targetRotations = [
          [0, 0], // 앞면 (Card 1)
          [0, Math.PI], // 뒷면 (Card 1)
          [0, Math.PI / 2], // 오른쪽 (Card 2)
          [0, -Math.PI / 2], // 왼쪽 (Card 2)
          [-Math.PI / 2, 0], // 윗면 (Card 3)
          [Math.PI / 2, 0], // 아랫면 (Card 3)
        ];

        const [targetX, targetY] = targetRotations[selectedCard];

        ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.1;
        ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.1;
      }
    }
  });

  return (
    <mesh ref={ref} scale={[1.5, 1.5, 1.5]}>
      <boxGeometry args={[1, 1, 1]} />
      {textures.map((texture, i) => (
        <meshBasicMaterial key={i} attach={`material-${i}`} map={texture} />
      ))}

      {/* 🎯 정확한 면 위치에 클릭 이벤트 추가 */}
      {[
        { position: [0, 0, 0.51], rotation: [0, 0, 0] }, // 앞면 (Card 1)
        { position: [0, 0, -0.51], rotation: [0, Math.PI, 0] }, // 뒷면 (Card 1)
        { position: [0.51, 0, 0], rotation: [0, Math.PI / 2, 0] }, // 오른쪽 (Card 2)
        { position: [-0.51, 0, 0], rotation: [0, -Math.PI / 2, 0] }, // 왼쪽 (Card 2)
        { position: [0, 0.51, 0], rotation: [-Math.PI / 2, 0, 0] }, // 윗면 (Card 3)
        { position: [0, -0.51, 0], rotation: [Math.PI / 2, 0, 0] }, // 아랫면 (Card 3)
      ].map((face, i) => (
        <mesh key={i} position={face.position} rotation={face.rotation} onClick={() => setSelectedCard(i)}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}
    </mesh>
  );
};

export default Cube;
