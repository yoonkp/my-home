import { useState } from "react";
import img1 from "/assets/images/digital-demo.png";
import EffectModal from "./modal/EffectModal";
import SnowEffect from "./effect/SnowEffect";
import CloudEffect from "./effect/CloudEffect";
import WaveEffect from "./effect/WaveEffect";

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
    EffectModal2: { title: "파도 효과", EffectComponent: WaveEffect },
    EffectModal3: { title: "구름 떠다니는 효과", EffectComponent: CloudEffect },
  };

  return (
    <>
      <section id="project-detail" className="content prd-detail">
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
          <article className="effect__wrap">
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
        </section>
        <section className="detail__info">
          <div className="title-area">
            <h2>프로젝트</h2>
          </div>
          <div className="txt-area">
            <p>러쉬에서 만든 디지털 데모 입니다.</p>
          </div>
        </section>
      </section>

      {/* Modal */}
      {modals && <EffectModal title={modalMapping[modals].title} closeModal={closeModal} EffectComponent={modalMapping[modals].EffectComponent} />}
    </>
  );
}
