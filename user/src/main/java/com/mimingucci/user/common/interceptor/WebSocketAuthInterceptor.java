package com.mimingucci.user.common.interceptor;

import com.mimingucci.user.common.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.security.Principal;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            try {
                // Get JWT from headers
                String token = accessor.getFirstNativeHeader("Authorization");
                log.debug("WebSocket connection attempt with token: {}", token != null ? "present" : "missing");

                if (token != null && token.startsWith("Bearer ")) {
                    token = token.substring(7);

                    // Validate JWT and get user info
                    Claims claims = this.jwtUtil.extractAllClaims(token);

                    Long userId = claims.get("id", Long.class);
                    String userEmail = claims.getSubject();
                    log.info("WebSocket authenticated user: {} ({})", userEmail, userId);

                    accessor.getSessionAttributes().put("userId", userId);
                    accessor.getSessionAttributes().put("userEmail", userEmail);
                } else {
                    log.warn("WebSocket connection attempt with invalid token format");
                }
            } catch (Exception e) {
                log.error("Error authenticating WebSocket connection", e);
                // Don't throw exception, just log it - unauthorized users won't be able to subscribe to protected topics
            }
        }
        return message;
    }
}
