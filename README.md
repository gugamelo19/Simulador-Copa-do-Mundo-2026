# Simulador Copa do Mundo 2026

Simulador completo da Copa do Mundo FIFA 2026 — 48 seleções, 12 grupos e 104 partidas. Permite simular a fase de grupos e o mata-mata completo, com resultados calculados com base nos atributos de cada seleção.

## Tecnologias

**Backend**
- Python 3 + Django 5
- Django REST Framework
- PostgreSQL
- django-cors-headers
- python-decouple

**Frontend**
- React 19 + Vite 8
- React Router DOM
- CSS puro (sem frameworks)

---

## Pré-requisitos

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+

---

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/gugamelo19/Simulador-Copa-do-Mundo-2026.git
cd Simulador-Copa-do-Mundo-2026
```

### 2. Configure o banco de dados

Crie um banco no PostgreSQL:

```sql
CREATE DATABASE "world-cup-2026-db";
```

### 3. Configure o backend

```bash
cd backend

# Crie e ative o ambiente virtual
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/macOS

# Instale as dependências
python -m pip install -r requirements.txt
```

Crie o arquivo `backend/.env` com as suas credenciais:

```env
SECRET_KEY=sua-secret-key-aqui
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost

DB_NAME=world-cup-2026-db
DB_USER=postgres
DB_PASSWORD=sua-senha
DB_HOST=localhost
DB_PORT=5432
```

Execute as migrations e popule o banco:

```bash
python manage.py migrate
python manage.py seed-world-cup
python manage.py runserver
```

A API estará disponível em `http://localhost:8000/api/`.

### 4. Configure o frontend

```bash
cd frontend
npm install
npm run dev
```

O app estará disponível em `http://localhost:5173`.

---

## Como usar

1. Acesse a aba **Partidas** e clique em **Simular Todas** para simular a fase de grupos completa, ou simule jogo a jogo.
2. Acesse **Grupos** ou **Classificação** para ver a tabela atualizada.
3. Na aba **Mata-Mata**, clique em **Gerar e Simular** para rodar toda a fase eliminatória automaticamente.
4. Veja o campeão e o pódio completo em **Finais**.
5. Para recomeçar, clique em **Resetar** na aba Partidas.

---

## Estrutura do projeto

```
Simulador-Copa-do-Mundo-2026/
├── backend/
│   ├── apps/
│   │   ├── teams/          # Modelo de seleções (ataque, defesa, overall)
│   │   ├── groups/         # Grupos A–L
│   │   ├── matches/        # Partidas (fase de grupos e mata-mata)
│   │   ├── standings/      # Classificação por grupo
│   │   ├── simulations/    # Lógica de simulação e serviços
│   │   │   └── services/
│   │   │       ├── simulation_service.py    # Cálculo de gols por atributos
│   │   │       ├── knockout_service.py      # Geração e simulação do mata-mata
│   │   │       ├── qualification_service.py # Classificados para o mata-mata
│   │   │       ├── standings_service.py     # Recálculo da classificação
│   │   │       └── match_generator.py       # Geração das partidas de grupos
│   │   └── dashboard/      # Endpoints de resumo, stats e resultados finais
│   └── config/             # Configurações Django (settings, urls, wsgi)
└── frontend/
    └── src/
        ├── pages/          # Home, Grupos, Partidas, Classificação, Mata-Mata, Stats, Finais
        ├── components/     # Navbar
        ├── api/            # Cliente Axios
        └── styles/         # CSS global
```

---

## Lógica de simulação

Cada seleção possui três atributos numéricos: **ataque**, **defesa** e **overall** (média dos dois). Na simulação de uma partida, os gols de cada time são calculados comparando o ataque do time com a defesa do adversário. Quanto maior a diferença, mais favorável é a distribuição de probabilidade — usando `random.choices()` com pesos ajustados por faixa de força. Times muito superiores têm alta chance de fazer 3+ gols; times inferiores raramente passam de 1.

Em partidas de mata-mata, em caso de empate no tempo normal, o vencedor é sorteado aleatoriamente (representando prorrogação/pênaltis).

---

## API — Principais endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/matches/` | Lista todas as partidas |
| POST | `/api/matches/:id/simulate/` | Simula uma partida específica |
| POST | `/api/matches/simulate-all/` | Simula todas as partidas de grupos |
| GET | `/api/standings/` | Classificação de todos os grupos |
| GET | `/api/dashboard/` | Resumo geral do torneio |
| POST | `/api/dashboard/knockout/run-full/` | Gera e simula o mata-mata completo |
| POST | `/api/dashboard/reset-tournament/` | Reinicia o torneio |
| GET | `/api/dashboard/results/` | Resultados finais (campeão, vice, pódio) |
| GET | `/api/dashboard/stats/` | Estatísticas da fase de grupos |
