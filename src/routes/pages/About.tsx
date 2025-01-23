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

export default function About() {
  return (
    <section id="about" className="">
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
    </section>
  );
}
