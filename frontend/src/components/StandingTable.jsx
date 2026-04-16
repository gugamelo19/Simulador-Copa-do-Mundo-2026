export default function StandingTable({ standings }) {
  if (!Array.isArray(standings) || standings.length === 0) {
    return <p>Nenhuma classificação encontrada.</p>;
  }

  return (
    <table className="standings-table premium">
      <thead>
        <tr>
          <th>Seleção</th>
          <th>Pts</th>
          <th>J</th>
          <th>V</th>
          <th>E</th>
          <th>D</th>
          <th>GP</th>
          <th>GC</th>
          <th>SG</th>
        </tr>
      </thead>

      <tbody>
        {standings.map((standing) => (
          <tr key={standing.id}>
            <td>{standing.team_name}</td>
            <td>{standing.points}</td>
            <td>{standing.played}</td>
            <td>{standing.wins}</td>
            <td>{standing.draws}</td>
            <td>{standing.losses}</td>
            <td>{standing.goals_for}</td>
            <td>{standing.goals_against}</td>
            <td>{standing.goal_difference}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}