import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3Alt, faJs, faReact, faFigma, faGitAlt } from "@fortawesome/free-brands-svg-icons";
import { faLayerGroup, faProjectDiagram } from "@fortawesome/free-solid-svg-icons";
// import "./SkillHorizontal.scss";

gsap.registerPlugin(ScrollTrigger);

export default function SkillHorizontal() {
  const containerRef = useRef<HTMLDivElement>(null); // pin 대상 전체 영역
  const scrollWrapRef = useRef<HTMLDivElement>(null); // 가로 스크롤될 영역

  // 예시 데이터
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

  useEffect(() => {
    const container = containerRef.current;
    const scrollWrap = scrollWrapRef.current;
    if (!container || !scrollWrap) return;

    // 스크롤해야 하는 총 거리 계산
    const totalWidth = scrollWrap.scrollWidth;
    const containerWidth = container.offsetWidth;
    const scrollDist = totalWidth - containerWidth;

    // 스크롤 트리거 구간 높이 = 컨테이너 기본 높이 + 수평 스크롤 거리
    // => 이 높이만큼 스크롤할 때까지 pin이 유지되며, 내부는 좌우로 이동
    const containerHeight = container.offsetHeight;
    const totalScrollHeight = containerHeight + scrollDist;
    container.style.height = `${totalScrollHeight}px`; // pin 구간 높이 보정

    // GSAP ScrollTrigger 생성
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: `+=${scrollDist}`, // 수평으로 이동할 거리만큼
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        // self.progress: 0 ~ 1
        // progress 만큼 -scrollDist를 곱해서 왼쪽으로 이동
        const progress = self.progress;
        gsap.set(scrollWrap, {
          x: -scrollDist * progress,
        });
      },
    });

    // ScrollTrigger cleanup
    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section id="skill" className="skill-horizontal">
      <div className="skill-container" ref={containerRef}>
        <h2 className="title">SKILLS</h2>
        <div className="skill-inner" ref={scrollWrapRef}>
          {skillItems.map((item, index) => (
            <div key={`skill_${index}`} className={`skill-item ${item.color}`} tabIndex={0}>
              <div className="icon-wrap" aria-hidden="true">
                <FontAwesomeIcon icon={item.icon} className="fa-2xl" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
