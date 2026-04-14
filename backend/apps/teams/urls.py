from django.urls import path

from apps.teams.views import TeamListAPIView

urlpatterns = [
    path("", TeamListAPIView.as_view(), name="team-list"),
]
