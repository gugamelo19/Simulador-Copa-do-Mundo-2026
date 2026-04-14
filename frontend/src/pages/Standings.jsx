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

  function groupStandingsByGroup(data) {
    return data.reduce((acc, standing) => {
      const groupName = standing.group_name;

      if (!acc[groupName]) {
        acc[groupName] = [];
      }

      acc[groupName].push(standing);
      return acc;
    }, {});
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Classificação</h2>
        <p>Carregando classificação...</p>
      </div>
    );
  }

  const groupedStandings = groupStandingsByGroup(standings);

  return (
    <div className="page">
      <h2>Classificação por Grupo</h2>

      {Object.entries(groupedStandings).map(([groupName, groupStandings]) => (
        <div key={groupName} className="group-standing-block">
          <h3>Grupo {groupName}</h3>
          <StandingTable standings={groupStandings} />
        </div>
      ))}
    </div>
  );
}