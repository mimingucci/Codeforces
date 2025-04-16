package com.mimingucci.auth.infrastructure.util;

import java.security.SecureRandom;
import java.util.Base64;

public class RandomStringGenerator {
    private static final SecureRandom random = new SecureRandom();

    public static String generateSecure(int length) {
        byte[] bytes = new byte[length];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
                .substring(0, length);
    }
}
