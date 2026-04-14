import requests


OPENFOOTBALL_2026_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026--canada-mexico-usa/cup.txt"


def fetch_openfootball_2026_data():
    response = requests.get(OPENFOOTBALL_2026_URL, timeout=30)
    response.raise_for_status()
    return response.text
