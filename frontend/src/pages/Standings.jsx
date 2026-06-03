import { useEffect, useState } from "react";
import client from "../api/client";

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get("/standings/")
      .then((res) => setStandings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p className="loading-text">Carregando...</p></div>;

  const grouped = standings.reduce((acc, s) => {
    if (!acc[s.group_name]) acc[s.group_name] = [];
    acc[s.group_name].push(s);
    return acc;
  }, {});

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Classificação</h1>
        <p className="page-subtitle">Fase de grupos — Copa do Mundo 2026</p>
      </div>

      <div className="standings-grid">
        {Object.entries(grouped).map(([groupName, gs]) => (
          <div key={groupName} className="group-card">
            <div className="group-card-header">
              <h3>Grupo {groupName}</h3>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th style={{ textAlign: "left" }}>Seleção</th>
                  <th>J</th>
                  <th>V</th>
                  <th>E</th>
                  <th>D</th>
                  <th>GP</th>
                  <th>GC</th>
                  <th>SG</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {gs.map((team, i) => (
                  <tr key={team.id}>
                    <td>{i + 1}</td>
                    <td className="team-cell">
                      {team.team_name}
                      <span className="team-code">{team.team_code}</span>
                    </td>
                    <td>{team.played}</td>
                    <td>{team.wins}</td>
                    <td>{team.draws}</td>
                    <td>{team.losses}</td>
                    <td>{team.goals_for}</td>
                    <td>{team.goals_against}</td>
                    <td>{team.goal_difference}</td>
                    <td className="pts">{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}
