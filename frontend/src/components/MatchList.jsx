export default function MatchList({ matches, onSimulate }) {
  if (!Array.isArray(matches) || matches.length === 0) {
    return <p>Nenhuma partida encontrada.</p>;
  }

  return (
    <div>
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          <h3>
            {match.home_team_name} x {match.away_team_name}
          </h3>

          <p>
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