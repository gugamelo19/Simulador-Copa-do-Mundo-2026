from apps.groups.models import Group
from apps.standings.models import Standing
from apps.teams.models import Team


GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"]

TEAMS_DATA = [
    # Grupo A
    {"name": "Brasil", "code": "BRA", "group": "A", "attack": 90,
        "defense": 87, "continent": "SOUTH_AMERICA"},
    {"name": "Japão", "code": "JPN", "group": "A",
        "attack": 78, "defense": 76, "continent": "ASIA"},
    {"name": "Nigéria", "code": "NGA", "group": "A",
        "attack": 77, "defense": 75, "continent": "AFRICA"},
    {"name": "Canadá", "code": "CAN", "group": "A", "attack": 76,
        "defense": 75, "continent": "NORTH_AMERICA"},

    # Grupo B
    {"name": "França", "code": "FRA", "group": "B",
        "attack": 91, "defense": 88, "continent": "EUROPE"},
    {"name": "México", "code": "MEX", "group": "B", "attack": 79,
        "defense": 77, "continent": "NORTH_AMERICA"},
    {"name": "Senegal", "code": "SEN", "group": "B",
        "attack": 80, "defense": 79, "continent": "AFRICA"},
    {"name": "Austrália", "code": "AUS", "group": "B",
        "attack": 75, "defense": 75, "continent": "OCEANIA"},

    # Grupo C
    {"name": "Argentina", "code": "ARG", "group": "C",
        "attack": 89, "defense": 86, "continent": "SOUTH_AMERICA"},
    {"name": "Estados Unidos", "code": "USA", "group": "C",
        "attack": 78, "defense": 77, "continent": "NORTH_AMERICA"},
    {"name": "Marrocos", "code": "MAR", "group": "C",
        "attack": 82, "defense": 81, "continent": "AFRICA"},
    {"name": "Coreia do Sul", "code": "KOR", "group": "C",
        "attack": 77, "defense": 76, "continent": "ASIA"},

    # Grupo D
    {"name": "Inglaterra", "code": "ENG", "group": "D",
        "attack": 88, "defense": 86, "continent": "EUROPE"},
    {"name": "Uruguai", "code": "URU", "group": "D", "attack": 84,
        "defense": 83, "continent": "SOUTH_AMERICA"},
    {"name": "Irã", "code": "IRN", "group": "D",
        "attack": 75, "defense": 76, "continent": "ASIA"},
    {"name": "Costa Rica", "code": "CRC", "group": "D",
        "attack": 73, "defense": 74, "continent": "NORTH_AMERICA"},

    # Grupo E
    {"name": "Espanha", "code": "ESP", "group": "E",
        "attack": 87, "defense": 85, "continent": "EUROPE"},
    {"name": "Colômbia", "code": "COL", "group": "E",
        "attack": 82, "defense": 80, "continent": "SOUTH_AMERICA"},
    {"name": "Egito", "code": "EGY", "group": "E",
        "attack": 77, "defense": 76, "continent": "AFRICA"},
    {"name": "Panamá", "code": "PAN", "group": "E", "attack": 72,
        "defense": 72, "continent": "NORTH_AMERICA"},

    # Grupo F
    {"name": "Alemanha", "code": "GER", "group": "F",
        "attack": 86, "defense": 84, "continent": "EUROPE"},
    {"name": "Equador", "code": "ECU", "group": "F", "attack": 79,
        "defense": 78, "continent": "SOUTH_AMERICA"},
    {"name": "Camarões", "code": "CMR", "group": "F",
        "attack": 76, "defense": 75, "continent": "AFRICA"},
    {"name": "Arábia Saudita", "code": "KSA", "group": "F",
        "attack": 74, "defense": 73, "continent": "ASIA"},

    # Grupo G
    {"name": "Portugal", "code": "POR", "group": "G",
        "attack": 87, "defense": 84, "continent": "EUROPE"},
    {"name": "Chile", "code": "CHI", "group": "G", "attack": 78,
        "defense": 77, "continent": "SOUTH_AMERICA"},
    {"name": "Gana", "code": "GHA", "group": "G",
        "attack": 76, "defense": 75, "continent": "AFRICA"},
    {"name": "Jamaica", "code": "JAM", "group": "G", "attack": 72,
        "defense": 71, "continent": "NORTH_AMERICA"},

    # Grupo H
    {"name": "Itália", "code": "ITA", "group": "H",
        "attack": 84, "defense": 86, "continent": "EUROPE"},
    {"name": "Paraguai", "code": "PAR", "group": "H",
        "attack": 76, "defense": 78, "continent": "SOUTH_AMERICA"},
    {"name": "Tunísia", "code": "TUN", "group": "H",
        "attack": 74, "defense": 75, "continent": "AFRICA"},
    {"name": "Uzbequistão", "code": "UZB", "group": "H",
        "attack": 73, "defense": 74, "continent": "ASIA"},

    # Grupo I
    {"name": "Holanda", "code": "NED", "group": "I",
        "attack": 86, "defense": 84, "continent": "EUROPE"},
    {"name": "Peru", "code": "PER", "group": "I", "attack": 77,
        "defense": 76, "continent": "SOUTH_AMERICA"},
    {"name": "Argélia", "code": "ALG", "group": "I",
        "attack": 77, "defense": 76, "continent": "AFRICA"},
    {"name": "Nova Zelândia", "code": "NZL", "group": "I",
        "attack": 70, "defense": 71, "continent": "OCEANIA"},

    # Grupo J
    {"name": "Bélgica", "code": "BEL", "group": "J",
        "attack": 84, "defense": 82, "continent": "EUROPE"},
    {"name": "Bolívia", "code": "BOL", "group": "J", "attack": 70,
        "defense": 69, "continent": "SOUTH_AMERICA"},
    {"name": "Costa do Marfim", "code": "CIV", "group": "J",
        "attack": 79, "defense": 77, "continent": "AFRICA"},
    {"name": "Iraque", "code": "IRQ", "group": "J",
        "attack": 71, "defense": 72, "continent": "ASIA"},

    # Grupo K
    {"name": "Croácia", "code": "CRO", "group": "K",
        "attack": 82, "defense": 83, "continent": "EUROPE"},
    {"name": "Venezuela", "code": "VEN", "group": "K",
        "attack": 75, "defense": 74, "continent": "SOUTH_AMERICA"},
    {"name": "África do Sul", "code": "RSA", "group": "K",
        "attack": 72, "defense": 73, "continent": "AFRICA"},
    {"name": "Emirados Árabes", "code": "UAE", "group": "K",
        "attack": 71, "defense": 71, "continent": "ASIA"},

    # Grupo L
    {"name": "Suíça", "code": "SUI", "group": "L",
        "attack": 81, "defense": 82, "continent": "EUROPE"},
    {"name": "Sérvia", "code": "SRB", "group": "L",
        "attack": 80, "defense": 79, "continent": "EUROPE"},
    {"name": "Honduras", "code": "HON", "group": "L",
        "attack": 70, "defense": 70, "continent": "NORTH_AMERICA"},
    {"name": "Mali", "code": "MLI", "group": "L",
        "attack": 75, "defense": 74, "continent": "AFRICA"},
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

    for group in Group.objects.all().order_by("name"):
        for team in group.teams.all().order_by("name"):
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
