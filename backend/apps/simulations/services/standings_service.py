from apps.standings.models import Standing


def reset_group_standings():
    for standing in Standing.objects.all():
        standing.played = 0
        standing.wins = 0
        standing.draws = 0
        standing.losses = 0
        standing.goals_for = 0
        standing.goals_against = 0
        standing.goal_difference = 0
        standing.points = 0
        standing.save()


def apply_match_result_to_standings(match):
    if match.phase != "GROUP":
        return

    home_standing = Standing.objects.get(
        group=match.group, team=match.home_team)
    away_standing = Standing.objects.get(
        group=match.group, team=match.away_team)

    home_standing.played += 1
    away_standing.played += 1

    home_standing.goals_for += match.home_score
    home_standing.goals_against += match.away_score

    away_standing.goals_for += match.away_score
    away_standing.goals_against += match.home_score

    if match.home_score > match.away_score:
        home_standing.wins += 1
        home_standing.points += 3
        away_standing.losses += 1
    elif match.home_score < match.away_score:
        away_standing.wins += 1
        away_standing.points += 3
        home_standing.losses += 1
    else:
        home_standing.draws += 1
        away_standing.draws += 1
        home_standing.points += 1
        away_standing.points += 1

    home_standing.goal_difference = home_standing.goals_for - home_standing.goals_against
    away_standing.goal_difference = away_standing.goals_for - away_standing.goals_against

    home_standing.save()
    away_standing.save()


def recalculate_all_group_standings():
    from apps.matches.models import Match

    reset_group_standings()

    played_group_matches = Match.objects.filter(phase="GROUP", played=True)

    for match in played_group_matches:
        apply_match_result_to_standings(match)
