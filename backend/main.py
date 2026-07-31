"""
IndicDetect — FastAPI Backend
AI-vs-Human Detector supporting English and Hinglish text.

Phase 1 (Mock): Returns randomised predictions — wire in real models later.
Phase 2 (Real): Uncomment the model-loading block and replace the mock
                predict() body with the real one.
"""

import os
import random
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

# ---------------------------------------------------------------------------
# App setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="IndicDetect API",
    description=(
        "AI-vs-Human text detector with Hinglish / English routing. "
        "Submit text in English or Hinglish (Roman-script Hindi-English mix) "
        "and receive a Human/AI prediction with confidence and code-switching stats."
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Heuristic language detector (Step 4.1 from product.md)
# ---------------------------------------------------------------------------

HINDI_WORDS = {
    "yaar", "hai", "nahi", "bhai", "accha", "kya", "bahut", "mast", "mausam",
    "ghar", "nikalne", "mann", "kal", "wali", "party", "log", "aa", "gaye",
    "the", "ka", "ki", "ko", "se", "aur", "bhi", "toh", "kar", "raha", "rahe",
    "hoon", "hain", "tha", "thi", "mera", "tera", "uska", "iska", "yeh", "woh",
}


ENGLISH_COMMON_WORDS = {
    "i", "you", "he", "she", "it", "we", "they", "is", "are", "was", "were", "am",
    "be", "been", "being", "have", "has", "had", "do", "does", "did", "a", "an",
    "and", "but", "or", "because", "as", "until", "while", "of", "at", "by", "for",
    "with", "about", "against", "between", "into", "through", "during", "before",
    "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off",
    "over", "under", "again", "further", "then", "once", "this", "that", "these", "those"
}


def detect_language(text: str, threshold: float = 0.15) -> str:
    """Return 'hinglish' or 'english' based on Hindi-word ratio."""
    words = [w.strip(".,!?\"'()[]{}").lower() for w in text.split() if w.strip(".,!?\"'()[]{}")]
    if not words:
        return "english"

    eng_matches = sum(1 for w in words if w in ENGLISH_COMMON_WORDS)
    hindi_count = 0
    for w in words:
        if w == "the" and eng_matches >= 1:
            continue
        if w in HINDI_WORDS:
            hindi_count += 1

    ratio = hindi_count / len(words)
    return "hinglish" if ratio >= threshold else "english"



# ---------------------------------------------------------------------------
# Code-switching statistics (Step 4.2 from product.md)
# ---------------------------------------------------------------------------

def code_switch_stats(text: str) -> dict:
    """Compute Hindi%, English%, and code-switch ratio for the given text."""
    words = text.lower().split()
    if not words:
        return {"hindi_token_pct": 0.0, "english_token_pct": 0.0, "code_switch_ratio": 0.0}

    hindi_count = sum(1 for w in words if w.strip(".,!?") in HINDI_WORDS)
    total = len(words)
    hindi_pct = round(100 * hindi_count / total, 1)
    english_pct = round(100 - hindi_pct, 1)

    switches = 0
    prev: Optional[bool] = None
    for w in words:
        is_hindi = w.strip(".,!?") in HINDI_WORDS
        if prev is not None and is_hindi != prev:
            switches += 1
        prev = is_hindi

    return {
        "hindi_token_pct": hindi_pct,
        "english_token_pct": english_pct,
        "code_switch_ratio": round(switches / total, 2),
    }


# ---------------------------------------------------------------------------
# Real-model loading (Phase 2)
# ---------------------------------------------------------------------------

hing_clf = None
eng_clf = None
MODELS_LOADED = False


def find_model_path(model_name: str) -> Optional[str]:
    """Search candidate directories for a model folder containing config.json."""
    base_dir = os.path.dirname(__file__)
    candidate_dirs = [
        os.path.join(os.getenv("MODEL_DIR", "."), model_name),
        os.path.join(base_dir, model_name),
        os.path.join(base_dir, "..", model_name),
        os.path.join(".", model_name),
    ]
    for d in candidate_dirs:
        config_path = os.path.join(d, "config.json")
        if os.path.exists(config_path):
            return os.path.abspath(d)
        nested_config = os.path.join(d, model_name, "config.json")
        if os.path.exists(nested_config):
            return os.path.abspath(os.path.join(d, model_name))
    return None


try:
    from transformers import pipeline

    hing_path = find_model_path("hinglish-detector")
    eng_path = find_model_path("english-detector")

    if hing_path and eng_path:
        print(f"Loading Hinglish model from: {hing_path}")
        hing_clf = pipeline("text-classification", model=hing_path, tokenizer=hing_path)
        print(f"Loading English model from: {eng_path}")
        eng_clf = pipeline("text-classification", model=eng_path, tokenizer=eng_path)
        MODELS_LOADED = True
        print("Both English and Hinglish models loaded successfully!")
    else:
        print(f"Model directories not found (Hinglish: {hing_path}, English: {eng_path}). Running in mock mode.")
except Exception as e:
    print(f"Warning: Could not initialize model pipeline: {e}. Running in mock mode.")


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class TextInput(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("text must not be blank")
        return v


class PredictionResponse(BaseModel):
    label: str                  # "Human" | "AI"
    confidence: float           # 0.0 – 1.0
    language_detected: str      # "english" | "hinglish"
    hindi_token_pct: float
    english_token_pct: float
    code_switch_ratio: float
    mock: bool = True           # False once real models are wired in


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/", tags=["health"])
def root():
    """Health check — confirms the service is running."""
    return {
        "service": "IndicDetect API",
        "status": "running",
        "models_loaded": MODELS_LOADED,
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
def health():
    """Lightweight health probe for load-balancers / Docker."""
    return {"status": "ok", "models_loaded": MODELS_LOADED}


@app.post("/predict", response_model=PredictionResponse, tags=["inference"])
def predict(payload: TextInput):
    """
    Predict whether the submitted text is Human- or AI-written.
    """
    text = payload.text.strip()

    lang = detect_language(text)
    cs = code_switch_stats(text)

    if MODELS_LOADED and hing_clf and eng_clf:
        clf = hing_clf if lang == "hinglish" else eng_clf
        result = clf(text)[0]
        raw_label = str(result.get("label", "")).upper()
        label = "AI" if raw_label in ("LABEL_1", "1", "AI") else "Human"
        confidence = round(float(result.get("score", 0.90)), 2)
        return PredictionResponse(
            label=label,
            confidence=confidence,
            language_detected=lang,
            mock=False,
            **cs,
        )

    # ── Fallback mock response if models not loaded ─────────────────────
    return PredictionResponse(
        label=random.choice(["Human", "AI"]),
        confidence=round(random.uniform(0.60, 0.95), 2),
        language_detected=lang,
        mock=True,
        **cs,
    )

