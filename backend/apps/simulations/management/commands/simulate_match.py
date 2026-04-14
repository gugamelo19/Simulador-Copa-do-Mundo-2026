from django.core.management.base import BaseCommand, CommandError

from apps.simulations.services.simulation_service import simulate_match


class Command(BaseCommand):
    help = "Simula uma partida pelo ID"

    def add_arguments(self, parser):
        parser.add_argument("match_id", type=int,
                            help="ID da partida a ser simulada")

    def handle(self, *args, **options):
        match_id = options["match_id"]

        try:
            match = simulate_match(match_id)
        except Exception as exc:
            raise CommandError(f"Erro ao simular partida: {exc}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Partida simulada: {match.home_team.name} {match.home_score} x {match.away_score} {match.away_team.name}"
            )
        )
