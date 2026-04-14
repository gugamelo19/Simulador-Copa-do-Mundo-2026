from django.core.management.base import BaseCommand

from apps.simulations.services.import_service import import_world_cup_data_from_json


class Command(BaseCommand):
    help = "Importa grupos e seleções da Copa a partir de um arquivo JSON"

    def handle(self, *args, **options):
        import_world_cup_data_from_json()
        self.stdout.write(self.style.SUCCESS("Dados importados com sucesso."))
