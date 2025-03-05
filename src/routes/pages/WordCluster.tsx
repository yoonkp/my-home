import React from "react";
import { motion } from "framer-motion";

interface WordClusterProps {
  title: string;
  words: string[];
  // 각 클러스터의 등장 딜레이를 custom으로 받아 variants에 활용
  customDelay?: number;
}

// 클러스터 전체에 대한 variants (딜레이를 custom 값으로 적용)
const clusterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.2, duration: 0.5 },
  }),
};

const wordVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  hover: { scale: 1.1, fontWeight: "bold" },
};

const WordCluster: React.FC<WordClusterProps> = ({ title, words, customDelay = 0 }) => {
  return (
    <motion.div className="word-cluster" variants={clusterVariants} custom={customDelay} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}>
      <motion.h2 className="word-cluster__title">{title}</motion.h2>
      <div className="word-cluster__words">
        {words.map((word, index) => (
          <motion.span key={index} className="interactive-word" variants={wordVariants} whileHover="hover">
            {word}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
};

export default WordCluster;
