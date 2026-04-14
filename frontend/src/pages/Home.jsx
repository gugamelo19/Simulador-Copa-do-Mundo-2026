import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function Home() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      try {
        const response = await client.get("/dashboard/");

        if (isMounted) {
          setDashboard(response.data);
        }
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);

        if (isMounted) {
          setError("Erro ao carregar dados do dashboard.");
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const simulationFinished =
    dashboard && dashboard.total_matches > 0
      ? dashboard.played_matches === dashboard.total_matches
      : false;

  if (error) {
    return (
      <div className="page">
        <div className="home-premium">
          <h2>Dashboard</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="page">
        <div className="home-premium">
          <h2>Dashboard</h2>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="home-premium">
        <div className="hero-icon">⚽</div>

        <h1 className="hero-title">
          Copa do Mundo <span>2026</span>
        </h1>

        <p className="hero-subtitle">
          Simule todos os jogos da Copa do Mundo FIFA 2026 — Estados Unidos,
          México e Canadá. 48 seleções, 12 grupos, 104 partidas.
        </p>

        <div className="hero-stats-grid">
          <div className="hero-stat-card">
            <div className="hero-stat-icon green">👥</div>
            <strong>48</strong>
            <span>Seleções</span>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon gold">🏆</div>
            <strong>{dashboard.total_groups}</strong>
            <span>Grupos</span>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon green">⚔️</div>
            <strong>{dashboard.played_matches}</strong>
            <span>Partidas Simuladas</span>
          </div>

          <div className="hero-stat-card">
            <div className="hero-stat-icon gold">📊</div>
            <strong>{dashboard.total_matches}</strong>
            <span>Total de Partidas</span>
          </div>
        </div>

        <div className="hero-actions">
          {!simulationFinished ? (
            <Link to="/matches" className="primary-hero-button">
              ▶ Iniciar Simulação
            </Link>
          ) : (
            <>
              <Link to="/standings" className="primary-hero-button">
                🏆 Ver Resultados
              </Link>

              <Link to="/matches" className="secondary-hero-button">
                ↻ Nova Simulação
              </Link>
            </>
          )}
        </div>

        {simulationFinished && (
          <p className="simulation-done-text">
            ✅ Simulação concluída! Explore os resultados nas abas acima.
          </p>
        )}
      </section>
    </div>
  );
}