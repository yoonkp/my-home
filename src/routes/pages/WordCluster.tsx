// WordCluster.tsx
import React from "react";
import InteractiveWord from "./InteractiveWord";

interface WordClusterProps {
  title: string;
  words: string[];
}

const WordCluster: React.FC<WordClusterProps> = ({ title, words }) => {
  return (
    <div className="word-cluster">
      <h2 className="word-cluster__title">{title}</h2>
      <div className="word-cluster__words">
        {words.map((word, index) => (
          <InteractiveWord key={index} word={word} />
        ))}
      </div>
    </div>
  );
};

export default WordCluster;
