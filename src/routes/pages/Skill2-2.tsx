import React, { useRef, useLayoutEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3Alt, faJs, faReact, faFigma, faGitAlt } from "@fortawesome/free-brands-svg-icons";
import { faLayerGroup, faProjectDiagram } from "@fortawesome/free-solid-svg-icons";

type SkillItem = {
  icon: any;
  color: string;
  title: string;
  description: string;
};

const skillItems = [
  {
    icon: faProjectDiagram,
    color: "txt-gray",
    title: "도메인 퍼블리싱",
    description: "도메인 모델 기반 확장성 높은 UI 구현",
  },
  {
    icon: faHtml5,
    color: "txt-red",
    title: "HTML5",
    description: "웹 접근성과 SEO를 고려한 시멘틱 마크업",
  },
  {
    icon: faCss3Alt,
    color: "txt-blue",
    title: "CSS3",
    description: "SCSS, BEM, 반응형 디자인으로 모듈화된 스타일 관리",
  },
  {
    icon: faJs,
    color: "txt-yellow",
    title: "JavaScript",
    description: "ES6+와 비동기 처리로 사용자 친화적 UI 개발",
  },
  {
    icon: faReact,
    color: "txt-sky",
    title: "React",
    description: "함수형 컴포넌트와 Hooks로 상태 관리",
  },
  {
    icon: faGitAlt,
    color: "txt-orange",
    title: "Git",
    description: "협업과 버전 관리를 위한 Git 활용",
  },
  {
    icon: faLayerGroup,
    color: "txt-font-b",
    title: "Library",
    description: "MUI, AG-Grid 등으로 생산성 높은 UI 개발",
  },
  {
    icon: faFigma,
    color: "txt-red",
    title: "Figma",
    description: "디자인 시스템 구축과 협업 효율화",
  },
];

export default function SkillMotion() {
  const listRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  const [scrollWidth, setScrollWidth] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [sectionTop, setSectionTop] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(0);
  const [activeSkill, setActiveSkill] = useState<SkillItem | null>(null);

  useLayoutEffect(() => {
    const onResize = () => {
      if (listRef.current) {
        setScrollWidth(listRef.current.scrollWidth);
      }
      setWindowWidth(window.innerWidth);

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        setSectionTop(top);
        setSectionHeight(sectionRef.current.offsetHeight);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const moveDistance = scrollWidth - windowWidth;
  const startScroll = sectionTop;
  const endScroll = sectionTop + sectionHeight;

  const xRange = useTransform(scrollY, [startScroll, endScroll], [0, -moveDistance], { clamp: false });

  const skillVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10,
      },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
      transition: { type: "spring", stiffness: 300 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <section id="skill-motion" className="skill-section" ref={sectionRef} aria-label="Skill Section">
      <div className="sticky-container">
        <motion.h2 className="title" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 100 }}>
          SKILLS
        </motion.h2>

        <motion.div className="horizontal-list" ref={listRef} style={{ x: xRange }}>
          <AnimatePresence>
            {skillItems.map((item, i) => (
              <motion.div
                key={i}
                className={`skill-item ${item.color}`}
                variants={skillVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                tabIndex={0}
                aria-label={`${item.title} skill`}
                onClick={() => setActiveSkill(item)}
                onMouseEnter={() => setActiveSkill(item)}
                onMouseLeave={() => setActiveSkill(null)}
              >
                <motion.div className="icon-wrap" aria-hidden="true" initial={{ rotate: -180 }} animate={{ rotate: 0 }} transition={{ type: "spring", stiffness: 200 }}>
                  <FontAwesomeIcon icon={item.icon} className="fa-2xl" />
                </motion.div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {activeSkill && (
            <motion.div className="skill-detail" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}>
              <h3>{activeSkill.title} Details</h3>
              <p>{activeSkill.description}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
