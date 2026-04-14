from django.contrib import admin
from .models import Standing


@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "group",
        "team",
        "played",
        "wins",
        "draws",
        "losses",
        "goals_for",
        "goals_against",
        "goal_difference",
        "points",
    )
    list_filter = ("group",)
    search_fields = ("team__name",)
