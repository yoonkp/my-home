import React from "react";
import { motion } from "framer-motion";
import WordCluster from "./WordCluster";

// 전체 섹션에 적용할 애니메이션 variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const MainVisualSection: React.FC = () => {
  const clusters = [
    {
      title: "박윤경의 기술 생태계",
      words: ["작업환경", "실시간 반응 속도", "아키텍쳐 이해도"],
    },
    {
      title: "박윤경의 캐릭터",
      words: ["이해도", "아키텍쳐", "퍼블(개발)"],
    },
    {
      title: "목표",
      words: ["매출증대", "이펙트", "퍼블(기획)"],
    },
  ];

  return (
    <motion.section className="main-visual" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
      <motion.h1 className="main-visual__title" variants={titleVariants}>
        박윤경의 기술 생태계
      </motion.h1>
      <div className="main-visual__clusters">
        {clusters.map((cluster, index) => (
          <WordCluster key={index} title={cluster.title} words={cluster.words} customDelay={index} />
        ))}
      </div>
    </motion.section>
  );
};

export default MainVisualSection;
