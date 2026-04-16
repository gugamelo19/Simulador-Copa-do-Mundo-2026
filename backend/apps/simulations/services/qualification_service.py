from apps.groups.models import Group
from apps.standings.models import Standing


def get_group_rankings():
    rankings = {}

    for group in Group.objects.all().order_by("name"):
        standings = list(
            Standing.objects.filter(group=group)
            .select_related("team")
            .order_by("-points", "-goal_difference", "-goals_for", "team__name")
        )
        rankings[group.name] = standings

    return rankings


def get_top_two_from_each_group():
    rankings = get_group_rankings()
    qualified = []

    for group_name, standings in rankings.items():
        if len(standings) >= 2:
            qualified.append(
                {
                    "group": group_name,
                    "position": 1,
                    "team": standings[0].team,
                    "points": standings[0].points,
                    "goal_difference": standings[0].goal_difference,
                    "goals_for": standings[0].goals_for,
                }
            )
            qualified.append(
                {
                    "group": group_name,
                    "position": 2,
                    "team": standings[1].team,
                    "points": standings[1].points,
                    "goal_difference": standings[1].goal_difference,
                    "goals_for": standings[1].goals_for,
                }
            )

    return qualified


def get_best_third_placed_teams():
    rankings = get_group_rankings()
    third_placed = []

    for group_name, standings in rankings.items():
        if len(standings) >= 3:
            third = standings[2]
            third_placed.append(
                {
                    "group": group_name,
                    "position": 3,
                    "team": third.team,
                    "points": third.points,
                    "goal_difference": third.goal_difference,
                    "goals_for": third.goals_for,
                }
            )

    third_placed.sort(
        key=lambda item: (
            item["points"],
            item["goal_difference"],
            item["goals_for"],
            item["team"].name,
        ),
        reverse=True,
    )

    return third_placed[:8]


def get_32_qualified_teams():
    top_two = get_top_two_from_each_group()
    best_thirds = get_best_third_placed_teams()

    return {
        "top_two": top_two,
        "best_thirds": best_thirds,
        "all_qualified": top_two + best_thirds,
    }
