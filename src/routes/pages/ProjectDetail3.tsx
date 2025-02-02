import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import heroImage from "/assets/images/project3.png";

export default function SamsungEAPortfolio() {
  // 애니메이션 컨트롤 객체 생성
  const controls = useAnimation();

  useEffect(() => {
    controls.set({ opacity: 0, y: 20 });
    controls.start({ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } });
  }, [controls]);

  return (
    <section id="project-detail3" className="content prd-detail type3">
      <div className="detail__wrap">
        <div className="hero-image">
          <img src={heroImage} alt="삼성E&A 백오피스 홈페이지" />
        </div>
        <motion.div className="detail__info" animate={controls}>
          <div className="title-area">
            <h2>📚 삼성E&A 백오피스 홈페이지 React 퍼블리싱</h2>
          </div>
          <div className="txt-area">
            <p>
              삼성엔지니어링의 주요 프로젝트 데이터를 실시간으로 관리하는 대시보드로, 대규모 데이터를 효율적으로 시각화할 수 있도록 설계되었습니다. <br />
              이 대시보드는 React와 Material-UI를 사용하여 구축되었으며, AG-Grid를 활용해 대용량 데이터를 빠르고 직관적으로 처리할 수 있습니다. <br />
              Ag-grid 라이브러리 다각도 커스터마이징을 통해 사용자 경험을 향상시키고, 사용자가 데이터를 더 쉽게 관리할 수 있도록 구현했습니다.
            </p>
            <ul>
              <li>
                <strong>- 기여도: </strong>100%
              </li>
              <li>
                <strong>- 주요 역할: </strong>Ag-grid 라이브러리를 활용한 SCSS 및 React 기반 웹페이지 제작
              </li>
              <li className="flex alignCenter gap8">
                <strong>- 사용 기술: </strong>
                <div className="tags small color">
                  <span className="tag">React</span>
                  <span className="tag">JavaScript</span>
                  <span className="tag">Sass</span>
                  <span className="tag">MUI</span>
                  <span className="tag">AG-grid</span>
                  <span className="tag">Vite</span>
                </div>
              </li>
              <li>
                <strong>- 특징: </strong>Ag-grid 라이브러리를 활용한 다양한 데이터 표현 및 관리 기능 구현
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
