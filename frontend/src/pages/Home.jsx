import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function Home() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    client.get("/dashboard/")
      .then((res) => { if (isMounted) setDashboard(res.data); })
      .catch(() => { if (isMounted) setError("Erro ao carregar dados."); });
    return () => { isMounted = false; };
  }, []);

  const simulationFinished =
    dashboard && dashboard.total_matches > 0
      ? dashboard.played_matches === dashboard.total_matches
      : false;

  if (error) {
    return (
      <div className="page">
        <p className="loading-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="home-hero">
        <h1>
          Copa do Mundo <span>2026</span>
        </h1>
        <p>
          Simule todos os jogos da Copa do Mundo FIFA 2026 — Estados Unidos,
          México e Canadá. 48 seleções, 12 grupos, 104 partidas.
        </p>

        {dashboard && (
          <div className="home-stats">
            <div className="home-stat">
              <div className="home-stat-value">48</div>
              <div className="home-stat-label">Seleções</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-value">{dashboard.total_groups}</div>
              <div className="home-stat-label">Grupos</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-value">{dashboard.played_matches}</div>
              <div className="home-stat-label">Simuladas</div>
            </div>
            <div className="home-stat">
              <div className="home-stat-value">{dashboard.total_matches}</div>
              <div className="home-stat-label">Total</div>
            </div>
          </div>
        )}

        <div className="home-actions">
          {!simulationFinished ? (
            <Link to="/matches" className="btn btn-primary">
              Iniciar Simulação
            </Link>
          ) : (
            <>
              <Link to="/standings" className="btn btn-primary">
                Ver Resultados
              </Link>
              <Link to="/matches" className="btn btn-secondary">
                Nova Simulação
              </Link>
            </>
          )}
        </div>

        {simulationFinished && (
          <p className="home-done-text">Simulação concluída.</p>
        )}
      </div>
    </div>
  );
}
