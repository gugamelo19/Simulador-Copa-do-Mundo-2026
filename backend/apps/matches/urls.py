from django.urls import path
from apps.matches.views import (
    MatchListAPIView,
    SimulateMatchAPIView,
    SimulateAllMatchesAPIView,
    ResetMatchesAPIView,
)

urlpatterns = [
    path("", MatchListAPIView.as_view(), name="match-list"),
    path("<int:pk>/simulate/", SimulateMatchAPIView.as_view(), name="match-simulate"),
    path("simulate-all/", SimulateAllMatchesAPIView.as_view(),
         name="simulate-all-matches"),
    path("reset/", ResetMatchesAPIView.as_view(), name="reset-matches"),
]
