package com.mimingucci.user.presentation.ws;

import com.mimingucci.user.domain.service.chat.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class NotificationWebSocketController {
    private final NotificationService notificationService;

    @MessageMapping("/notifications.read")
    public void markAsRead(Long notificationId, SimpMessageHeaderAccessor headerAccessor) {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        notificationService.markAsRead(notificationId, userId);
    }

    @MessageMapping("/notifications.read-all")
    public void markAllAsRead(SimpMessageHeaderAccessor headerAccessor) {
        Long userId = (Long) headerAccessor.getSessionAttributes().get("userId");
        notificationService.markAllAsRead(userId);
    }
}
