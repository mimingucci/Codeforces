package com.mimingucci.auth.common.util;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.UserRepositoryImpl;
import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class JwtUtil {
    @Value("${jwt.private-key}")
    private String privateKeyPath;

    @Value("${jwt.public-key}")
    private String publicKeyPath;

    private final UserRepositoryImpl userRepository; // Inject UserRepository

    private PrivateKey privateKey;
    private PublicKey publicKey;

    @PostConstruct
    public void init() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
        // Load private key
        String privateKeyContent = new String(Files.readAllBytes(Paths.get(privateKeyPath)))
                .replace("-----BEGIN PRIVATE KEY-----", "")
                .replace("-----END PRIVATE KEY-----", "")
                .replaceAll("\\s", "");
        byte[] privateKeyBytes = Base64.getDecoder().decode(privateKeyContent);
        PKCS8EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
        privateKey = KeyFactory.getInstance("RSA").generatePrivate(privateKeySpec);

        // Load public key
        String publicKeyContent = new String(Files.readAllBytes(Paths.get(publicKeyPath)))
                .replace("-----BEGIN PUBLIC KEY-----", "")
                .replace("-----END PUBLIC KEY-----", "")
                .replaceAll("\\s", "");
        byte[] publicKeyBytes = Base64.getDecoder().decode(publicKeyContent);
        X509EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
        publicKey = KeyFactory.getInstance("RSA").generatePublic(publicKeySpec);
    }

    /**
     * Generates a JWT access token for the given email.
     */
    public String generateAccessToken(Long id, String email, Set<Role> roles) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id", id)
                .claim("roles", roles)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10000L)) // 10 hours
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    /**
     * Generates a JWT refresh token for the given email.
     */
    public String generateRefreshToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    /**
     * Generates a JWT token for the given email.
     */
    public String generateCustomToken(String subject) {
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24 hours
                .signWith(privateKey, SignatureAlgorithm.RS256)
                .compact();
    }

    /**
     * Validates the JWT token and returns the claims.
     * Throws exceptions if the token is invalid, expired, or malformed.
     */
    public Claims validateToken(String token) throws ExpiredJwtException, UnsupportedJwtException, MalformedJwtException, IllegalArgumentException {
        return Jwts.parserBuilder()
                .setSigningKey(publicKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Checks if the token is expired.
     */
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = validateToken(token);
            return claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return true; // If token is invalid, consider it expired
        }
    }

    /**
     * Extracts the email (subject) from the token.
     */
    public String extractEmail(String token) {
        try {
            Claims claims = validateToken(token);
            return claims.getSubject();
        } catch (Exception e) {
            return null; // If token is invalid, return null
        }
    }

    /**
     * Extracts the expiration date from the token.
     */
    public Date extractExpiration(String token) {
        try {
            Claims claims = validateToken(token);
            return claims.getExpiration();
        } catch (Exception e) {
            return null; // If token is invalid, return null
        }
    }

    /**
     * Extracts all claims from the token.
     */
    public Claims extractAllClaims(String token) {
        try {
            return validateToken(token);
        } catch (Exception e) {
            return null; // If token is invalid, return null
        }
    }

    /**
     * Validates the token subject (email) against the database.
     * Returns true if the user exists and matches the expected information.
     */
    public boolean validateTokenSubject(String token) {
        try {
            // Extract email from token
            String email = extractEmail(token);
            if (email == null) {
                return false; // Invalid token
            }

            // Query the database to check if the user exists
            User user = this.userRepository.findByEmail(email);
            if (user == null) {
                return false; // User not found
            }

            return user.getEnabled(); // Example: Check if the user is active
        } catch (Exception e) {
            return false; // If any error occurs, consider the token invalid
        }
    }

    /**
     * Refreshes the access token using the refresh token.
     * Returns a new access token if the refresh token is valid.
     */
//    public String refreshAccessToken(String refreshToken) {
//        try {
//            // Validate the refresh token
//            Claims claims = validateToken(refreshToken);
//            String username = claims.getSubject();
//
//            // Check if the refresh token matches the one stored in the database
//            User user = userRepository.findByUsername(username);
//            if (user == null) {
//                return null; // User not found
//            }
//
//            if (!refreshToken.equals(user.getRefreshToken())) {
//                return null; // Refresh token does not match
//            }
//
//            // Check if the refresh token is expired
//            if (isTokenExpired(refreshToken)) {
//                return null; // Refresh token is expired
//            }
//
//            // Generate a new access token
//            return generateAccessToken(username);
//        } catch (Exception e) {
//            return null; // If any error occurs, return null
//        }
//    }
}

