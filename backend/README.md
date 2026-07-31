# IndicDetect — Backend

FastAPI backend for the **IndicDetect** AI-vs-Human text detector (English + Hinglish routing).

---

## Quick start

```bash
# 1 — Create & activate virtual environment
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

# 2 — Install dependencies
pip install -r requirements.txt

# 3 — Run dev server
uvicorn main:app --reload --port 8000
```

Browse to **http://localhost:8000/docs** for the interactive Swagger UI.

---

## Project layout

```
backend/
├── main.py              # FastAPI app — all routes and business logic
├── requirements.txt     # Phase 1 deps (Phase 2 transformers lines commented out)
├── Dockerfile           # Production container
├── tests/
│   └── test_api.py      # pytest suite (language detector + API routes)
└── README.md
```

---

## API routes

| Method | Path       | Description                              |
|--------|------------|------------------------------------------|
| GET    | `/`        | Health check + service info              |
| GET    | `/health`  | Lightweight probe for Docker / LB        |
| POST   | `/predict` | Classify text as Human or AI             |

### `POST /predict` — request body

```json
{ "text": "yaar aaj mausam bahut accha hai" }
```

### Response

```json
{
  "label": "Human",
  "confidence": 0.83,
  "language_detected": "hinglish",
  "hindi_token_pct": 57.1,
  "english_token_pct": 42.9,
  "code_switch_ratio": 0.29,
  "mock": true
}
```

> **`mock: true`** — Phase 1 returns randomised predictions.  
> **`mock: false`** — Phase 2 uses the real HuggingFace models.

---

## Phase 2 — wiring in real models

1. Unzip `hinglish-detector.zip` and `english-detector.zip` into `backend/`.
2. In `main.py`, uncomment the `from transformers import pipeline …` block.
3. Set `MODELS_LOADED = True`.
4. Uncomment the real inference block inside `predict()`.
5. Restart: `uvicorn main:app --reload --port 8000`.
6. Test at `/docs` with one English and one Hinglish sentence.

---

## Running tests

```bash
pip install pytest httpx
pytest -v
```

---

## Docker

```bash
# Build
docker build -t indicdetect-backend .

# Run
docker run -p 8000:8000 indicdetect-backend
```

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| CORS errors in browser | Confirm `CORSMiddleware` is present; restart server |
| Language detector always picks one language | Tune `HINDI_WORDS` threshold or word list |
| Model fails to load | Check unzipped folder has `config.json` + weights + tokenizer files |
