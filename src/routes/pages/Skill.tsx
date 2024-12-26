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
    icon: faHtml5,
    color: "txt-red",
    title: "HTML5",
    description: "웹 접근성과 SEO 최적화를 위한 시멘틱 마크업 구현",
  },
  {
    icon: faCss3Alt,
    color: "txt-blue",
    title: "CSS3",
    description: "SCSS, BEM, CSS-in-JS를 활용한 모듈화된 스타일 관리 및 반응형 디자인",
  },
  {
    icon: faJs,
    color: "txt-yellow",
    title: "JavaScript",
    description: "ES6+ 문법과 비동기 처리로 사용자 친화적인 인터페이스 개발",
  },
  {
    icon: faReact,
    color: "txt-sky",
    title: "React",
    description: "함수형 컴포넌트와 Hooks 활용한 상태 관리",
  },
  {
    icon: faGitAlt,
    color: "txt-orange",
    title: "Git",
    description: "Git을 활용한 협업 및 버전 관리",
  },
  {
    icon: faLayerGroup,
    color: "txt-font-b",
    title: "Library",
    description: "MUI, AG-Grid, Kendo UI, Chart.js와 같은 라이브러리를 활용한 생산적인 UI 개발",
  },
  {
    icon: faProjectDiagram,
    color: "txt-gray",
    title: "도메인 주도 퍼블리싱",
    description: "도메인 모델에 기반하여 효율적이고 확장 가능한 UI 구현",
  },
  {
    icon: faFigma,
    color: "txt-red",
    title: "Figma",
    description: "디자인 시스템 구축 및 팀원 간 효율적인 협업을 위한 Figma 활용",
  },
];

export default function Skill() {
  return (
    <section id="skill" className="inner content">
      <article className="sub__content about__wrap">
        <h2 className="title">ABOUT</h2>
        <ul className="about__list">
          {aboutItems.map((item, index) => (
            <li key={index} className="about-item">
              <div className="icon-wrap">
                <i className={`${item.iconClass} w32 h32 bgc-black`} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </article>
      <article className="sub__content skill__wrap">
        <h2 className="title">SKILLS</h2>
        <ul className="skill__list">
          {skillItems.map((item, index) => (
            <li key={index} className="skill-item">
              <div className={`icon-wrap ${item.color}`}>
                <FontAwesomeIcon className="fa-2xl" icon={item.icon} style={{ width: "32px", height: "32px" }} />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}
