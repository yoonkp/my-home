import app1 from "/assets/images/edulime-app-1.png";
import app2 from "/assets/images/edulime-app-2.png";
import app3 from "/assets/images/edulime-app-3.png";
import app4 from "/assets/images/edulime-app-4.png";
import pc1 from "/assets/images/edulime-pc-1.png";
import pc2 from "/assets/images/edulime-pc-2.png";
import pc3 from "/assets/images/edulime-pc-3.png";
import pc4 from "/assets/images/edulime-pc-4.png";

export default function ProjectDetail2() {
  const mobileImages = [app1, app2, app3, app4];
  const pcImages = [pc1, pc2, pc3, pc4];

  const renderImages = (images: string[], altText: string) =>
    images.map((image, index) => (
      <figure key={index} className="thumb">
        <img src={image} alt={`${altText} 화면 ${index + 1}`} />
      </figure>
    ));

  return (
    <>
      <section id="project-detail2" className="content prd-detail">
        <section className="detail__wrap">
          <article className="detail__content flex-1">
            <div className="title-area">
              <h2>Edulime LMS 모바일 앱 시스템</h2>
            </div>
            <div className="img-wrap">{renderImages(mobileImages, "Edulime LMS 시스템 Mobile App")}</div>
          </article>
          <article className="detail__content flex-3">
            <div className="title-area">
              <h2>Edulime LMS PC 시스템</h2>
            </div>
            <div className="img-wrap">{renderImages(pcImages, "Edulime LMS 시스템 PC")}</div>
          </article>
        </section>
        <section className="detail__info">
          <div className="title-area">
            <h2>&#128400; Edulime LMS 시스템 UI 개발</h2>
          </div>
          <div className="txt-area">
            <p>
              <strong>Edulime LMS 시스템</strong>은 우즈베키스탄에서 발주된 교육 관리 시스템 프로젝트로, 글로벌 협업과 최신 기술을 통해 완성되었습니다.
            </p>
            <ul>
              <li>
                <strong>- 사용 기술:</strong> React, TypeScript, Kendo UI
              </li>
              <li>
                <strong>- 특징:</strong> PC 화면은 도메인 모델 기반으로 설계 및 퍼블리싱되었습니다.
              </li>
            </ul>
            <p>
              본 프로젝트는 약 <strong>GDP 112.7억 달러</strong>의 국가에서 발주되었으며, <br />
              우즈베키스탄 개발자들과의 긴밀한 협업을 통해 진행되었습니다. <br />
              모든 과정은 <strong>영어</strong>로 소통하며 글로벌 팀워크와 효과적인 프로젝트 관리 역량을 발휘했습니다.
            </p>
          </div>
        </section>
      </section>
    </>
  );
}
