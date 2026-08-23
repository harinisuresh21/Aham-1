from firebase_admin import auth

from app.core.firebase import get_firebase_app


class TokenVerificationError(Exception):
    def __init__(self, message: str = "Invalid or expired authentication token"):
        super().__init__(message)
        self.message = message


def verify_firebase_token(id_token: str) -> dict:
    try:
        return auth.verify_id_token(id_token, app=get_firebase_app(), check_revoked=True)
    except (auth.InvalidIdTokenError, auth.ExpiredIdTokenError, auth.RevokedIdTokenError) as exc:
        raise TokenVerificationError(str(exc)) from exc
    except ValueError as exc:
        raise TokenVerificationError("Malformed authentication token") from exc
