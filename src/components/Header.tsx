import { Link, NavLink } from "react-router-dom";

export default function Header() {
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
        <Link to="/" className="btn">
          이력서 보기
        </Link>
      </nav>
    </header>
  );
}
