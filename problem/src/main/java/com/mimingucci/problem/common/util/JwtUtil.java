package com.mimingucci.problem.common.util;

import io.jsonwebtoken.*;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtUtil {

    @Value("${jwt.public-key}")
    private String publicKeyPath;

    private PublicKey publicKey;

    @PostConstruct
    public void init() throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {

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
     *
     * @param token String
     * @return Long
     */
    public Long extractId(String token) {
        try {
            Claims claims = validateToken(token);
            return claims.get("id", Long.class);
        } catch (Exception e) {
            return null;
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

    public Claims extractClaimsFromHttpRequest(HttpServletRequest request) {
        // Extract the JWT token from the Authorization header
        final String authorizationHeader = request.getHeader("Authorization");

        Claims claims = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
            claims = this.extractAllClaims(token); // Extract email from the token
        }

        return claims;
    }
}
