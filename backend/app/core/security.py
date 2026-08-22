import secrets
import string

from passlib.context import CryptContext


pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto"
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


def generate_temporary_password(
    length: int = 10
) -> str:

    characters = (
        string.ascii_letters
        + string.digits
        + "!@#$%"
    )

    return "".join(
        secrets.choice(characters)
        for _ in range(length)
    )
