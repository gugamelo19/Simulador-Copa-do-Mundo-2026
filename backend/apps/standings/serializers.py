from rest_framework import serializers

from apps.standings.models import Standing


class StandingSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)
    team_name = serializers.CharField(source="team.name", read_only=True)
    team_code = serializers.CharField(source="team.code", read_only=True)

    class Meta:
        model = Standing
        fields = [
            "id",
            "group",
            "group_name",
            "team",
            "team_name",
            "team_code",
            "played",
            "wins",
            "draws",
            "losses",
            "goals_for",
            "goals_against",
            "goal_difference",
            "points",
        ]
