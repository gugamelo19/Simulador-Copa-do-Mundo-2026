import { useEffect, useState } from "react";
import client from "../api/client";
import StandingTable from "../components/StandingTable";

export default function Standings() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchStandings() {
    try {
      const response = await client.get("/standings/");
      setStandings(response.data);
    } catch (error) {
      console.error("Erro ao carregar classificação:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStandings();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Classificação</h2>
        <p>Carregando classificação...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Classificação Geral</h2>
      <StandingTable standings={standings} />
    </div>
  );
}