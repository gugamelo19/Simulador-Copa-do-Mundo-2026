from django.urls import path

from apps.matches.views import MatchListAPIView, SimulateMatchAPIView

urlpatterns = [
    path("", MatchListAPIView.as_view(), name="match-list"),
    path("<int:pk>/simulate/", SimulateMatchAPIView.as_view(), name="match-simulate"),
]
