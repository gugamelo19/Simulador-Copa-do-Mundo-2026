from django.core.management.base import BaseCommand

from apps.simulations.services.match_generator import generate_group_stage_matches
from apps.simulations.services.seed_service import (
    initialize_group_standings,
    seed_groups,
    seed_teams,
)


class Command(BaseCommand):
    help = "Popula grupos, seleções, classificação inicial e partidas da fase de grupos"

    def handle(self, *args, **options):
        seed_groups()
        self.stdout.write(self.style.SUCCESS("Grupos criados com sucesso."))

        seed_teams()
        self.stdout.write(self.style.SUCCESS("Seleções criadas com sucesso."))

        initialize_group_standings()
        self.stdout.write(self.style.SUCCESS(
            "Classificações iniciais criadas com sucesso."))

        generate_group_stage_matches()
        self.stdout.write(self.style.SUCCESS(
            "Partidas da fase de grupos geradas com sucesso."))

        self.stdout.write(self.style.SUCCESS("Seed concluído com sucesso."))
