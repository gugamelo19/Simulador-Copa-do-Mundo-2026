import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h1>Simulador Copa 2026</h1>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/groups">Grupos</Link>
        <Link to="/matches">Partidas</Link>
        <Link to="/standings">Classificação</Link>
      </div>
    </nav>
  );
}