package com.mimingucci.auth.domain.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationUser {
    private String email;

    private String verificationCode;

    private String forgotPasswordToken;

    private NotificationUserType type;

    private Instant createdAt;

    public enum NotificationUserType {
        REGISTER, FORGOT_PASSWORD, WELCOME, PASSWORD_CHANGED
    }
}
