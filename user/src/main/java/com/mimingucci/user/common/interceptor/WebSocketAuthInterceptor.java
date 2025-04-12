package com.mimingucci.user.common.interceptor;

import com.mimingucci.user.common.util.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
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
public class WebSocketAuthInterceptor implements ChannelInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
            // Get JWT from headers
            String token = accessor.getFirstNativeHeader("Authorization");
            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7);

                // Validate JWT and get user info
                Claims claims = this.jwtUtil.extractAllClaims(token);

                Long userId = claims.get("id", Long.class);
                String username = claims.getSubject();
                // Store in session attributes
                accessor.setUser(new Principal() {
                    @Override
                    public String getName() {
                        return String.valueOf(userId);
                    }
                });
                accessor.getSessionAttributes().put("userId", userId);
                accessor.getSessionAttributes().put("username", username);
            }
        }
        return message;
    }
}
