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

  async function loadKnockoutMatches() {
    try {
      const response = await client.get("/matches/");
      const allMatches = Array.isArray(response.data) ? response.data : [];
      setMatches(allMatches);
    } catch (err) {
      console.error("Erro ao carregar mata-mata:", err);
      setError("Erro ao carregar os confrontos do mata-mata.");
    } finally {
      setLoading(false);
    }
  }

  async function runFullKnockout() {
    try {
      setRunning(true);
      setError("");
      await client.post("/dashboard/knockout/run-full/");
      await loadKnockoutMatches();
    } catch (err) {
      console.error("Erro ao executar mata-mata:", err);
      setError("Erro ao executar o mata-mata.");
    } finally {
      setRunning(false);
    }
  }

  useEffect(() => {
    loadKnockoutMatches();
  }, []);

  const knockoutData = useMemo(() => {
    const grouped = {
      R32: [],
      R16: [],
      QF: [],
      SF: [],
      FINAL: [],
      THIRD: [],
    };

    matches.forEach((match) => {
      if (grouped[match.phase]) {
        grouped[match.phase].push(match);
      }
    });

    return grouped;
  }, [matches]);

  const finalMatch = knockoutData.FINAL?.[0];
  const championName =
    finalMatch && finalMatch.played
      ? finalMatch.winner_name || "A definir"
      : "A definir";

  if (loading) {
    return (
      <div className="page">
        <section className="knockout-page">
          <h1 className="section-title">
            <span>Mata-Mata</span>
          </h1>
          <p>Carregando mata-mata...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="knockout-page">
        <div className="matches-header-row">
          <h1 className="section-title">
            <span>Mata-Mata</span>
          </h1>

          <button
            className="knockout-run-button"
            onClick={runFullKnockout}
            disabled={running}
          >
            {running ? "Executando..." : "⚔️ Gerar e Simular Mata-Mata"}
          </button>
        </div>

        {error && <p>{error}</p>}

        <div className="champion-banner">
          <div className="champion-icon">🏆</div>
          <p className="champion-label">CAMPEÃO</p>
          <h2 className="champion-name">{championName}</h2>
        </div>

        <div className="knockout-columns">
          {PHASES.map((phase) => (
            <div key={phase.key} className="knockout-column">
              <h3 className="knockout-column-title">{phase.label}</h3>

              <div className="knockout-match-list">
                {(knockoutData[phase.key] || []).length > 0 ? (
                  knockoutData[phase.key].map((match) => {
                    const homeWon =
                      match.played &&
                      match.winner_name === match.home_team_name;

                    const awayWon =
                      match.played &&
                      match.winner_name === match.away_team_name;

                    return (
                      <div key={match.id} className="knockout-match-card">
                        <div className={`knockout-team-row ${homeWon ? "winner" : ""}`}>
                          <span>{match.home_team_name}</span>
                          <strong>{match.played ? match.home_score : "-"}</strong>
                        </div>

                        <div className={`knockout-team-row ${awayWon ? "winner" : ""}`}>
                          <span>{match.away_team_name}</span>
                          <strong>{match.played ? match.away_score : "-"}</strong>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="knockout-empty">Sem confrontos</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}