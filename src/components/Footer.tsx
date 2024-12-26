import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top handler
  const handleScroll = () => {
    if (window.scrollY > 200) {
      setShowScrollTop(true);
    } else {
      setShowScrollTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <footer>
      <div className="flex justifyBetween pb32" style={{ alignItems: "center" }}>
        <div className="info">
          <h1 className="logo" style={{ fontSize: "24px", fontWeight: "bold" }}>
            <NavLink to="/" className="logo-link">
              박윤경
            </NavLink>
          </h1>
          <p className="mt16 txt-gray">안녕하세요, UI 개발자 박윤경입니다. 사용자 경험을 중심으로 하는 인터페이스를 만들어갑니다.</p>
        </div>
        <div className="social">
          <Link to="/" className="txt-border3" style={{ marginRight: "16px" }}>
            <FontAwesomeIcon icon={faGithub} style={{ width: "28px", height: "28px", color: "#333" }} />
          </Link>
        </div>
      </div>
      <p className="copy">© 2025 Park Yoon Kyung. All rights reserved.</p>
      {showScrollTop && (
        <button className="btn-scroll-top" onClick={scrollToTop} aria-label="Scroll to Top">
          ↑
        </button>
      )}
    </footer>
  );
}
