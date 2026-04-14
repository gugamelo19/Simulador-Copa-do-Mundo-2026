import random

from django.shortcuts import get_object_or_404

from apps.matches.models import Match
from apps.simulations.services.standings_service import recalculate_all_group_standings


def generate_goals(attack, opponent_defense, overall_difference=0):
    strength_balance = attack - opponent_defense + (overall_difference // 2)

    if strength_balance >= 15:
        return random.choices([0, 1, 2, 3, 4], weights=[5, 20, 35, 25, 15])[0]
    elif strength_balance >= 8:
        return random.choices([0, 1, 2, 3], weights=[10, 35, 35, 20])[0]
    elif strength_balance >= 0:
        return random.choices([0, 1, 2, 3], weights=[25, 40, 25, 10])[0]
    else:
        return random.choices([0, 1, 2], weights=[45, 40, 15])[0]


def simulate_match(match_id):
    match = get_object_or_404(
        Match.objects.select_related("home_team", "away_team", "group"),
        id=match_id
    )

    if match.played:
        return match

    home_team = match.home_team
    away_team = match.away_team

    overall_difference_home = home_team.overall - away_team.overall
    overall_difference_away = away_team.overall - home_team.overall

    home_goals = generate_goals(
        attack=home_team.attack,
        opponent_defense=away_team.defense,
        overall_difference=overall_difference_home,
    )

    away_goals = generate_goals(
        attack=away_team.attack,
        opponent_defense=home_team.defense,
        overall_difference=overall_difference_away,
    )

    match.home_score = home_goals
    match.away_score = away_goals
    match.played = True

    if match.phase != "GROUP":
        if home_goals > away_goals:
            match.winner = home_team
        elif away_goals > home_goals:
            match.winner = away_team
        else:
            match.winner = random.choice([home_team, away_team])

    match.save()

    if match.phase == "GROUP":
        recalculate_all_group_standings()

    return match
