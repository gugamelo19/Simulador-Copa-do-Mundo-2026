import { useEffect, useState } from "react";
import client from "../api/client";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadStats() {
      try {
        const response = await client.get("/dashboard/stats/");
        if (isMounted) {
          setStats(response.data);
        }
      } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
        if (isMounted) {
          setError("Erro ao carregar estatísticas.");
        }
      }
    }

    loadStats();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="page">
        <section className="stats-page">
          <h1 className="section-title">
            <span>Estatísticas</span>
          </h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="page">
        <section className="stats-page">
          <h1 className="section-title">
            <span>Estatísticas</span>
          </h1>
          <p>Carregando estatísticas...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="stats-page">
        <h1 className="section-title">
          <span>Estatísticas</span>
        </h1>

        <p className="section-subtitle">
          Resumo do torneio, destaques da fase de grupos e ranking completo da simulação.
        </p>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Partidas Simuladas</h3>
            <p>{stats.summary.played_matches}</p>
          </div>

          <div className="dashboard-card">
            <h3>Partidas Pendentes</h3>
            <p>{stats.summary.pending_matches}</p>
          </div>

          <div className="dashboard-card">
            <h3>Campeão</h3>
            <p>{stats.summary.champion || "-"}</p>
          </div>

          <div className="dashboard-card">
            <h3>Vice-Campeão</h3>
            <p>{stats.summary.vice || "-"}</p>
          </div>
        </div>

        <div className="stats-highlight-grid">
          <div className="stats-ranking-card">
            <h3>Melhor Campanha da Fase de Grupos</h3>
            {stats.group_stage_highlights.best_team ? (
              <div className="stats-highlight-content">
                <p><strong>Seleção:</strong> {stats.group_stage_highlights.best_team.name}</p>
                <p><strong>Grupo:</strong> {stats.group_stage_highlights.best_team.group}</p>
                <p><strong>Pontos:</strong> {stats.group_stage_highlights.best_team.points}</p>
                <p><strong>Saldo:</strong> {stats.group_stage_highlights.best_team.goal_difference}</p>
              </div>
            ) : (
              <p>Sem dados.</p>
            )}
          </div>

          <div className="stats-ranking-card">
            <h3>Melhor Ataque da Fase de Grupos</h3>
            {stats.group_stage_highlights.best_attack ? (
              <div className="stats-highlight-content">
                <p><strong>Seleção:</strong> {stats.group_stage_highlights.best_attack.name}</p>
                <p><strong>Grupo:</strong> {stats.group_stage_highlights.best_attack.group}</p>
                <p><strong>Gols Pró:</strong> {stats.group_stage_highlights.best_attack.goals_for}</p>
              </div>
            ) : (
              <p>Sem dados.</p>
            )}
          </div>

          <div className="stats-ranking-card">
            <h3>Melhor Defesa da Fase de Grupos</h3>
            {stats.group_stage_highlights.best_defense ? (
              <div className="stats-highlight-content">
                <p><strong>Seleção:</strong> {stats.group_stage_highlights.best_defense.name}</p>
                <p><strong>Grupo:</strong> {stats.group_stage_highlights.best_defense.group}</p>
                <p><strong>Gols Sofridos:</strong> {stats.group_stage_highlights.best_defense.goals_against}</p>
              </div>
            ) : (
              <p>Sem dados.</p>
            )}
          </div>
        </div>

        <div className="stats-ranking-card">
          <h3>8 Melhores Terceiros Colocados</h3>

          <table className="standings-table premium">
            <thead>
              <tr>
                <th>Seleção</th>
                <th>Grupo</th>
                <th>Pts</th>
                <th>SG</th>
                <th>GP</th>
              </tr>
            </thead>
            <tbody>
              {stats.group_stage_highlights.best_thirds.map((item, index) => (
                <tr key={`${item.team_name}-${index}`}>
                  <td>{item.team_name}</td>
                  <td>{item.group}</td>
                  <td>{item.points}</td>
                  <td>{item.goal_difference}</td>
                  <td>{item.goals_for}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stats-ranking-card">
          <h3>Ranking Completo da Fase de Grupos</h3>

          <table className="standings-table premium">
            <thead>
              <tr>
                <th>#</th>
                <th>Seleção</th>
                <th>Grupo</th>
                <th>Pts</th>
                <th>J</th>
                <th>V</th>
                <th>E</th>
                <th>D</th>
                <th>GP</th>
                <th>GC</th>
                <th>SG</th>
              </tr>
            </thead>

            <tbody>
              {stats.full_ranking.map((item) => (
                <tr key={`${item.team_name}-${item.position}`}>
                  <td>{item.position}</td>
                  <td>{item.team_name}</td>
                  <td>{item.group}</td>
                  <td>{item.points}</td>
                  <td>{item.played}</td>
                  <td>{item.wins}</td>
                  <td>{item.draws}</td>
                  <td>{item.losses}</td>
                  <td>{item.goals_for}</td>
                  <td>{item.goals_against}</td>
                  <td>{item.goal_difference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}