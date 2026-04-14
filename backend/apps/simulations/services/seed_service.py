from apps.groups.models import Group
from apps.standings.models import Standing
from apps.teams.models import Team


GROUPS = ["A", "B", "C", "D"]

TEAMS_DATA = [
    {"name": "Brasil", "code": "BRA", "group": "A", "attack": 88,
        "defense": 85, "continent": "SOUTH_AMERICA"},
    {"name": "Japão", "code": "JPN", "group": "A",
        "attack": 74, "defense": 73, "continent": "ASIA"},
    {"name": "México", "code": "MEX", "group": "A", "attack": 76,
        "defense": 74, "continent": "NORTH_AMERICA"},
    {"name": "Nigéria", "code": "NGA", "group": "A",
        "attack": 75, "defense": 72, "continent": "AFRICA"},

    {"name": "França", "code": "FRA", "group": "B",
        "attack": 89, "defense": 87, "continent": "EUROPE"},
    {"name": "Estados Unidos", "code": "USA", "group": "B",
        "attack": 77, "defense": 75, "continent": "NORTH_AMERICA"},
    {"name": "Coreia do Sul", "code": "KOR", "group": "B",
        "attack": 74, "defense": 73, "continent": "ASIA"},
    {"name": "Marrocos", "code": "MAR", "group": "B",
        "attack": 80, "defense": 79, "continent": "AFRICA"},

    {"name": "Argentina", "code": "ARG", "group": "C",
        "attack": 87, "defense": 84, "continent": "SOUTH_AMERICA"},
    {"name": "Alemanha", "code": "GER", "group": "C",
        "attack": 84, "defense": 82, "continent": "EUROPE"},
    {"name": "Canadá", "code": "CAN", "group": "C", "attack": 75,
        "defense": 74, "continent": "NORTH_AMERICA"},
    {"name": "Senegal", "code": "SEN", "group": "C",
        "attack": 78, "defense": 77, "continent": "AFRICA"},

    {"name": "Espanha", "code": "ESP", "group": "D",
        "attack": 86, "defense": 83, "continent": "EUROPE"},
    {"name": "Inglaterra", "code": "ENG", "group": "D",
        "attack": 85, "defense": 84, "continent": "EUROPE"},
    {"name": "Austrália", "code": "AUS", "group": "D",
        "attack": 72, "defense": 72, "continent": "OCEANIA"},
    {"name": "Equador", "code": "ECU", "group": "D", "attack": 77,
        "defense": 76, "continent": "SOUTH_AMERICA"},
]


def seed_groups():
    created_groups = []

    for group_name in GROUPS:
        group, _ = Group.objects.get_or_create(name=group_name)
        created_groups.append(group)

    return created_groups


def seed_teams():
    created_teams = []

    for team_data in TEAMS_DATA:
        group = Group.objects.get(name=team_data["group"])

        team, _ = Team.objects.get_or_create(
            code=team_data["code"],
            defaults={
                "name": team_data["name"],
                "group": group,
                "attack": team_data["attack"],
                "defense": team_data["defense"],
                "continent": team_data["continent"],
            }
        )

        # Atualiza caso já exista
        team.name = team_data["name"]
        team.group = group
        team.attack = team_data["attack"]
        team.defense = team_data["defense"]
        team.continent = team_data["continent"]
        team.save()

        created_teams.append(team)

    return created_teams


def initialize_group_standings():
    Standing.objects.all().delete()

    for group in Group.objects.all():
        for team in group.teams.all():
            Standing.objects.create(
                group=group,
                team=team,
                played=0,
                wins=0,
                draws=0,
                losses=0,
                goals_for=0,
                goals_against=0,
                goal_difference=0,
                points=0,
            )
