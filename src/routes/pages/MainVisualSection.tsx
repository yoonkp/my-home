// MainVisualSection.tsx
import React from "react";
import WordCluster from "./WordCluster";

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
    <section className="main-visual">
      <h1 className="main-visual__title">박윤경의 기술 생태계</h1>
      <div className="main-visual__clusters">
        {clusters.map((cluster, index) => (
          <WordCluster key={index} title={cluster.title} words={cluster.words} />
        ))}
      </div>
    </section>
  );
};

export default MainVisualSection;
