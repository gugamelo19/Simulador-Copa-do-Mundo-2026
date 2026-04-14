import { useEffect, useState } from "react";
import client from "../api/client";
import GroupTable from "../components/GroupTable";

export default function Groups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await client.get("/groups/");
        console.log("Resposta da API:", response.data);

        if (Array.isArray(response.data)) {
          setGroups(response.data);
        } else {
          setGroups([]);
          setError("A resposta da API não veio no formato esperado.");
        }
      } catch (err) {
        console.error("Erro ao carregar grupos:", err);
        setError("Erro ao carregar grupos do backend.");
      } finally {
        setLoading(false);
      }
    }

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <h2>Grupos</h2>
        <p>Carregando grupos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h2>Grupos</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Grupos da Copa 2026</h2>
      <GroupTable groups={groups} />
    </div>
  );
}