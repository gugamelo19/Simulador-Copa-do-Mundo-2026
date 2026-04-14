from itertools import combinations

from apps.groups.models import Group
from apps.matches.models import Match


def generate_group_stage_matches():
    Match.objects.filter(phase="GROUP").delete()

    for group in Group.objects.all():
        teams = list(group.teams.all().order_by("name"))

        for home_team, away_team in combinations(teams, 2):
            Match.objects.create(
                phase="GROUP",
                group=group,
                home_team=home_team,
                away_team=away_team,
                played=False
            )
