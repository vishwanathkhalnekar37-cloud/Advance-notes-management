"""Utility for generating shareable links"""
import secrets
import string


def generate_share_token(length: int = 32) -> str:
    """Generate a unique token for sharing notes"""
    chars = string.ascii_letters + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))


def validate_share_token(token: str) -> bool:
    """Validate share token format"""
    return len(token) == 32 and token.isalnum()
