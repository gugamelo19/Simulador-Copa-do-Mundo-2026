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
        <section className="standings-page">
          <h1 className="section-title">
            <span>Resultados</span>
          </h1>
          <p>Carregando classificação...</p>
        </section>
      </div>
    );
  }

  const groupedStandings = groupStandingsByGroup(standings);

  return (
    <div className="page">
      <section className="standings-page">
        <h1 className="section-title">
          <span>Resultados</span>
        </h1>

        <p className="section-subtitle">
          Classificação atual da fase de grupos da Copa 2026.
        </p>

        <div className="standings-groups-grid">
          {Object.entries(groupedStandings).map(([groupName, groupStandings]) => (
            <div key={groupName} className="standings-group-card">
              <div className="standings-group-header">
                <h3>Grupo {groupName}</h3>
              </div>

              <StandingTable standings={groupStandings} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}