package com.mimingucci.auth.common.enums;

public enum Role {
    SUPER_ADMIN, ADMIN, USER;

    // Optional: Handle case-insensitive conversion
    public static Role fromString(String value) {
        try {
            return Role.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Unknown role: " + value, e);
        }
    }
}
