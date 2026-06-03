import { useEffect, useState } from "react";
import client from "../api/client";

export default function Results() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    client.get("/dashboard/results/")
      .then((res) => { if (isMounted) setResults(res.data); })
      .catch(() => { if (isMounted) setError("Erro ao carregar resultados."); });
    return () => { isMounted = false; };
  }, []);

  if (error) return <div className="page"><p className="loading-text">{error}</p></div>;
  if (!results) return <div className="page"><p className="loading-text">Carregando...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Resultados Finais</h1>
      </div>

      {results.final_played ? (
        <div className="results-podium">
          <div className="result-card champion">
            <div className="result-card-label">Campeão</div>
            <div className="result-card-value">{results.champion || "—"}</div>
          </div>
          <div className="result-card">
            <div className="result-card-label">Vice-Campeão</div>
            <div className="result-card-value">{results.vice || "—"}</div>
          </div>
          <div className="result-card">
            <div className="result-card-label">3º Lugar</div>
            <div className="result-card-value">{results.third_place || "—"}</div>
          </div>
          <div className="result-card">
            <div className="result-card-label">4º Lugar</div>
            <div className="result-card-value">{results.fourth_place || "—"}</div>
          </div>
        </div>
      ) : (
        <div className="result-card" style={{ maxWidth: 400 }}>
          <div className="result-card-label">Torneio não finalizado</div>
          <div className="result-card-value" style={{ fontSize: 14, fontWeight: 400, color: "var(--text-muted)" }}>
            Execute o mata-mata completo para ver os resultados finais.
          </div>
        </div>
      )}
    </div>
  );
}
