import json
from pathlib import Path

from django.conf import settings

from apps.groups.models import Group
from apps.standings.models import Standing
from apps.teams.models import Team


def import_world_cup_data_from_json():
    file_path = Path(settings.BASE_DIR) / "data" / "world_cup_2026_data.json"

    with open(file_path, "r", encoding="utf-8") as file:
        payload = json.load(file)

    groups_data = payload.get("groups", [])

    for group_data in groups_data:
        group, _ = Group.objects.get_or_create(name=group_data["name"])

        for team_data in group_data.get("teams", []):
            team, _ = Team.objects.update_or_create(
                code=team_data["code"],
                defaults={
                    "name": team_data["name"],
                    "group": group,
                    "attack": team_data["attack"],
                    "defense": team_data["defense"],
                    "continent": team_data["continent"],
                },
            )

            Standing.objects.get_or_create(
                group=group,
                team=team,
                defaults={
                    "played": 0,
                    "wins": 0,
                    "draws": 0,
                    "losses": 0,
                    "goals_for": 0,
                    "goals_against": 0,
                    "goal_difference": 0,
                    "points": 0,
                },
            )
