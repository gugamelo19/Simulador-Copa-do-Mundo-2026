export default function GroupTable({ groups }) {
  if (!Array.isArray(groups) || groups.length === 0) {
    return <p>Nenhum grupo encontrado.</p>;
  }

  return (
    <div className="groups-grid">
      {groups.map((group) => (
        <div key={group.id} className="group-card">
          <h3>Grupo {group.name}</h3>
        </div>
      ))}
    </div>
  );
}