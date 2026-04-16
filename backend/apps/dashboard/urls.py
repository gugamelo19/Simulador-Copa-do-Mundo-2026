from django.urls import path

from apps.dashboard.knockout_views import RunFullKnockoutAPIView
from apps.dashboard.reset_views import FullResetTournamentAPIView
from apps.dashboard.results_views import ResultsAPIView
from apps.dashboard.stats_views import StatsAPIView
from apps.dashboard.views import DashboardAPIView

urlpatterns = [
    path("", DashboardAPIView.as_view(), name="dashboard"),
    path("stats/", StatsAPIView.as_view(), name="stats"),
    path("results/", ResultsAPIView.as_view(), name="results"),
    path("reset-tournament/", FullResetTournamentAPIView.as_view(),
         name="reset-tournament"),
    path("knockout/run-full/", RunFullKnockoutAPIView.as_view(),
         name="run-full-knockout"),
]
