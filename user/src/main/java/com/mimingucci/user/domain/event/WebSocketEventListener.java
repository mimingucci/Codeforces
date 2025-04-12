package com.mimingucci.user.domain.event;

import com.mimingucci.user.common.util.JwtUtil;
import com.mimingucci.user.domain.model.chat.UserStatus;
import com.mimingucci.user.domain.service.chat.UserStatusService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.time.Instant;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {
    private final SimpMessagingTemplate messagingTemplate;

    private UserStatusService userStatusService;

    private final JwtUtil jwtUtil;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        if (userId != null) {

            // Set user status to online
            userStatusService.setUserOnline(userId);

            // Broadcast user online status
            UserStatus status = new UserStatus(userId, UserStatus.Status.ONLINE, null);
            messagingTemplate.convertAndSend("/topic/users.status", status);

            log.info("User Connected: " + userId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        SimpMessageHeaderAccessor headerAccessor = SimpMessageHeaderAccessor.wrap(event.getMessage());

        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");

        if (userId != null) {
            log.info("User Disconnected: " + userId);

            Instant cur = Instant.now();
            // Set user status to offline
            userStatusService.setUserOffline(userId, cur);

            // Broadcast user offline status
            UserStatus status = new UserStatus(userId, UserStatus.Status.OFFLINE, cur);
            messagingTemplate.convertAndSend("/topic/users.status", status);

            log.info("User Disconnected: {}", userId);
        }
    }
}
