import jwt as pyjwt
import datetime
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import serialization

class JwtUtil:
    def __init__(self, public_key_path, private_key_path=None):
        # Load public key
        with open(public_key_path, 'rb') as key_file:
            public_key_data = key_file.read()
        
        self.public_key = serialization.load_pem_public_key(
            public_key_data,
            backend=default_backend()
        )
        
        # Load private key if provided
        self.private_key = None
        if private_key_path:
            with open(private_key_path, 'rb') as key_file:
                private_key_data = key_file.read()
            
            self.private_key = serialization.load_pem_private_key(
                private_key_data,
                password=None,
                backend=default_backend()
            )
    
    def validate_token(self, token):
        """
        Validates the JWT token and returns the claims.
        Equivalent to Java's validateToken method.
        
        Throws exceptions if the token is invalid, expired, or malformed.
        """
        try:
            # Use the public key to verify and decode the token
            payload = pyjwt.decode(
                token, 
                self.public_key,
                algorithms=['RS256'],
                options={"verify_signature": True}
            )
            return payload
        except pyjwt.ExpiredSignatureError:
            # Equivalent to Java's ExpiredJwtException
            raise pyjwt.ExpiredSignatureError("Token has expired")
        except pyjwt.InvalidTokenError:
            # Covers various token errors similar to Java exceptions
            raise pyjwt.InvalidTokenError("Invalid token")
    
    def is_token_expired(self, token):
        """
        Checks if the token is expired.
        Equivalent to Java's isTokenExpired method.
        """
        try:
            claims = self.validate_token(token)
            expiration = datetime.datetime.fromtimestamp(claims['exp'])
            return expiration < datetime.datetime.now()
        except Exception:
            return True  # If token is invalid, consider it expired
    
    def extract_email(self, token):
        """
        Extracts the email (subject) from the token.
        Equivalent to Java's extractEmail method.
        """
        try:
            claims = self.validate_token(token)
            return claims.get('sub')
        except Exception:
            return None  # If token is invalid, return None
    
    def extract_id(self, token):
        """
        Extracts the user ID from the token.
        Equivalent to Java's extractId method.
        """
        try:
            claims = self.validate_token(token)
            return claims.get('id')
        except Exception:
            return None
    
    def extract_all_claims(self, token):
        """
        Extracts all claims from the token.
        Equivalent to Java's extractAllClaims method.
        """
        try:
            return self.validate_token(token)
        except Exception:
            return None  # If token is invalid, return None
    
    def generate_token(self, subject="SYSTEM", expiration_minutes=1):
        """
        Generates a new JWT token.
        Equivalent to Java's generateToken method.
        """
        if not self.private_key:
            raise ValueError("Private key not provided, cannot generate token")
        
        now = datetime.datetime.now()
        payload = {
            'sub': subject,
            'iat': now,
            'exp': now + datetime.timedelta(minutes=expiration_minutes)
        }
        
        return pyjwt.encode(
            payload,
            self.private_key,
            algorithm='RS256'
        )

    def extract_claims_from_request(self, request):
        """
        Extracts claims from an HTTP request Authorization header.
        Equivalent to Java's extractClaimsFromHttpRequest method.
        """
        auth_header = request.headers.get('Authorization')
        claims = None
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header[7:]  # Remove "Bearer " prefix
            claims = self.extract_all_claims(token)
            
        return claims