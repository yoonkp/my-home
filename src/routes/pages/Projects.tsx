import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { Link } from "react-router-dom";

export default function Projects() {
  return (
    <section id="project" className="content">
      <article className="sub__content project__wrap">
        <h2 className="title">PROJECT</h2>
        <div className="project__list">
          <Swiper
            spaceBetween={30}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            modules={[Navigation, Pagination]}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 30 },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="custom-swiper px30 pb40"
          >
            <SwiperSlide>
              <div className="project-item">
                <div className="project-img img-1"></div>
                <div className="project-info">
                  <h3>우즈벡 대학교 학사관리 Mobile App</h3>
                  <p>Kendo UI를 활용한 LMS 시스템</p>
                  <div className="tags">
                    <span className="tag">React</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">Kendo UI</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="project-item">
                <div className="project-img img-2"></div>
                <div className="project-info">
                  <h3>우즈벡 대학교 학사관리 PC</h3>
                  <p>Kendo UI를 활용한 LMS 시스템</p>
                  <div className="tags">
                    <span className="tag">React</span>
                    <span className="tag">TypeScript</span>
                    <span className="tag">Kendo UI</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="project-item">
                <div className="project-img img-3"></div>
                <div className="project-info">
                  <h3>삼성E&A 대시보드</h3>
                  <p>React를 활용한 대시보드 시스템</p>
                  <div className="tags">
                    <span className="tag">React</span>
                    <span className="tag">MUI</span>
                    <span className="tag">AG-Grid</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="project-item">
                <div className="project-img img-4"></div>
                <div className="project-info">
                  <h3>LUSH Fresh Sale App</h3>
                  <p>Next.js를 활용한 쇼핑몰 앱</p>
                  <div className="tags">
                    <span className="tag">Next</span>
                    <span className="tag">React</span>
                    <span className="tag">Tailwind</span>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </article>
      <article className="template__wrap">
        <h2 className="title">TEMPLATE</h2>
        <div className="py64 flex flexWrap gap32">
          <div className="thumb">
            <Link to="/">
              <img src="/assets/images/template.jpg" alt="Template Image" />
              <div className="overlay">
                <p>템플릿 보러 가기</p>
              </div>
            </Link>
          </div>
          <div className="template__info">
            <h3>기업 디자인 시안 샘플</h3>
            <p>기업 디자인 시안 샘플입니다.</p>
            <div className="tags">
              <span className="tag">React</span>
              <span className="tag">TypeScript</span>
              <span className="tag">HTML</span>
              <span className="tag">CSS</span>
              <span className="tag">SCSS</span>
              <span className="tag">MUI</span>
              <span className="tag">Tailwind</span>
              <span className="tag">JavaScript</span>
              <span className="tag">Next</span>
              <span className="tag">JQuery</span>
              <span className="tag">AG-Grid</span>
              <span className="tag">Chart.js</span>
              <span className="tag">Kendo UI</span>
              <span className="tag">Emotion</span>
              <span className="tag">Styled-Components</span>
              <span className="tag">CSS-in-JS</span>
              <span className="tag">BEM</span>
              <span className="tag">Git</span>
              <span className="tag">Figma</span>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
