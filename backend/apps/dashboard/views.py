from rest_framework.response import Response
from rest_framework.views import APIView

from apps.groups.models import Group
from apps.matches.models import Match
from apps.standings.models import Standing


class DashboardAPIView(APIView):
    def get(self, request):
        total_matches = Match.objects.count()
        played_matches = Match.objects.filter(played=True).count()
        pending_matches = Match.objects.filter(played=False).count()
        total_groups = Group.objects.count()

        leaders = []

        for group in Group.objects.all():
            leader = (
                Standing.objects.filter(group=group)
                .order_by("-points", "-goal_difference", "-goals_for")
                .first()
            )

            if leader:
                leaders.append({
                    "group": group.name,
                    "team": leader.team.name,
                    "points": leader.points
                })

        data = {
            "total_matches": total_matches,
            "played_matches": played_matches,
            "pending_matches": pending_matches,
            "total_groups": total_groups,
            "group_leaders": leaders
        }

        return Response(data)
