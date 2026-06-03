import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const GROUP_NAMES = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export default function Groups() {
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      client.get("/standings/"),
      client.get("/matches/?phase=GROUP"),
    ])
      .then(([sRes, mRes]) => {
        if (!isMounted) return;
        setStandings(Array.isArray(sRes.data) ? sRes.data : []);
        setMatches(Array.isArray(mRes.data) ? mRes.data : []);
      })
      .catch(() => { if (isMounted) setError("Erro ao carregar grupos."); })
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const groupedData = useMemo(() => {
    const sMap = {}, mMap = {};
    standings.forEach((s) => {
      if (!sMap[s.group_name]) sMap[s.group_name] = [];
      sMap[s.group_name].push(s);
    });
    matches.forEach((m) => {
      if (!mMap[m.group_name]) mMap[m.group_name] = [];
      mMap[m.group_name].push(m);
    });
    const all = GROUP_NAMES
      .map((g) => ({ groupName: g, standings: sMap[g] || [], matches: mMap[g] || [] }))
      .filter((g) => g.standings.length > 0 || g.matches.length > 0);
    return selectedGroup === "ALL" ? all : all.filter((g) => g.groupName === selectedGroup);
  }, [standings, matches, selectedGroup]);

  if (loading) return <div className="page"><p className="loading-text">Carregando grupos...</p></div>;
  if (error) return <div className="page"><p className="loading-text">{error}</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Fase de Grupos</h1>
      </div>

      <div className="filter-bar">
        <button
          className={selectedGroup === "ALL" ? "filter-btn active" : "filter-btn"}
          onClick={() => setSelectedGroup("ALL")}
        >
          Todos
        </button>
        {GROUP_NAMES.map((g) => (
          <button
            key={g}
            className={selectedGroup === g ? "filter-btn active" : "filter-btn"}
            onClick={() => setSelectedGroup(g)}
          >
            Grupo {g}
          </button>
        ))}
      </div>

      <div className="groups-grid">
        {groupedData.map(({ groupName, standings: gs, matches: ms }) => (
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

            {ms.length > 0 && (
              <div className="group-matches">
                <div className="group-matches-label">Jogos</div>
                {ms.map((match) => (
                  <div key={match.id} className="group-match-row">
                    <span className="group-match-team left">{match.home_team_name}</span>
                    <span className={`group-match-score${match.played ? " played" : ""}`}>
                      {match.played ? `${match.home_score} – ${match.away_score}` : "vs"}
                    </span>
                    <span className="group-match-team right">{match.away_team_name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
