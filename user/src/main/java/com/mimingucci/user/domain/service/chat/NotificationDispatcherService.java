package com.mimingucci.user.domain.service.chat;

import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.domain.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationDispatcherService {
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationRepository notificationRepository;

    public void dispatchNotification(Notification notification) {
        // 1. Save to database
        notificationRepository.create(notification);

        // 2. Send real-time update if user is online
        String destination = "/user/" + notification.getUserId() + "/queue/notifications";
        messagingTemplate.convertAndSend(destination, notification);
    }
}
