from rest_framework.response import Response
from rest_framework.views import APIView

from apps.matches.models import Match
from apps.standings.models import Standing


class StatsAPIView(APIView):
    def get(self, request):
        total_matches = Match.objects.count()
        played_matches = Match.objects.filter(played=True).count()
        pending_matches = total_matches - played_matches

        final_match = Match.objects.filter(phase="FINAL").select_related(
            "home_team", "away_team", "winner"
        ).first()

        champion = None
        vice = None

        if final_match and final_match.played and final_match.winner:
            champion = final_match.winner.name
            vice = (
                final_match.away_team.name
                if final_match.winner == final_match.home_team
                else final_match.home_team.name
            )

        group_standings = list(
            Standing.objects.select_related("team", "group")
            .order_by("-points", "-goal_difference", "-goals_for", "team__name")
        )

        best_team = group_standings[0] if group_standings else None
        best_attack = max(
            group_standings, key=lambda s: s.goals_for) if group_standings else None
        best_defense = min(
            group_standings, key=lambda s: s.goals_against) if group_standings else None

        third_placed = []
        groups_seen = set()

        for standing in group_standings:
            group_name = standing.group.name
            if group_name not in groups_seen:
                group_rows = [
                    s for s in group_standings if s.group.name == group_name]
                if len(group_rows) >= 3:
                    third_placed.append(group_rows[2])
                groups_seen.add(group_name)

        best_thirds = sorted(
            third_placed,
            key=lambda s: (s.points, s.goal_difference,
                           s.goals_for, s.team.name),
            reverse=True,
        )[:8]

        data = {
            "summary": {
                "total_matches": total_matches,
                "played_matches": played_matches,
                "pending_matches": pending_matches,
                "champion": champion,
                "vice": vice,
            },
            "group_stage_highlights": {
                "best_team": {
                    "name": best_team.team.name,
                    "group": best_team.group.name,
                    "points": best_team.points,
                    "played": best_team.played,
                    "wins": best_team.wins,
                    "draws": best_team.draws,
                    "losses": best_team.losses,
                    "goals_for": best_team.goals_for,
                    "goals_against": best_team.goals_against,
                    "goal_difference": best_team.goal_difference,
                } if best_team else None,
                "best_attack": {
                    "name": best_attack.team.name,
                    "group": best_attack.group.name,
                    "goals_for": best_attack.goals_for,
                } if best_attack else None,
                "best_defense": {
                    "name": best_defense.team.name,
                    "group": best_defense.group.name,
                    "goals_against": best_defense.goals_against,
                } if best_defense else None,
                "best_thirds": [
                    {
                        "team_name": item.team.name,
                        "group": item.group.name,
                        "points": item.points,
                        "goal_difference": item.goal_difference,
                        "goals_for": item.goals_for,
                    }
                    for item in best_thirds
                ],
            },
            "full_ranking": [
                {
                    "position": index + 1,
                    "team_name": item.team.name,
                    "group": item.group.name,
                    "points": item.points,
                    "played": item.played,
                    "wins": item.wins,
                    "draws": item.draws,
                    "losses": item.losses,
                    "goals_for": item.goals_for,
                    "goals_against": item.goals_against,
                    "goal_difference": item.goal_difference,
                }
                for index, item in enumerate(group_standings)
            ],
        }

        return Response(data)
