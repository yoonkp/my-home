import { NavLink } from "react-router-dom";
import Hero from "/assets/images/hero.jpg";

export default function Home() {
  return (
    <main className="container">
      <section className="inner main__visual">
        <div className="text-box">
          <h2>
            안녕하세요,
            <br />
            UI 개발자 박윤경입니다.
          </h2>
          <p>
            사용자 경험을 중심으로 한 웹 개발과 디자인을 통해 가치있는 서비스를 만들어냅니다 <br />
            Domain-Driven Design, 기반의 퍼블리싱으로 효율성과 확장성을 고려한 코드를 작성합니다.
          </p>
          <NavLink to="/" className="btn gap10">
            프로젝트 보기
            <i className="icon-arrow-right w16 h14 bgc-white" />
          </NavLink>
        </div>
        <div className="hero-img">
          <img src={Hero} alt="Hero Image" />
        </div>
      </section>
    </main>
  );
}
