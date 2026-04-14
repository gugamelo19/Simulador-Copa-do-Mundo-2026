import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const FILTERS = [
  { key: "ALL", label: "Todas" },
  { key: "A", label: "Grupo A" },
  { key: "B", label: "Grupo B" },
  { key: "C", label: "Grupo C" },
  { key: "D", label: "Grupo D" },
  { key: "E", label: "Grupo E" },
  { key: "F", label: "Grupo F" },
  { key: "G", label: "Grupo G" },
  { key: "H", label: "Grupo H" },
  { key: "I", label: "Grupo I" },
  { key: "J", label: "Grupo J" },
  { key: "K", label: "Grupo K" },
  { key: "L", label: "Grupo L" },
  { key: "R16", label: "Oitavas" },
  { key: "QF", label: "Quartas" },
  { key: "SF", label: "Semifinais" },
  { key: "THIRD", label: "Terceiro Lugar" },
  { key: "FINAL", label: "Final" },
];

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchMatches() {
    try {
      const response = await client.get("/matches/");
      setMatches(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Erro ao carregar partidas:", err);
      setError("Erro ao carregar partidas.");
    } finally {
      setLoading(false);
    }
  }

  async function simulateMatch(matchId) {
    try {
      await client.post(`/matches/${matchId}/simulate/`);
      await fetchMatches();
    } catch (err) {
      console.error("Erro ao simular partida:", err);
    }
  }

  async function simulateAllMatches() {
    try {
      await client.post("/matches/simulate-all/");
      await fetchMatches();
    } catch (err) {
      console.error("Erro ao simular todas as partidas:", err);
    }
  }

  async function resetMatches() {
    try {
      await client.post("/matches/reset/");
      await fetchMatches();
    } catch (err) {
      console.error("Erro ao resetar partidas:", err);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  const filteredMatches = useMemo(() => {
    if (selectedFilter === "ALL") return matches;

    if (["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"].includes(selectedFilter)) {
      return matches.filter((match) => match.group_name === selectedFilter);
    }

    return matches.filter((match) => match.phase === selectedFilter);
  }, [matches, selectedFilter]);

  if (loading) {
    return (
      <div className="page">
        <section className="matches-premium-page">
          <h1 className="section-title">
            <span>Partidas</span>
          </h1>
          <p>Carregando partidas...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <section className="matches-premium-page">
          <h1 className="section-title">
            <span>Partidas</span>
          </h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="matches-premium-page">
        <div className="matches-header-row">
          <h1 className="section-title">
            <span>Partidas</span>
          </h1>

          <button className="matches-reset-button" onClick={resetMatches}>
            ↻ Resetar
          </button>
        </div>

        <div className="matches-top-actions">
          <button className="simulate-all-button" onClick={simulateAllMatches}>
            Simular Todas
          </button>
        </div>

        <div className="group-filter-bar">
          {FILTERS.map((filter) => (
            <button
              key={filter.key}
              className={selectedFilter === filter.key ? "group-filter-btn active" : "group-filter-btn"}
              onClick={() => setSelectedFilter(filter.key)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="matches-premium-grid">
          {filteredMatches.map((match) => (
            <div key={match.id} className="premium-match-card">
              <div className="premium-match-main-row">
                <div className="premium-team premium-team-left">
                  <span>{match.home_team_name}</span>
                </div>

                <div className="premium-score-box">
                  {match.played ? `${match.home_score} - ${match.away_score}` : "vs"}
                </div>

                <div className="premium-team premium-team-right">
                  <span>{match.away_team_name}</span>
                </div>
              </div>

              <div className="premium-match-meta">
                {match.group_name ? `Grupo ${match.group_name}` : match.phase}
              </div>

              {!match.played && (
                <button
                  className="premium-match-simulate-btn"
                  onClick={() => simulateMatch(match.id)}
                >
                  Simular
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}