import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useState } from "react";
import Hexagon from "./Hexagon";
import Cards from "./Cards";
import "../../styles/_detailHero.scss";

const DetailHero = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  return (
    <div className="container">
      <Canvas className="canvas">
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 5, 2]} intensity={1} />
        <Hexagon setSelectedCard={setSelectedCard} />
        <OrbitControls enableZoom={false} />
      </Canvas>
      <Cards selectedCard={selectedCard} />
    </div>
  );
};

export default DetailHero;
