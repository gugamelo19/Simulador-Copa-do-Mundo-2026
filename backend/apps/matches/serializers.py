from rest_framework import serializers

from apps.matches.models import Match


class MatchSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)
    home_team_name = serializers.CharField(
        source="home_team.name", read_only=True)
    away_team_name = serializers.CharField(
        source="away_team.name", read_only=True)
    winner_name = serializers.CharField(source="winner.name", read_only=True)

    class Meta:
        model = Match
        fields = [
            "id",
            "phase",
            "group",
            "group_name",
            "home_team",
            "home_team_name",
            "away_team",
            "away_team_name",
            "home_score",
            "away_score",
            "played",
            "match_date",
            "winner",
            "winner_name",
        ]
