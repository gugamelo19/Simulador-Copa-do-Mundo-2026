from django.core.exceptions import ValidationError
from django.db import models


class Match(models.Model):
    PHASE_CHOICES = [
        ("GROUP", "Fase de Grupos"),
        ("R32", "32 avos"),
        ("R16", "Oitavas de Final"),
        ("QF", "Quartas de Final"),
        ("SF", "Semifinal"),
        ("THIRD", "Terceiro Lugar"),
        ("FINAL", "Final"),
    ]

    phase = models.CharField(max_length=10, choices=PHASE_CHOICES)
    group = models.ForeignKey(
        "groups.Group",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="matches"
    )
    home_team = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="home_matches"
    )
    away_team = models.ForeignKey(
        "teams.Team",
        on_delete=models.CASCADE,
        related_name="away_matches"
    )
    home_score = models.PositiveIntegerField(null=True, blank=True)
    away_score = models.PositiveIntegerField(null=True, blank=True)
    played = models.BooleanField(default=False)
    match_date = models.DateTimeField(null=True, blank=True)
    winner = models.ForeignKey(
        "teams.Team",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="won_matches"
    )

    class Meta:
        ordering = ["phase", "match_date", "id"]
        verbose_name = "Partida"
        verbose_name_plural = "Partidas"

    def __str__(self):
        return f"{self.home_team} vs {self.away_team} - {self.phase}"

    def clean(self):
        if self.home_team == self.away_team:
            raise ValidationError("Um time não pode jogar contra ele mesmo.")

        if self.phase == "GROUP" and not self.group:
            raise ValidationError(
                "Partidas da fase de grupos devem possuir um grupo.")

        if self.phase != "GROUP" and self.group:
            raise ValidationError(
                "Partidas de mata-mata não devem possuir grupo.")
