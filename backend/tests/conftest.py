"""Ensure the backend root is on sys.path so 'main' can be imported."""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
