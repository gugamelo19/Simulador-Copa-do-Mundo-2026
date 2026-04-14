from rest_framework import serializers

from apps.teams.models import Team


class TeamSerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Team
        fields = [
            "id",
            "name",
            "code",
            "group",
            "group_name",
            "attack",
            "defense",
            "overall",
            "continent",
        ]
