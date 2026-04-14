import { useEffect, useMemo, useState } from "react";
import client from "../api/client";

const PHASES = [
  { key: "R16", label: "Oitavas de Final" },
  { key: "QF", label: "Quartas de Final" },
  { key: "SF", label: "Semifinais" },
  { key: "FINAL", label: "Final" },
  { key: "THIRD", label: "3º Lugar" },
];

export default function Knockout() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadKnockoutMatches() {
      try {
        const response = await client.get("/matches/");
        const allMatches = Array.isArray(response.data) ? response.data : [];

        if (isMounted) {
          setMatches(allMatches);
        }
      } catch (err) {
        console.error("Erro ao carregar mata-mata:", err);

        if (isMounted) {
          setError("Erro ao carregar os confrontos do mata-mata.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadKnockoutMatches();

    return () => {
      isMounted = false;
    };
  }, []);

  const knockoutData = useMemo(() => {
    const grouped = {
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
      ? finalMatch.home_score > finalMatch.away_score
        ? finalMatch.home_team_name
        : finalMatch.away_team_name
      : "A definir";

  if (loading) {
    return (
      <div className="page">
        <section className="knockout-page">
          <h1 className="section-title">Mata-Mata</h1>
          <p>Carregando mata-mata...</p>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <section className="knockout-page">
          <h1 className="section-title">Mata-Mata</h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="knockout-page">
        <h1 className="section-title">
          <span>Mata-Mata</span>
        </h1>

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
                    const homeWon = match.played && match.home_score > match.away_score;
                    const awayWon = match.played && match.away_score > match.home_score;

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