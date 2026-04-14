from django.db import models


class Team(models.Model):
    CONTINENT_CHOICES = [
        ("SOUTH_AMERICA", "América do Sul"),
        ("NORTH_AMERICA", "América do Norte"),
        ("EUROPE", "Europa"),
        ("AFRICA", "África"),
        ("ASIA", "Ásia"),
        ("OCEANIA", "Oceania"),
    ]

    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=3, unique=True)
    group = models.ForeignKey(
        "groups.Group",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="teams"
    )
    attack = models.PositiveIntegerField(default=70)
    defense = models.PositiveIntegerField(default=70)
    overall = models.PositiveIntegerField(default=70)
    continent = models.CharField(
        max_length=20,
        choices=CONTINENT_CHOICES,
        blank=True
    )

    class Meta:
        ordering = ["name"]
        verbose_name = "Seleção"
        verbose_name_plural = "Seleções"

    def __str__(self):
        return f"{self.name} ({self.code})"
