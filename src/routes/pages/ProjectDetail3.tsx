import { useState } from "react";
import img1 from "/assets/images/ai-1.jpg";

export default function ProjectDetail3() {
  const projectList = [
    {
      title: "삼성 E&A - 대시보드1",
      description: [
        "삼성엔지니어링의 주요 프로젝트 데이터를 실시간으로 관리하는 대시보드로, 대규모 데이터를 효율적으로 시각화할 수 있도록 설계되었습니다.",
        "이 대시보드는 React와 Material-UI를 사용하여 구축되었으며, AG-Grid를 활용해 대용량 데이터를 빠르고 직관적으로 처리할 수 있습니다.",
        "프로젝트는 글로벌 팀과 협업하여 개발되었으며, 효율적인 데이터 관리와 분석을 지원합니다.",
      ],
      skills: ["React", "Material-UI", "AG-Grid"],
    },
    {
      title: "삼성 E&A - 대시보드2",
      description: ["삼성 E&A 대시보드2는 프로젝트의 진행 상황을 실시간으로 모니터링할 수 있는 시스템입니다.", "이 프로젝트는 TypeScript를 사용하여 코드의 안정성과 유지보수성을 높였습니다."],
      skills: ["React", "TypeScript"],
    },
    {
      title: "삼성 E&A - 대시보드3",
      description: ["삼성 E&A 대시보드3의 설명입니다."],
      skills: ["React"],
    },
    {
      title: "삼성 E&A - 대시보드4",
      description: ["삼성 E&A 대시보드4의 설명입니다."],
      skills: ["React"],
    },
    {
      title: "삼성 E&A - 대시보드5",
      description: ["삼성 E&A 대시보드5의 설명입니다."],
      skills: ["React"],
    },
    {
      title: "삼성 E&A - 대시보드6",
      description: ["삼성 E&A 대시보드6의 설명입니다."],
      skills: ["React"],
    },
  ];

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; description: string[]; skills: string[] }>({ title: "", description: [], skills: [] });

  const openModal = (content: { title: string; description: string[]; skills: string[] }) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <section id="project-detail3" className="content prd-detail type3">
        <section className="detail__wrap">
          <div className="img-wrap flex-1">
            <img src={img1} alt="삼성E&A 대시보드 화면" />
          </div>
          <article className="detail__content flex-2">
            <div className="content-area ">
              <div className="title-area tc py32">
                <h2>넥스트리 & 삼성E&A</h2>
                <p>각 항목을 클릭하여 자세한 내용을 확인하세요.</p>
              </div>
              <ul className="project__list">
                {projectList.map((project, index) => (
                  <li className="pointer" key={index} onClick={() => openModal(project)}>
                    {project.title}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </section>
      </section>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-wrap" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top">
              <h2>{modalContent.title}</h2>
              <button className="btn-close" onClick={closeModal}>
                <i className="icon-close w16 h16"></i>
              </button>
            </div>
            <div className="modal-cont txt-area">
              {modalContent.description.map((desc, index) => (
                <p key={index}>{desc}</p>
              ))}
              <h3>사용 기술</h3>
              <ul className="skills">
                {modalContent.skills.map((skill, index) => (
                  <li key={index}>#{skill}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
