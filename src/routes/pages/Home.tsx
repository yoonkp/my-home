import Skill from "./Skill";
import Projects from "./Projects";

import MainVisualSection from "./MainVisualSection";
import MainGraph from "./MainGraph4-8";
import Visual from "./Visual";

export default function Home() {
  return (
    <main id="home" className="container">
      <section className="inner main__visual">
        <div className="text-box">
          <h2>
            안녕하세요,&nbsp;
            {/* <br /> */}
            UI 개발자 박윤경입니다.
          </h2>
          <ul className="tags">
            <li className="tag">#UI/UI전문가</li>
            <li className="tag">#소통전문가</li>
            <li className="tag">#팀워크</li>
            <li className="tag">#책임감</li>
            <li className="tag">#목표지향적</li>
            <li className="tag">#속도감</li>
          </ul>
          {/* <Visual /> */}
        </div>
      </section>

      <MainGraph />
      <MainVisualSection />
      {/* <Projects /> */}
      <Skill />
    </main>
  );
}
