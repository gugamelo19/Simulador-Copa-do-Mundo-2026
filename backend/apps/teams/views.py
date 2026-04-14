from rest_framework import generics

from apps.teams.models import Team
from apps.teams.serializers import TeamSerializer


class TeamListAPIView(generics.ListAPIView):
    queryset = Team.objects.select_related("group").all()
    serializer_class = TeamSerializer
