package com.mimingucci.auth.domain.service;

import java.time.Instant;

public interface KafkaProducerService {
    void sendVerificationRegistrationEmail(String email);
    void sendChangingPasswordEmail(String email, String token);

    void sendWelcomeEmail(String email);

    void sendPasswordChangedEmail(String email, Instant now);
}
