from apps.matches.models import Match
from apps.simulations.services.qualification_service import get_32_qualified_teams
from apps.simulations.services.simulation_service import simulate_match


def clear_knockout_matches():
    Match.objects.filter(
        phase__in=["R32", "R16", "QF", "SF", "THIRD", "FINAL"]).delete()


def generate_round_of_32():
    qualified_data = get_32_qualified_teams()

    top_two = qualified_data["top_two"]
    best_thirds = qualified_data["best_thirds"]

    if len(top_two) != 24 or len(best_thirds) != 8:
        raise ValueError(
            "É necessário ter 24 times dos dois primeiros e 8 melhores terceiros.")

    clear_knockout_matches()

    first_placed = [item for item in top_two if item["position"] == 1]
    second_placed = [item for item in top_two if item["position"] == 2]

    # Ordena por grupo para manter consistência
    first_placed.sort(key=lambda x: x["group"])
    second_placed.sort(key=lambda x: x["group"])

    qualified_thirds = [item["team"] for item in best_thirds]

    # Montagem simplificada e consistente do bracket
    # 8 líderes enfrentam 8 melhores terceiros
    # 4 líderes restantes + 12 segundos colocados completam o chaveamento
    matches = []

    leaders_vs_thirds = first_placed[:8]
    remaining_leaders = first_placed[8:]

    for i in range(8):
        matches.append(
            Match.objects.create(
                phase="R32",
                home_team=leaders_vs_thirds[i]["team"],
                away_team=qualified_thirds[i],
                played=False,
            )
        )

    remaining_teams = [item["team"] for item in remaining_leaders] + \
        [item["team"] for item in second_placed]

    # Total esperado: 4 líderes restantes + 12 segundos = 16 times => 8 jogos
    for i in range(0, len(remaining_teams), 2):
        matches.append(
            Match.objects.create(
                phase="R32",
                home_team=remaining_teams[i],
                away_team=remaining_teams[i + 1],
                played=False,
            )
        )

    return matches


def get_phase_winners(phase):
    matches = Match.objects.filter(
        phase=phase, played=True).select_related("winner")
    winners = []

    for match in matches:
        if match.winner:
            winners.append(match.winner)

    return winners


def get_phase_losers(phase):
    matches = Match.objects.filter(phase=phase, played=True).select_related(
        "winner", "home_team", "away_team"
    )
    losers = []

    for match in matches:
        if not match.winner:
            continue

        loser = match.away_team if match.winner == match.home_team else match.home_team
        losers.append(loser)

    return losers


def generate_next_phase(current_phase, next_phase):
    if Match.objects.filter(phase=next_phase).exists():
        return list(Match.objects.filter(phase=next_phase))

    winners = get_phase_winners(current_phase)

    expected_winners = {
        "R32": 16,
        "R16": 8,
        "QF": 4,
        "SF": 2,
    }

    if len(winners) != expected_winners[current_phase]:
        raise ValueError(
            f"A fase {current_phase} precisa estar concluída para gerar {next_phase}.")

    created_matches = []

    for i in range(0, len(winners), 2):
        created_matches.append(
            Match.objects.create(
                phase=next_phase,
                home_team=winners[i],
                away_team=winners[i + 1],
                played=False,
            )
        )

    return created_matches


def generate_final_and_third_place():
    final_exists = Match.objects.filter(phase="FINAL").exists()
    third_exists = Match.objects.filter(phase="THIRD").exists()

    if final_exists or third_exists:
        result = []
        result.extend(list(Match.objects.filter(phase="FINAL")))
        result.extend(list(Match.objects.filter(phase="THIRD")))
        return result

    winners = get_phase_winners("SF")
    losers = get_phase_losers("SF")

    if len(winners) != 2 or len(losers) != 2:
        raise ValueError(
            "As semifinais precisam estar concluídas para gerar final e terceiro lugar.")

    final_match = Match.objects.create(
        phase="FINAL",
        home_team=winners[0],
        away_team=winners[1],
        played=False,
    )

    third_match = Match.objects.create(
        phase="THIRD",
        home_team=losers[0],
        away_team=losers[1],
        played=False,
    )

    return [final_match, third_match]


def simulate_phase(phase):
    matches = Match.objects.filter(phase=phase, played=False)
    simulated = []

    for match in matches:
        simulated.append(simulate_match(match.id))

    return simulated


def run_full_knockout():
    results = {}

    r32 = generate_round_of_32()
    results["r32"] = r32
    results["simulated_r32"] = simulate_phase("R32")

    r16 = generate_next_phase("R32", "R16")
    results["r16"] = r16
    results["simulated_r16"] = simulate_phase("R16")

    qf = generate_next_phase("R16", "QF")
    results["qf"] = qf
    results["simulated_qf"] = simulate_phase("QF")

    sf = generate_next_phase("QF", "SF")
    results["sf"] = sf
    results["simulated_sf"] = simulate_phase("SF")

    finals = generate_final_and_third_place()
    results["finals"] = finals
    results["simulated_final"] = simulate_phase("FINAL")
    results["simulated_third"] = simulate_phase("THIRD")

    return results
