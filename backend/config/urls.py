from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/groups/", include("apps.groups.urls")),
    path("api/teams/", include("apps.teams.urls")),
    path("api/matches/", include("apps.matches.urls")),
    path("api/standings/", include("apps.standings.urls")),
]
