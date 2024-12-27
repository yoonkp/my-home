import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHtml5, faCss3Alt, faJs, faReact, faFigma, faGitAlt } from "@fortawesome/free-brands-svg-icons";
import { faLayerGroup, faProjectDiagram } from "@fortawesome/free-solid-svg-icons";

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

const skillItems = [
  {
    icon: faProjectDiagram,
    color: "txt-gray",
    title: "도메인 퍼블리싱",
    description: "도메인 모델 기반 확장성 높은 UI 구현",
  },
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

export default function Skill() {
  return (
    <section id="skill" className="">
      <article className="about__wrap content">
        <div className="sub__content">
          <h2 className="title">ABOUT</h2>
          <ul className="about__list">
            {aboutItems.map((item, index) => (
              <li key={index} className="about-item">
                <div className="icon-wrap">
                  <i className={`${item.iconClass} w32 h32`} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </article>
      <article className="skill__wrap bgc-main-bg">
        <div className="sub__content content">
          <h2 className="title">SKILLS</h2>
          <ul className="skill__list">
            {skillItems.map((item, index) => (
              <li key={index} className="skill-item">
                <div className={`icon-wrap ${item.color}`}>
                  <FontAwesomeIcon className="fa-2xl" icon={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <div className="desc">
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </section>
  );
}
