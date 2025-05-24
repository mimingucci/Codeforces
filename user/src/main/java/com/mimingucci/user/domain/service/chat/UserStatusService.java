package com.mimingucci.user.domain.service.chat;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.model.chat.UserStatus;
import com.mimingucci.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class UserStatusService {
    private final UserRepository userRepository;

    public void setUserOffline(Long userId, Instant now) {
        User user = userRepository.findById(userId);
        user.setStatus(UserStatus.Status.OFFLINE);
        user.setLastActive(now);
        userRepository.update(user);
    }

    public void setUserOnline(Long userId) {
        User user = userRepository.findById(userId);
        user.setStatus(UserStatus.Status.ONLINE);
        user.setLastActive(Instant.now());
        userRepository.update(user);
    }
}
