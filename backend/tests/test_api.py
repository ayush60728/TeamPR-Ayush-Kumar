"""
Tests for IndicDetect backend.

Run:  pytest            (all tests)
      pytest -v -s      (verbose, stdout visible)
"""

import pytest
from fastapi.testclient import TestClient

from main import app, detect_language, code_switch_stats

client = TestClient(app)


# ---------------------------------------------------------------------------
# Unit tests — language detector
# ---------------------------------------------------------------------------

class TestDetectLanguage:
    def test_english_sentence(self):
        assert detect_language("I love the weather today") == "english"

    def test_hinglish_sentence(self):
        assert detect_language("yaar aaj mausam bahut accha hai") == "hinglish"

    def test_empty_string(self):
        assert detect_language("") == "english"

    def test_mixed_high_hindi(self):
        # More than 12 % Hindi words → hinglish
        text = "yaar bhai kya baat hai aur bhi toh log"
        assert detect_language(text) == "hinglish"

    def test_pure_english_no_hindi(self):
        text = "The quarterly report shows strong growth in all segments"
        assert detect_language(text) == "english"


# ---------------------------------------------------------------------------
# Unit tests — code-switch stats
# ---------------------------------------------------------------------------

class TestCodeSwitchStats:
    def test_empty_text(self):
        stats = code_switch_stats("")
        assert stats == {"hindi_token_pct": 0.0, "english_token_pct": 0.0, "code_switch_ratio": 0.0}

    def test_all_english(self):
        stats = code_switch_stats("hello world how are you")
        assert stats["hindi_token_pct"] == 0.0
        assert stats["english_token_pct"] == 100.0

    def test_all_hindi(self):
        # All words in HINDI_WORDS
        stats = code_switch_stats("yaar bhai hai nahi kya")
        assert stats["hindi_token_pct"] == 100.0
        assert stats["english_token_pct"] == 0.0

    def test_percentages_sum_to_100(self):
        stats = code_switch_stats("yaar I am feeling bahut good today")
        total = stats["hindi_token_pct"] + stats["english_token_pct"]
        assert abs(total - 100.0) < 0.01

    def test_code_switch_ratio_non_negative(self):
        stats = code_switch_stats("yaar let's go party kar")
        assert stats["code_switch_ratio"] >= 0.0


# ---------------------------------------------------------------------------
# Integration tests — API routes
# ---------------------------------------------------------------------------

class TestHealthRoutes:
    def test_root(self):
        r = client.get("/")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "running"
        assert "models_loaded" in data

    def test_health(self):
        r = client.get("/health")
        assert r.status_code == 200
        assert r.json()["status"] == "ok"


class TestPredictRoute:
    def test_basic_english(self):
        r = client.post("/predict", json={"text": "I enjoy reading books on weekends"})
        assert r.status_code == 200
        data = r.json()
        assert data["label"] in ("Human", "AI")
        assert 0.0 <= data["confidence"] <= 1.0
        assert data["language_detected"] == "english"
        assert isinstance(data["mock"], bool)

    def test_basic_hinglish(self):
        r = client.post("/predict", json={"text": "yaar aaj mausam bahut accha hai"})
        assert r.status_code == 200
        data = r.json()
        assert data["language_detected"] == "hinglish"
        assert data["label"] in ("Human", "AI")
        assert isinstance(data["mock"], bool)

    def test_blank_text_raises_422(self):
        r = client.post("/predict", json={"text": "   "})
        assert r.status_code == 422   # Pydantic validation error

    def test_missing_text_field_raises_422(self):
        r = client.post("/predict", json={})
        assert r.status_code == 422

    def test_response_has_all_fields(self):
        r = client.post("/predict", json={"text": "Testing the API response shape"})
        assert r.status_code == 200
        keys = {"label", "confidence", "language_detected",
                "hindi_token_pct", "english_token_pct", "code_switch_ratio", "mock"}
        assert keys.issubset(r.json().keys())

    def test_code_switch_fields_are_numbers(self):
        r = client.post("/predict", json={"text": "yaar let me tell you something bhai"})
        data = r.json()
        assert isinstance(data["hindi_token_pct"], (int, float))
        assert isinstance(data["english_token_pct"], (int, float))
        assert isinstance(data["code_switch_ratio"], (int, float))
