import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import Cube from "./Cube1";
import Cards from "./Cards1";
import "../../styles/_detailHero.scss";

const DetailHero1 = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div className="detail-hero-container">
      <Canvas className="canvas">
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Cube selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <Cards selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
    </div>
  );
};

export default DetailHero1;
