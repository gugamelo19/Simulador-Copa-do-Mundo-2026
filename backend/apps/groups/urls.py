from django.urls import path

from apps.groups.views import GroupListAPIView

urlpatterns = [
    path("", GroupListAPIView.as_view(), name="group-list"),
]
