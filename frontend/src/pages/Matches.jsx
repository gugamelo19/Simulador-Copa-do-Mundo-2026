import { useEffect, useState } from "react";
import client from "../api/client";
import MatchList from "../components/MatchList";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchMatches() {
    try {
      const response = await client.get("/matches/");
      setMatches(response.data);
    } catch (error) {
      console.error("Erro ao carregar partidas:", error);
    } finally {
      setLoading(false);
    }
  }

  async function simulateMatch(matchId) {
    try {
      await client.post(`/matches/${matchId}/simulate/`);
      fetchMatches();
    } catch (error) {
      console.error("Erro ao simular partida:", error);
    }
  }

  useEffect(() => {
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Partidas</h2>
        <p>Carregando partidas...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Partidas da Copa</h2>
      <MatchList matches={matches} onSimulate={simulateMatch} />
    </div>
  );
}