import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

/** 테마 타입 */
type ThemeType = "light" | "dark";

/** Header 컴포넌트 */
const Header: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  /** 테마 변경 함수 */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  /** 모바일 메뉴 토글 함수 */
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header inner" role="banner">
      {/* 로고 */}
      <h1 className="logo">
        <Link to="/" className="logo-link">
          박윤경
        </Link>
      </h1>

      {/* 햄버거 버튼 (모바일 전용) */}
      <button className="hamburger-menu" onClick={toggleMenu} aria-label="메뉴 열기/닫기" aria-expanded={menuOpen}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      {/* 내비게이션 */}
      <nav className={`navigation ${menuOpen ? "open" : ""}`} role="navigation" aria-label="메인 메뉴">
        <ul className="menu-list">
          <li>
            <Link to="/" state={{ sectionId: "home" }} className="nav-button">
              Home
            </Link>
          </li>
          <li>
            <Link to="/" state={{ sectionId: "project" }} className="nav-button">
              Projects
            </Link>
          </li>
          <li>
            <Link to="/" state={{ sectionId: "skill" }} className="nav-button">
              Skill
            </Link>
          </li>
          <li>
            <Link to="/" state={{ sectionId: "contact" }} className="nav-button">
              Contact
            </Link>
          </li>
        </ul>

        {/* 테마 토글 버튼 */}
        <button onClick={toggleTheme} className="theme-toggle" aria-label={`현재 테마: ${theme}, 테마 전환`}>
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </button>

        {/* 이력서 보기 버튼 */}
        <Link to="https://buly.kr/2qXkkys" target="_blank" rel="noopener noreferrer" className="resume-btn">
          이력서 보기
        </Link>
      </nav>
    </header>
  );
};

export default Header;
