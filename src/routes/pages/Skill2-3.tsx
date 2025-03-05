import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3Alt, faJs, faReact, faFigma, faGitAlt, faVuejs } from "@fortawesome/free-brands-svg-icons";
import { faLayerGroup, faProjectDiagram } from "@fortawesome/free-solid-svg-icons";

type SkillItem = {
  id: number;
  icon: any;
  color: string;
  title: string;
  description: string;
};

// 첫 번째 줄 (왼쪽 -> 오른쪽 이동)
const itemsLeft: SkillItem[] = [
  {
    id: 1,
    icon: faProjectDiagram,
    color: "txt-gray",
    title: "도메인 퍼블리싱",
    description: "도메인 모델 기반 확장성 높은 UI 구현",
  },
  {
    id: 2,
    icon: faHtml5,
    color: "txt-red",
    title: "HTML5",
    description: "시멘틱 마크업과 웹 접근성",
  },
  {
    id: 3,
    icon: faCss3Alt,
    color: "txt-blue",
    title: "CSS3",
    description: "SCSS, 반응형, BEM 활용",
  },
  {
    id: 4,
    icon: faJs,
    color: "txt-yellow",
    title: "JavaScript",
    description: "ES6+ 문법과 비동기 처리",
  },
  {
    id: 5,
    icon: faReact,
    color: "txt-sky",
    title: "React",
    description: "함수형 컴포넌트 & Hooks",
  },
];

// 두 번째 줄 (오른쪽 -> 왼쪽 이동)
const itemsRight: SkillItem[] = [
  {
    id: 1,
    icon: faVuejs,
    color: "txt-green",
    title: "Vue",
    description: "Vue3, Vuetify로 UI 구축",
  },
  {
    id: 2,
    icon: faGitAlt,
    color: "txt-orange",
    title: "Git",
    description: "협업과 버전 관리를 위한 Git",
  },
  {
    id: 3,
    icon: faLayerGroup,
    color: "txt-font-b",
    title: "Library",
    description: "MUI, AG-Grid 등 사용",
  },
  {
    id: 4,
    icon: faFigma,
    color: "txt-red",
    title: "Figma",
    description: "프로토타이핑 & 협업",
  },
];

export default function Skills() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const leftRange = isMobile ? [-600, 0, 600] : [-300, 0, 300];
  const rightRange = isMobile ? [500, 0, -500] : [300, 0, -300];

  const leftBlockX = useTransform(scrollYProgress, [0, 0.5, 1], leftRange);
  const rightBlockX = useTransform(scrollYProgress, [0, 0.5, 1], rightRange);

  return (
    <section id="skill" className="content">
      <article className="project__wrap">
        <div className="skill-section" ref={sectionRef}>
          <h2 className="title">SKILLS</h2>
          <div className="sticky-container">
            <motion.div className="skill-row layer-left" style={{ x: leftBlockX }}>
              {itemsLeft.map((item) => (
                <div key={item.id} className="layer-item">
                  <div className="flip-inner">
                    <div className={`flip-front ${item.color}`}>
                      <div className={`icon-wrap ${item.color}`}>
                        <FontAwesomeIcon icon={item.icon} className="fa-2xl" />
                      </div>
                      <h3>{item.title}</h3>
                    </div>
                    <div className="flip-back">
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.div className="skill-row layer-right" style={{ x: rightBlockX }}>
              {itemsRight.map((item) => (
                <div key={item.id} className="layer-item">
                  <div className="flip-inner">
                    <div className={`flip-front ${item.color}`}>
                      <div className={`icon-wrap ${item.color}`}>
                        <FontAwesomeIcon icon={item.icon} className="fa-2xl" />
                      </div>
                      <h3>{item.title}</h3>
                    </div>
                    <div className="flip-back">
                      <p>{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </article>
    </section>
  );
}
