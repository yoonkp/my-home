import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

/** 테마 타입 */
type ThemeType = "light" | "dark";

const Header: React.FC = () => {
  const [theme, setTheme] = useState<ThemeType>("light");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  /** 테마 변경 함수 */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    setMenuOpen(!menuOpen);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header inner" role="banner">
      <h1 className="logo">
        <Link to="/" className="logo-link">
          <div className="logo-animation">
            <span className="logo-letter">박</span>
            <span className="logo-letter">윤</span>
            <span className="logo-letter">경</span>
          </div>
        </Link>
      </h1>

      <button className="hamburger-menu" onClick={toggleMenu} aria-label="메뉴 열기/닫기" aria-expanded={menuOpen}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </button>

      {/* 내비게이션 */}
      <nav className={`navigation ${menuOpen ? "open" : ""}`} role="navigation" aria-label="메인 메뉴">
        <ul className="menu-list">
          <li>
            <Link to="/" state={{ sectionId: "home" }} className="nav-button" onClick={toggleMenu}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/" state={{ sectionId: "project" }} className="nav-button" onClick={toggleMenu}>
              Projects
            </Link>
          </li>
          <li>
            <Link to="/" state={{ sectionId: "skill" }} className="nav-button" onClick={toggleMenu}>
              Skill
            </Link>
          </li>
          <li>
            <Link to="/" state={{ sectionId: "contact" }} className="nav-button" onClick={toggleMenu}>
              Contact
            </Link>
          </li>
        </ul>

        <div className="button-wrap">
          <button onClick={toggleTheme} className="theme-toggle" aria-label={`현재 테마: ${theme}, 테마 전환`}>
            <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
          </button>

          <Link to="https://buly.kr/2qXkkys" target="_blank" rel="noopener noreferrer" className="resume-btn">
            이력서 보기
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
