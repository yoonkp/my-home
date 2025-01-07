import Hero from "/assets/images/hero.jpg";
import Img1 from "/assets/images/main1.jpg";
import Img2 from "/assets/images/main2.png";
import Img3 from "/assets/images/main3.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSitemap, faPencilRuler, faCode } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFlip } from "swiper/modules"; // EffectFlip 모듈 추가

import "swiper/swiper-bundle.css";

export default function Visual() {
  return (
    <div className="visual-wrap">
            <div className="hero-img">
              <img src={Hero} alt="Hero Image" />
            </div>
            <article className="content">
              <div className="info-wrap">
                <Swiper
                  effect="flip"
                  grabCursor={true}
                  direction="vertical"
                  loop={true}
                  // autoplay={{
                  //   delay: 2000,
                  //   disableOnInteraction: false,
                  // }}
                  speed={2000}
                  modules={[Autoplay, EffectFlip]}
                  className="custom-swiper"
                >
                  <SwiperSlide>
                    <div className="info-item">
                      <figure className="project-img img-1">
                        <img src={Img1} alt="Domain Model Image" />
                      </figure>
                      <div className="info-txt">
                        <h3>도메인 모델</h3>
                        <p>비즈니스 로직을 반영한 도메인 구조를 설계하여 UI 요구사항을 도출합니다.</p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="info-item">
                      <figure className="project-img img-2">
                        <img src={Img2} alt="UI Design Image" />
                      </figure>
                      <div className="info-txt">
                        <h3>UI 설계</h3>
                        <p>도메인 모델을 기반으로 UI 요구사항을 체계적 으로 정의했습니다.</p>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="info-item">
                      <figure className="project-img img-3">
                        <img src={Img3} alt="Publishing Image" />
                      </figure>
                      <div className="info-txt">
                        <h3>기술 구현</h3>
                        <p>React와 AG-Grid, MUI를 사용해 대규모 데이터를 처리하고 사용자 경험을 개선했습니다.</p>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
              <ul className="dialog-list">
                <li>
                  <div className="icon">
                    <FontAwesomeIcon icon={faSitemap} />
                  </div>
                  <p>도메인 모델</p>
                </li>
                <li>
                  <div className="icon">
                    <FontAwesomeIcon icon={faPencilRuler} />
                  </div>
                  <p>UI 설계</p>
                </li>
                <li>
                  <div className="icon">
                    <FontAwesomeIcon icon={faCode} />
                  </div>
                  <p>퍼블리싱</p>
                </li>
              </ul>
            </article>
          </div>
  )
}