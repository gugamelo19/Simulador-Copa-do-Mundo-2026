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
  { key: "R32", label: "16 Avos" },
  { key: "R16", label: "Oitavas" },
  { key: "QF", label: "Quartas" },
  { key: "SF", label: "Semis" },
  { key: "THIRD", label: "3º Lugar" },
  { key: "FINAL", label: "Final" },
];

const GROUP_KEYS = ["A","B","C","D","E","F","G","H","I","J","K","L"];

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [simulatingAll, setSimulatingAll] = useState(false);
  const [error, setError] = useState("");

  async function fetchMatches() {
    try {
      const res = await client.get("/matches/");
      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Erro ao carregar partidas.");
    } finally {
      setLoading(false);
    }
  }

  async function simulateMatch(id) {
    try {
      await client.post(`/matches/${id}/simulate/`);
      await fetchMatches();
    } catch { /* silent */ }
  }

  async function simulateAll() {
    try {
      setSimulatingAll(true);
      await client.post("/matches/simulate-all/");
      await fetchMatches();
    } catch {
      setError("Erro ao simular partidas.");
    } finally {
      setSimulatingAll(false);
    }
  }

  async function reset() {
    try {
      await client.post("/dashboard/reset-tournament/");
      await fetchMatches();
    } catch {
      setError("Erro ao resetar.");
    }
  }

  useEffect(() => { fetchMatches(); }, []);

  const filtered = useMemo(() => {
    if (selectedFilter === "ALL") return matches;
    if (GROUP_KEYS.includes(selectedFilter))
      return matches.filter((m) => m.group_name === selectedFilter);
    return matches.filter((m) => m.phase === selectedFilter);
  }, [matches, selectedFilter]);

  if (loading) return <div className="page"><p className="loading-text">Carregando partidas...</p></div>;

  return (
    <div className="page">
      <div className="matches-toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Partidas</h1>
        </div>
        <div className="matches-toolbar-actions">
          <button className="btn btn-primary" onClick={simulateAll} disabled={simulatingAll}>
            {simulatingAll ? "Simulando..." : "Simular Todas"}
          </button>
          <button className="btn btn-ghost" onClick={reset}>Resetar</button>
        </div>
      </div>

      {error && <p className="loading-text">{error}</p>}

      <div className="filter-bar">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={selectedFilter === f.key ? "filter-btn active" : "filter-btn"}
            onClick={() => setSelectedFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="matches-grid">
        {filtered.map((match) => (
          <div key={match.id} className="match-card">
            <div className="match-teams-row">
              <span className="match-team left">{match.home_team_name}</span>
              <span className="match-score">
                {match.played ? `${match.home_score} – ${match.away_score}` : "vs"}
              </span>
              <span className="match-team right">{match.away_team_name}</span>
            </div>
            <div className="match-meta">
              {match.group_name ? `Grupo ${match.group_name}` : match.phase}
            </div>
            {!match.played && (
              <button className="match-simulate-btn" onClick={() => simulateMatch(match.id)}>
                Simular
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
