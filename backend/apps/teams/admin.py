from django.contrib import admin
from .models import Team


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "code", "group", "attack",
                    "defense", "overall", "continent")
    list_filter = ("group", "continent")
    search_fields = ("name", "code")
