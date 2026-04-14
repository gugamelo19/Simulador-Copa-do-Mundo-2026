export default function MatchList({ matches, onSimulate }) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return <p>Nenhuma partida encontrada.</p>;
  }

  return (
    <div className="matches-list">
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          <h3>
            {match.home_team_name} x {match.away_team_name}
          </h3>

          <p className="match-phase">
            Fase: {match.phase} {match.group_name ? `| Grupo ${match.group_name}` : ""}
          </p>

          <p className="match-score">
            {match.played
              ? `${match.home_score} x ${match.away_score}`
              : "Partida não simulada"}
          </p>

          {!match.played && (
            <button onClick={() => onSimulate(match.id)}>
              Simular Partida
            </button>
          )}
        </div>
      ))}
    </div>
  );
}