package com.mimingucci.auth.infrastructure.service;

import com.mimingucci.auth.common.util.JwtUtil;
import com.mimingucci.auth.domain.event.NotificationUser;
import com.mimingucci.auth.domain.service.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;

import static com.mimingucci.auth.common.constant.KafkaTopicConstants.*;

@Service
@RequiredArgsConstructor
public class KafkaProducerServiceImpl implements KafkaProducerService {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private final JwtUtil jwtUtil;

    @Override
    public void sendVerificationRegistrationEmail(String email) {
        kafkaTemplate.send(NOTIFICATION_USER, NotificationUser.builder().email(email).type(NotificationUser.NotificationUserType.REGISTER).verificationCode(jwtUtil.generateRefreshToken(email)).build());
    }

    @Override
    public void sendChangingPasswordEmail(String email, String token) {
        kafkaTemplate.send(NOTIFICATION_USER, NotificationUser.builder().email(email).type(NotificationUser.NotificationUserType.FORGOT_PASSWORD).forgotPasswordToken(token).build());
    }

    @Override
    public void sendWelcomeEmail(String email) {
        kafkaTemplate.send(NOTIFICATION_USER, NotificationUser.builder().email(email).type(NotificationUser.NotificationUserType.WELCOME).build());
    }

    @Override
    public void sendPasswordChangedEmail(String email, Instant now) {
        kafkaTemplate.send(NOTIFICATION_USER, NotificationUser.builder().email(email).createdAt(now).type(NotificationUser.NotificationUserType.PASSWORD_CHANGED).build());
    }
}
