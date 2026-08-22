import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))

from app.core.security import (
    generate_temporary_password,
    hash_password,
    verify_password,
)


def test_generate_temporary_password():
    password = generate_temporary_password()

    assert password is not None
    assert isinstance(password, str)
    assert len(password) > 0


def test_hash_password():
    password = "test123"

    hashed = hash_password(password)

    assert hashed is not None
    assert isinstance(hashed, str)
    assert hashed != password


def test_verify_correct_password():
    password = "test123"

    hashed = hash_password(password)

    assert verify_password(password, hashed) is True


def test_verify_wrong_password():
    password = "test123"

    hashed = hash_password(password)

    assert verify_password("wrongpassword", hashed) is False


def test_different_passwords_have_different_hashes():
    password = "test123"

    hash1 = hash_password(password)
    hash2 = hash_password(password)

    assert hash1 != hash2
