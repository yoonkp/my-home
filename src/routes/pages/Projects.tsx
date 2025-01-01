import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/swiper-bundle.css";
import { NavLink } from "react-router-dom";

const projects = [
  {
    id: 1,
    title: "우즈벡 대학교 학사관리 PC & Mobile App",
    description: "Kendo UI를 활용한 LMS 시스템",
    tags: ["React", "TypeScript", "Kendo UI"],
    imageClass: "img-1",
    link: "/project-detail2",
  },
  // {
  //   id: 2,
  //   title: "우즈벡 대학교 학사관리 PC",
  //   description: "Kendo UI를 활용한 LMS 시스템",
  //   tags: ["React", "TypeScript", "Kendo UI"],
  //   imageClass: "img-2",
  //   link: "/project-detail2",
  // },
  {
    id: 3,
    title: "삼성E&A 대시보드",
    description: "React를 활용한 대시보드 시스템",
    tags: ["React", "MUI", "AG-Grid"],
    imageClass: "img-3",
    link: "/project-detail3",
  },
  {
    id: 4,
    title: "LUSH Fresh Sale App",
    description: "Next.js를 활용한 쇼핑몰 앱",
    tags: ["Next", "React", "Tailwind"],
    imageClass: "img-4",
    link: "/project-detail",
  },
];

export default function Projects() {
  return (
    <section id="project" className="content">
      <article className="sub__content project__wrap">
        <h2 className="title">PROJECT TYPE</h2>
        <div className="project__list">
          <Swiper
            spaceBetween={30}
            slidesPerView={4}
            speed={6000}
            loop={true}
            pagination={{ clickable: true }}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination]}
            breakpoints={{
              320: { slidesPerView: 1.3, spaceBetween: 16, autoplay: false, pagination: true },
              768: { slidesPerView: 2, spaceBetween: 30, autoplay: true, pagination: false },
              1024: { slidesPerView: 3, spaceBetween: 30 },
            }}
            className="custom-swiper px30 pb40"
          >
            {projects.map((project) => (
              <SwiperSlide key={project.id}>
                <NavLink to={project.link} className="project-item" aria-label={`${project.title} 상세 페이지로 이동`}>
                  <figure className={`project-img ${project.imageClass}`}></figure>
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tags">
                      {project.tags.map((tag, index) => (
                        <span className="tag" key={index}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </NavLink>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </article>
    </section>
  );
}
