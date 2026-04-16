from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.matches.serializers import MatchSerializer
from apps.simulations.services.knockout_service import run_full_knockout


class RunFullKnockoutAPIView(APIView):
    def post(self, request):
        result = run_full_knockout()
        serialized = {}

        for key, matches in result.items():
            serialized[key] = MatchSerializer(matches, many=True).data

        return Response(serialized, status=status.HTTP_200_OK)