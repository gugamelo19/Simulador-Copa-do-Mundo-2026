from django.db import models


class Group(models.Model):
    name = models.CharField(max_length=1, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name = "Grupo"
        verbose_name_plural = "Grupos"

    def __str__(self):
        return f"Grupo {self.name}"
