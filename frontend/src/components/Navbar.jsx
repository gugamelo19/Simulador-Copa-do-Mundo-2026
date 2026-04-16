import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "Início" },
    { path: "/groups", label: "Grupos" },
    { path: "/matches", label: "Partidas" },
    { path: "/standings", label: "Resultados" },
    { path: "/knockout", label: "Mata-Mata" },
    { path: "/stats", label: "Estatísticas" },
    { path: "/results", label: "Finais" },
  ];

  return (
    <nav className="navbar-premium">
      <div className="navbar-logo">
        🏆 Copa 2026 <span>Simulator</span>
      </div>

      <div className="navbar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? "nav-item active" : "nav-item"}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}