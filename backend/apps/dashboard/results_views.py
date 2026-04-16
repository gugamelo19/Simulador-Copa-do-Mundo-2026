from rest_framework.response import Response
from rest_framework.views import APIView

from apps.matches.models import Match


class ResultsAPIView(APIView):
    def get(self, request):
        final_match = Match.objects.filter(phase="FINAL").select_related(
            "home_team", "away_team", "winner"
        ).first()

        third_match = Match.objects.filter(phase="THIRD").select_related(
            "home_team", "away_team", "winner"
        ).first()

        champion = None
        vice = None
        third_place = None
        fourth_place = None

        if final_match and final_match.played:
            champion = final_match.winner.name if final_match.winner else None
            vice = (
                final_match.away_team.name
                if final_match.winner == final_match.home_team
                else final_match.home_team.name
            )

        if third_match and third_match.played:
            third_place = third_match.winner.name if third_match.winner else None
            fourth_place = (
                third_match.away_team.name
                if third_match.winner == third_match.home_team
                else third_match.home_team.name
            )

        data = {
            "champion": champion,
            "vice": vice,
            "third_place": third_place,
            "fourth_place": fourth_place,
            "final_played": final_match.played if final_match else False,
        }

        return Response(data)
