from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.simulations.services.match_generator import generate_group_stage_matches
from apps.simulations.services.seed_service import initialize_group_standings
from apps.simulations.services.simulation_service import reset_all_matches_and_standings


class FullResetTournamentAPIView(APIView):
    def post(self, request):
        reset_all_matches_and_standings()
        initialize_group_standings()
        generate_group_stage_matches()

        return Response(
            {"detail": "Campeonato resetado com sucesso."},
            status=status.HTTP_200_OK,
        )
