import { useState } from "react";
import img1 from "/assets/images/digital-demo2.png";
import EffectModal from "./modal/EffectModal";
import SnowEffect from "./effect/SnowEffect";
import CloudEffect from "./effect/CloudEffect";
import WaveEffect from "./effect/WaveEffect";
import { Link } from "react-router-dom";

type ModalKey = "EffectModal1" | "EffectModal2" | "EffectModal3";

interface ModalConfig {
  title: string;
  EffectComponent: React.ComponentType;
}

type ModalMapping = {
  [key in ModalKey]: ModalConfig;
};

export default function ProjectDetail() {
  const [modals, setModals] = useState<ModalKey | null>(null);
  const [activeEffect, setActiveEffect] = useState<ModalKey | null>(null);
  // 효과 영역(open/close) 상태 관리
  const [effectOpen, setEffectOpen] = useState(false);

  const openModal = (modalName: ModalKey) => {
    setModals(modalName);
    setActiveEffect(modalName);
    setEffectOpen((prev) => !prev);
  };

  const closeModal = () => {
    setModals(null);
  };

  const toggleEffectWrap = () => {
    setEffectOpen((prev) => !prev);
  };

  const modalMapping: ModalMapping = {
    EffectModal1: { title: "눈 내리는 효과", EffectComponent: SnowEffect },
    EffectModal2: { title: "파도 효과", EffectComponent: WaveEffect },
    EffectModal3: { title: "구름 떠다니는 효과", EffectComponent: CloudEffect },
  };

  return (
    <>
      <section id="project-detail" className="content prd-detail">
        <section className="detail__wrap">
          <article className="detail__content">
            <div className="title-area">
              <h2>LUSH 프로젝트</h2>
              <select name="prd" id="prd">
                <option value="project1">러쉬 디지털 데모</option>
                {/* <option value="project2">프로젝트2</option> */}
              </select>
            </div>
            <figure className="thumb">
              <img src={img1} alt="LUSH 디지털 데모 이미지" />
            </figure>
          </article>
          <article className={`effect__wrap ${effectOpen ? "open" : ""}`}>
            <div className="effect__content">
              <ul className="effect-list mini-scroll">
                {Object.keys(modalMapping).map((key) => (
                  <li key={key} className={key === activeEffect ? "active" : ""}>
                    <button onClick={() => openModal(key as ModalKey)}>{modalMapping[key as ModalKey].title}</button>
                  </li>
                ))}
              </ul>
            </div>
          </article>
          <button className={`m-effect-button ${effectOpen ? "close" : ""}`} aria-label="효과 버튼" onClick={toggleEffectWrap}></button>
        </section>
        <section className="detail__info">
          <div className="title-area">
            <h2>러쉬 디지털 데모</h2>
          </div>
          <div className="txt-area">
            <div>
              <strong>- 링크: </strong>
              <Link className="prd-link" to="https://www.lush.co.kr/m/digital-demo/main" target="_blank" rel="noreferrer">
                디지털 데모 (링크 바로가기)
              </Link>
            </div>
            <p>
              <strong>기여도: </strong>100%
            </p>
            <p>아이패드 가로모드 적응형 디지털 데모 퍼블리싱</p>
            <div className="tags small color">
              <span className="tag">HTML</span>
              <span className="tag">CSS</span>
              <span className="tag">JavaScript</span>
            </div>
          </div>
        </section>
      </section>

      {/* Modal */}
      {modals && <EffectModal title={modalMapping[modals].title} closeModal={closeModal} EffectComponent={modalMapping[modals].EffectComponent} />}
    </>
  );
}
