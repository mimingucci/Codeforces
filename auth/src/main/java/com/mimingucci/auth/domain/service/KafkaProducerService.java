package com.mimingucci.auth.domain.service;

public interface KafkaProducerService {
    void sendVerificationRegistrationEmail(String email);
    void sendChangingPasswordEmail(String email);
}
