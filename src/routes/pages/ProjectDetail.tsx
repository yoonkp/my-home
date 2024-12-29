import { useState } from "react";
import img1 from "/assets/images/digital-demo.png";
import EffectModal from "./modal/EffectModal";
import SnowEffect from "./effect/SnowEffect";

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

  const openModal = (modalName: ModalKey) => {
    setModals(modalName);
    setActiveEffect(modalName);
  };

  const closeModal = () => {
    setModals(null);
  };

  const modalMapping: ModalMapping = {
    EffectModal1: { title: "눈 내리는 효과", EffectComponent: SnowEffect },
    EffectModal2: { title: "효과 2", EffectComponent: () => <p>효과 2 내용</p> },
    EffectModal3: { title: "효과 3", EffectComponent: () => <p>효과 3 내용</p> },
  };

  return (
    <>
      <section id="project-detail" className="content">
        <section className="detail__wrap">
          <article className="detail__content">
            <div className="title-area">
              <h2>프로젝트</h2>
              <select name="prd" id="prd">
                <option value="project1">러쉬 디지털 데모</option>
                <option value="project2">프로젝트2</option>
              </select>
            </div>
            <figure className="thumb">
              <img src={img1} alt="LUSH 디지털 데모 시연 영상" />
            </figure>
          </article>
          <article className="detail__info">
            <div className="title-area">
              <h2>프로젝트</h2>
            </div>
            <div className="txt-area">
              <p>러쉬에서 만든 디지털 데모 입니다.</p>
            </div>
          </article>
        </section>
        <section className="effect__wrap">
          <article className="effect__content">
            <ul className="effect-list mini-scroll">
              {Object.keys(modalMapping).map((key) => (
                <li key={key} className={key === activeEffect ? "active" : ""}>
                  <button onClick={() => openModal(key as ModalKey)}>{modalMapping[key as ModalKey].title}</button>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </section>

      {/* Modal */}
      {modals && <EffectModal title={modalMapping[modals].title} closeModal={closeModal} EffectComponent={modalMapping[modals].EffectComponent} />}
    </>
  );
}
