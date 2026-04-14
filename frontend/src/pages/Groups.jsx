import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const GROUP_NAMES = [
  "A", "B", "C", "D", "E", "F",
  "G", "H", "I", "J", "K", "L",
];

export default function Groups() {
  const [standings, setStandings] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadGroupsData() {
      try {
        const [standingsResponse, matchesResponse] = await Promise.all([
          client.get("/standings/"),
          client.get("/matches/?phase=GROUP"),
        ]);

        if (isMounted) {
          setStandings(Array.isArray(standingsResponse.data) ? standingsResponse.data : []);
          setMatches(Array.isArray(matchesResponse.data) ? matchesResponse.data : []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados dos grupos:", err);

        if (isMounted) {
          setError("Erro ao carregar dados da fase de grupos.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadGroupsData();

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedData = useMemo(() => {
    const standingsMap = {};
    const matchesMap = {};

    standings.forEach((item) => {
      const groupName = item.group_name;
      if (!standingsMap[groupName]) standingsMap[groupName] = [];
      standingsMap[groupName].push(item);
    });

    matches.forEach((match) => {
      const groupName = match.group_name;
      if (!matchesMap[groupName]) matchesMap[groupName] = [];
      matchesMap[groupName].push(match);
    });

    const orderedGroups = GROUP_NAMES.map((groupName) => ({
      groupName,
      standings: standingsMap[groupName] || [],
      matches: matchesMap[groupName] || [],
    })).filter((group) => group.standings.length > 0 || group.matches.length > 0);

    if (selectedGroup === "ALL") return orderedGroups;
    return orderedGroups.filter((group) => group.groupName === selectedGroup);
  }, [standings, matches, selectedGroup]);

  if (loading) {
    return (
      <div className="page">
        <div className="groups-premium-page">
          <h1 className="section-title">
            Fase de <span>Grupos</span>
          </h1>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="groups-premium-page">
          <h1 className="section-title">
            Fase de <span>Grupos</span>
          </h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="groups-premium-page">
        <h1 className="section-title">
          Fase de <span>Grupos</span>
        </h1>

        <div className="group-filter-bar">
          <button
            className={selectedGroup === "ALL" ? "group-filter-btn active" : "group-filter-btn"}
            onClick={() => setSelectedGroup("ALL")}
          >
            Todos
          </button>

          {GROUP_NAMES.map((groupName) => (
            <button
              key={groupName}
              className={selectedGroup === groupName ? "group-filter-btn active" : "group-filter-btn"}
              onClick={() => setSelectedGroup(groupName)}
            >
              Grupo {groupName}
            </button>
          ))}
        </div>

        <div className="groups-premium-grid">
          {groupedData.map((group) => (
            <div key={group.groupName} className="group-premium-card">
              <div className="group-premium-header">
                <h2>Grupo {group.groupName}</h2>
              </div>

              <div className="group-table-wrapper">
                <table className="group-premium-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Seleção</th>
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
                    {group.standings.map((team, index) => (
                      <tr key={team.id}>
                        <td>{index + 1}</td>
                        <td className="team-name-cell">
                          {team.team_name} <span>{team.team_code}</span>
                        </td>
                        <td>{team.played}</td>
                        <td>{team.wins}</td>
                        <td>{team.draws}</td>
                        <td>{team.losses}</td>
                        <td>{team.goals_for}</td>
                        <td>{team.goals_against}</td>
                        <td>{team.goal_difference}</td>
                        <td className="points-highlight">{team.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="group-matches-section">
                <p className="group-matches-title">JOGOS</p>

                <div className="group-matches-list">
                  {group.matches.map((match) => (
                    <div key={match.id} className="group-match-row">
                      <span className="group-match-team left">
                        {match.home_team_name}
                      </span>

                      <span className="group-match-score">
                        {match.played
                          ? `${match.home_score} - ${match.away_score}`
                          : "vs"}
                      </span>

                      <span className="group-match-team right">
                        {match.away_team_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}