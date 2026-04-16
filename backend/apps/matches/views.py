from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.matches.models import Match
from apps.matches.serializers import MatchSerializer
from apps.simulations.services.simulation_service import (
    simulate_match,
    simulate_all_group_matches,
)


class MatchListAPIView(generics.ListAPIView):
    serializer_class = MatchSerializer

    def get_queryset(self):
        queryset = Match.objects.select_related(
            "group",
            "home_team",
            "away_team",
            "winner",
        ).all()

        group_name = self.request.query_params.get("group")
        phase = self.request.query_params.get("phase")
        played = self.request.query_params.get("played")

        if group_name:
            queryset = queryset.filter(group__name=group_name)

        if phase:
            queryset = queryset.filter(phase=phase)

        if played is not None:
            played_value = played.lower() == "true"
            queryset = queryset.filter(played=played_value)

        return queryset


class SimulateMatchAPIView(APIView):
    def post(self, request, pk):
        match = simulate_match(pk)
        serializer = MatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SimulateAllMatchesAPIView(APIView):
    def post(self, request):
        matches = simulate_all_group_matches()
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
