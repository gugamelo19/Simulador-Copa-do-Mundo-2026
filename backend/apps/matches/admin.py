from django.contrib import admin
from .models import Match


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "phase",
        "group",
        "home_team",
        "away_team",
        "home_score",
        "away_score",
        "played",
        "winner",
    )
    list_filter = ("phase", "group", "played")
    search_fields = ("home_team__name", "away_team__name")
