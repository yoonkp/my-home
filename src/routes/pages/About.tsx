import React from "react";
import { motion } from "framer-motion";

const aboutItems = [
  {
    iconClass: "icon-team",
    title: "팀워크",
    description: "효율적인 커뮤니케이션과 협업으로 최상의 결과를 도출",
  },
  {
    iconClass: "icon-idea",
    title: "창의성",
    description: "독창적인 아이디어 발굴과 이를 현실로 구현하는 창의적 접근",
  },
  {
    iconClass: "icon-growth",
    title: "성장",
    description: "새로운 기술 학습과 경험을 바탕으로 끊임없이 성장",
  },
  {
    iconClass: "icon-target",
    title: "목표 지향적 태도",
    description: "프로젝트 목표를 명확히 이해하고 효율적으로 달성",
  },
];

// 전체 리스트에 대해 자식 애니메이션을 stagger 처리하기 위한 variants
const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// 개별 항목에 적용할 애니메이션 variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function About() {
  return (
    <motion.section
      id="about"
      className=""
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.4 }} // 섹션의 30% 이상이 보이면 애니메이션 실행, 한 번만 실행
    >
      <article className="about__wrap content">
        <div className="sub__content">
          <h2 className="title">ABOUT</h2>
          <motion.ul className="about__list" variants={listVariants}>
            {aboutItems.map((item, index) => (
              <motion.li
                key={index}
                className="about-item"
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div className="icon-wrap">
                  <i className={`${item.iconClass} w32 h32`} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </article>
    </motion.section>
  );
}
