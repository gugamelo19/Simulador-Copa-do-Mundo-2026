from django.urls import path

from apps.standings.views import StandingListAPIView

urlpatterns = [
    path("", StandingListAPIView.as_view(), name="standing-list"),
]