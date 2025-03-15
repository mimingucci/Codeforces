package com.mimingucci.auth.infrastructure.service;

import com.mimingucci.auth.domain.event.UserForgotPasswordEvent;
import com.mimingucci.auth.domain.event.UserRegistrationEvent;
import com.mimingucci.auth.domain.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import static com.mimingucci.auth.common.constant.KafkaTopicConstants.*;

@Service
@RequiredArgsConstructor
public class KafkaProducerServiceImpl implements KafkaProducerService {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Override
    public void sendVerificationRegistrationEmail(String email) {
        kafkaTemplate.send(SEND_EMAIL_REGISTRATION, UserRegistrationEvent.builder().email(email).build());
    }

    @Override
    public void sendChangingPasswordEmail(String email) {
        kafkaTemplate.send(SEND_EMAIL_CHANGE_PASSWORD, UserForgotPasswordEvent.builder().email(email).build());
    }
}
