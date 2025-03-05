// InteractiveWord.tsx
import React, { useState } from "react";

interface InteractiveWordProps {
  word: string;
}

const InteractiveWord: React.FC<InteractiveWordProps> = ({ word }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span className={`interactive-word ${isHovered ? "hovered" : ""}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {word}
    </span>
  );
};

export default InteractiveWord;
