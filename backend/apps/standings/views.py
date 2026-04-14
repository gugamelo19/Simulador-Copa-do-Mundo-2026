from rest_framework import generics

from apps.standings.models import Standing
from apps.standings.serializers import StandingSerializer


class StandingListAPIView(generics.ListAPIView):
    serializer_class = StandingSerializer

    def get_queryset(self):
        queryset = Standing.objects.select_related("group", "team").all()

        group_name = self.request.query_params.get("group")

        if group_name:
            queryset = queryset.filter(group__name=group_name)

        return queryset.order_by(
            "group__name",
            "-points",
            "-goal_difference",
            "-goals_for",
            "team__name",
        )
