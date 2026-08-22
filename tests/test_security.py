import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.core.security import hash_password, verify_password


def test_password_hash_is_different_from_plain_password():
    password = "test123"
    hashed = hash_password(password)

    assert hashed != password


def test_password_verification_success():
    password = "test123"
    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_password_verification_failure():
    password = "test123"
    hashed = hash_password(password)

    assert verify_password("wrongpassword", hashed) is False
