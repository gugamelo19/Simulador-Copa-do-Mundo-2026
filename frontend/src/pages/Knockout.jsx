import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const PHASES = [
  { key: "R32", label: "16 Avos" },
  { key: "R16", label: "Oitavas" },
  { key: "QF", label: "Quartas" },
  { key: "SF", label: "Semifinais" },
  { key: "FINAL", label: "Final" },
  { key: "THIRD", label: "3º Lugar" },
];

export default function Knockout() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await client.get("/matches/");
      setMatches(Array.isArray(res.data) ? res.data : []);
    } catch {
      setError("Erro ao carregar mata-mata.");
    } finally {
      setLoading(false);
    }
  }

  async function runKnockout() {
    try {
      setRunning(true);
      await client.post("/dashboard/knockout/run-full/");
      await load();
    } catch {
      setError("Erro ao executar mata-mata.");
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => { load(); }, []);

  const grouped = useMemo(() => {
    const g = { R32: [], R16: [], QF: [], SF: [], FINAL: [], THIRD: [] };
    matches.forEach((m) => { if (g[m.phase]) g[m.phase].push(m); });
    return g;
  }, [matches]);

  const finalMatch = grouped.FINAL?.[0];
  const champion = finalMatch?.played ? (finalMatch.winner_name || "A definir") : null;

  if (loading) return <div className="page"><p className="loading-text">Carregando...</p></div>;

  return (
    <div className="page">
      <div className="knockout-toolbar">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 className="page-title">Mata-Mata</h1>
        </div>
        <button className="btn btn-primary" onClick={runKnockout} disabled={running}>
          {running ? "Executando..." : "Gerar e Simular"}
        </button>
      </div>

      {error && <p className="loading-text">{error}</p>}

      <div className={`champion-bar${champion ? " crowned" : ""}`}>
        <div className="champion-bar-label">Campeão</div>
        <div className={`champion-bar-name${champion ? "" : " empty"}`}>
          {champion || "A definir"}
        </div>
      </div>

      <div className="knockout-phases">
        {PHASES.map((phase) => (
          <div key={phase.key}>
            <div className="knockout-phase-label">{phase.label}</div>
            <div className="knockout-match-list">
              {grouped[phase.key].length > 0 ? (
                grouped[phase.key].map((match) => {
                  const homeWon = match.played && match.winner_name === match.home_team_name;
                  const awayWon = match.played && match.winner_name === match.away_team_name;
                  return (
                    <div key={match.id} className="knockout-match">
                      <div className={`knockout-team${homeWon ? " winner" : ""}`}>
                        <span>{match.home_team_name || "—"}</span>
                        <span className="knockout-team-score">
                          {match.played ? match.home_score : "—"}
                        </span>
                      </div>
                      <div className={`knockout-team${awayWon ? " winner" : ""}`}>
                        <span>{match.away_team_name || "—"}</span>
                        <span className="knockout-team-score">
                          {match.played ? match.away_score : "—"}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="knockout-empty">—</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
