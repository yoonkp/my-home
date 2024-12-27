import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <header className="inner">
      <h1 className="logo">
        <NavLink to="/" className="logo-link">
          박윤경
        </NavLink>
      </h1>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/skill">Skill</NavLink>
          </li>
          <li>
            <NavLink to="/projects">Projects</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
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
