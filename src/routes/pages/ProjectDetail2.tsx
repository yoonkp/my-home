import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import app1 from "/assets/images/edulime-app-1.png";
import app2 from "/assets/images/edulime-app-2.png";
import app3 from "/assets/images/edulime-app-3.png";
import app4 from "/assets/images/edulime-app-4.png";
import pc1 from "/assets/images/edulime-pc-1.png";
import pc2 from "/assets/images/edulime-pc-2.png";
import pc3 from "/assets/images/edulime-pc-3.png";
import pc4 from "/assets/images/edulime-pc-4.png";
import { Link } from "react-router-dom";

// Framer Motion variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const articleVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const imageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.15, duration: 0.5, ease: "easeOut" },
  }),
};

const infoVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } },
};

export default function ProjectDetail2() {
  const mobileImages = [app1, app2, app3, app4];
  const pcImages = [pc1, pc2, pc3, pc4];

  // 애니메이션 컨트롤 객체 생성
  const controls = useAnimation();

  useEffect(() => {
    controls.set({ opacity: 0, y: 20 });
    controls.start({ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.6 } });
  }, [controls]);

  const renderImages = (images: string[], altText: string) =>
    images.map((image, index) => (
      <motion.figure key={index} className="thumb" custom={index} variants={imageVariants} initial="hidden" animate={controls}>
        <img src={image} alt={`${altText} 화면 ${index + 1}`} />
      </motion.figure>
    ));

  return (
    <motion.section
      id="project-detail2"
      className="content prd-detail type3"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      animate={controls}
    >
      <motion.section className="detail__info" variants={infoVariants} animate={controls}>
        <div className="title-area">
          <h2>📚 Edulime LMS 시스템 UI 개발</h2>
        </div>
        <div className="txt-area">
          <p>
            <strong>Edulime LMS 시스템</strong>은 우즈베키스탄에서 발주된 교육 관리 시스템 프로젝트로, 글로벌 협업과 최신 기술을 통해 완성되었습니다.
          </p>
          <ul>
            <li>
              <strong>- 링크: </strong>
              <Link className="prd-link" to="https://apps.apple.com/kr/app/edulime/id6740257837" target="_blank" rel="noreferrer">
                2025.01.21 앱스토어 출시 (링크 바로가기){" "}
              </Link>
            </li>
            <li>
              <strong>- 기여도: </strong>50%
            </li>
            <li>
              <strong>- 주요 역할: </strong>도메인 모델을 기반으로 UI 목업을 설계하고, React로 퍼블리싱 작업 수행
            </li>
            <li>
              <strong>- 구축 내용: </strong>학과 정보 입력 및 관리 기능을 포함한 대시보드 구현 (React 및 Kendo 사용)
            </li>

            <li className="flex alignCenter gap8">
              <strong>- 사용 기술: </strong>
              <div className="tags small color">
                <span className="tag">React</span>
                <span className="tag">TypeScript</span>
                <span className="tag">JavaScript</span>
                <span className="tag">Kendo UI</span>
                <span className="tag">Sass</span>
                <span className="tag">Git</span>
                <span className="tag">Vite</span>
              </div>
            </li>
            <li>
              <strong>- 특징: </strong>PC 화면은 도메인 모델 기반으로 설계 및 퍼블리싱 되었습니다. CRUD (Create, Read, Update, Delete) 기능이 포함된 UI 목업 및 퍼블리싱 작업을 수행했습니다.
            </li>
          </ul>
          <p>
            본 프로젝트는 약 <strong>GDP 112.7억 달러</strong>의 국가에서 발주되었으며, 우즈베키스탄 개발자들과의 긴밀한 협업을 통해 진행되었습니다. <br />
            모든 과정은 <strong>영어</strong>로 소통하며 글로벌 팀워크와 효과적인 프로젝트 관리 역량을 발휘했습니다.
          </p>
        </div>
      </motion.section>

      {/* 모바일 & PC 화면 상세 섹션 */}
      <section className="detail__wrap">
        <motion.article className="detail__content mobile-content flex-1" variants={articleVariants} animate={controls}>
          <div className="title-area mobile-title">
            <h2>
              📱 Edulime LMS <span className="txt-green fw-600">모바일</span> 앱
            </h2>
          </div>
          <div className="img-wrap">{renderImages(mobileImages, "Edulime LMS 시스템 Mobile App")}</div>
        </motion.article>

        <div className="divider" />

        <motion.article className="detail__content pc-content flex-3" variants={articleVariants} animate={controls}>
          <div className="title-area pc-title">
            <h2>
              🖥️ Edulime LMS <span className="txt-main fw-600">PC</span> 시스템
            </h2>
          </div>
          <div className="img-wrap">{renderImages(pcImages, "Edulime LMS 시스템 PC")}</div>
        </motion.article>
      </section>
    </motion.section>
  );
}
