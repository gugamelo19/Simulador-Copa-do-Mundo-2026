import { useEffect, useState } from "react";
import client from "../api/client";

export default function Stats() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    client.get("/dashboard/stats/")
      .then((res) => { if (isMounted) setStats(res.data); })
      .catch(() => { if (isMounted) setError("Erro ao carregar estatísticas."); });
    return () => { isMounted = false; };
  }, []);

  if (error) return <div className="page"><p className="loading-text">{error}</p></div>;
  if (!stats) return <div className="page"><p className="loading-text">Carregando...</p></div>;

  const { summary, group_stage_highlights: hl, full_ranking } = stats;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Estatísticas</h1>
        <p className="page-subtitle">Resumo do torneio e destaques da fase de grupos</p>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <h4>Simuladas</h4>
          <p>{summary.played_matches}</p>
        </div>
        <div className="summary-card">
          <h4>Pendentes</h4>
          <p>{summary.pending_matches}</p>
        </div>
        <div className="summary-card">
          <h4>Campeão</h4>
          <p style={{ fontSize: 16 }}>{summary.champion || "—"}</p>
        </div>
        <div className="summary-card">
          <h4>Vice-Campeão</h4>
          <p style={{ fontSize: 16 }}>{summary.vice || "—"}</p>
        </div>
      </div>

      <div className="stats-highlights">
        <div className="stats-highlight-card">
          <h4>Melhor Campanha</h4>
          {hl.best_team ? (
            <p>
              <strong>{hl.best_team.name}</strong><br />
              Grupo {hl.best_team.group} · {hl.best_team.points} pts · SG {hl.best_team.goal_difference}
            </p>
          ) : <p style={{ color: "var(--text-muted)" }}>—</p>}
        </div>
        <div className="stats-highlight-card">
          <h4>Melhor Ataque</h4>
          {hl.best_attack ? (
            <p>
              <strong>{hl.best_attack.name}</strong><br />
              Grupo {hl.best_attack.group} · {hl.best_attack.goals_for} gols pró
            </p>
          ) : <p style={{ color: "var(--text-muted)" }}>—</p>}
        </div>
        <div className="stats-highlight-card">
          <h4>Melhor Defesa</h4>
          {hl.best_defense ? (
            <p>
              <strong>{hl.best_defense.name}</strong><br />
              Grupo {hl.best_defense.group} · {hl.best_defense.goals_against} gols sofridos
            </p>
          ) : <p style={{ color: "var(--text-muted)" }}>—</p>}
        </div>
      </div>

      <div className="data-card">
        <div className="data-card-header"><h3>8 Melhores Terceiros</h3></div>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Seleção</th>
              <th>Grupo</th>
              <th>Pts</th>
              <th>SG</th>
              <th>GP</th>
            </tr>
          </thead>
          <tbody>
            {hl.best_thirds.map((item, i) => (
              <tr key={`${item.team_name}-${i}`}>
                <td className="team-cell">{item.team_name}</td>
                <td>{item.group}</td>
                <td className="pts">{item.points}</td>
                <td>{item.goal_difference}</td>
                <td>{item.goals_for}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="data-card">
        <div className="data-card-header"><h3>Ranking Completo — Fase de Grupos</h3></div>
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th style={{ textAlign: "left" }}>Seleção</th>
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
            {full_ranking.map((item) => (
              <tr key={`${item.team_name}-${item.position}`}>
                <td>{item.position}</td>
                <td className="team-cell">{item.team_name}</td>
                <td>{item.group}</td>
                <td className="pts">{item.points}</td>
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
    </div>
  );
}
