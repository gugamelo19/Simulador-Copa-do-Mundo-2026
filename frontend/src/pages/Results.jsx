import { useEffect, useState } from "react";
import client from "../api/client";

export default function Results() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadResults() {
      try {
        const response = await client.get("/dashboard/results/");
        if (isMounted) {
          setResults(response.data);
        }
      } catch (err) {
        console.error("Erro ao carregar resultados:", err);
        if (isMounted) {
          setError("Erro ao carregar resultados finais.");
        }
      }
    }

    loadResults();

    return () => {
      isMounted = false;
    };
  }, []);

  if (error) {
    return (
      <div className="page">
        <section className="results-page">
          <h1 className="section-title">
            <span>Resultados Finais</span>
          </h1>
          <p>{error}</p>
        </section>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="page">
        <section className="results-page">
          <h1 className="section-title">
            <span>Resultados Finais</span>
          </h1>
          <p>Carregando resultados...</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="results-page">
        <h1 className="section-title">
          <span>Resultados Finais</span>
        </h1>

        {results.final_played ? (
          <div className="results-grid">
            <div className="results-card champion">
              <h3>🏆 Campeão</h3>
              <p>{results.champion || "-"}</p>
            </div>

            <div className="results-card">
              <h3>🥈 Vice-Campeão</h3>
              <p>{results.vice || "-"}</p>
            </div>

            <div className="results-card">
              <h3>🥉 3º Lugar</h3>
              <p>{results.third_place || "-"}</p>
            </div>

            <div className="results-card">
              <h3>4º Lugar</h3>
              <p>{results.fourth_place || "-"}</p>
            </div>
          </div>
        ) : (
          <div className="results-card">
            <h3>Torneio ainda não finalizado</h3>
            <p>Execute o mata-mata completo para visualizar os resultados finais.</p>
          </div>
        )}
      </section>
    </div>
  );
}