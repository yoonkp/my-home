import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      // URL 업데이트
      window.history.pushState(null, "", `/${sectionId}`);
    }
  };

  return (
    <header className="inner">
      <h1 className="logo">
        <Link to="/" className="logo-link">
          박윤경
        </Link>
      </h1>
      <nav>
        <ul>
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
        <button
          onClick={toggleTheme}
          style={{
            padding: "8px",
            borderRadius: "50%",
            background: "var(--button-bg)",
            color: "var(--button-text)",
            border: "none",
            cursor: "pointer",
            zIndex: 1000,
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            transition: "background 0.3s",
          }}
        >
          <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} />
        </button>
        <Link to="/" className="btn">
          이력서 보기
        </Link>
      </nav>
    </header>
  );
}
