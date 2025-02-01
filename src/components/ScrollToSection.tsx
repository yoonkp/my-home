// ScrollToSection.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToSection = () => {
  const location = useLocation();
  const headerOffset = 64; // 고정 헤더의 높이 (픽셀)

  useEffect(() => {
    const sectionId = (location.state as { sectionId?: string })?.sectionId;
    if (sectionId) {
      // DOM이 완전히 렌더링된 후에 스크롤하도록 약간의 딜레이 추가
      setTimeout(() => {
        if (sectionId === "contact") {
          // contact 섹션 (footer)인 경우
          const anchor = document.getElementById("contact-anchor");
          if (anchor) {
            // 앵커 요소의 실제 위치에서 헤더 높이만큼 위로 올려서 스크롤 위치 계산
            const anchorTop = anchor.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: anchorTop, behavior: "smooth" });
          } else {
            // 앵커가 없는 경우, 문서 최하단에서 헤더 높이만큼 뺀 위치로 스크롤
            const scrollPosition = document.documentElement.scrollHeight - window.innerHeight - headerOffset;
            window.scrollTo({ top: scrollPosition, behavior: "smooth" });
          }
        } else {
          // 다른 섹션의 경우
          const sectionElement = document.getElementById(sectionId);
          if (sectionElement) {
            const topOffset = sectionElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
            window.scrollTo({ top: topOffset, behavior: "smooth" });
          }
        }
      }, 0);
    }
  }, [location]);

  return null;
};

export default ScrollToSection;
