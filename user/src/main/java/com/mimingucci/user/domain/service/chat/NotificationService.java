package com.mimingucci.user.domain.service.chat;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.domain.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public List<Notification> createNotifications(Set<Long> userIds, String content) {
        return userIds.stream()
                .map(userId -> createNotification(userId, content))
                .peek(this::sendRealTimeNotification)
                .collect(Collectors.toList());
    }

    private Notification createNotification(Long userId, String content) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setContent(content);
        notification.setRead(false);
        notification.setCreatedAt(Instant.now());
        return notificationRepository.create(notification);
    }

    private void sendRealTimeNotification(Notification notification) {
        messagingTemplate.convertAndSend(
                "/user/" + notification.getUserId() + "/queue/notifications",
                notification
        );
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserAndIsReadFalse(userId);
    }

    public List<Notification> getAllNotifications(Long userId) {
        return notificationRepository.getAll(userId);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.findByUserAndIsReadFalse(userId).size();
    }

    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId);

        if (!notification.getUserId().equals(userId)) {
            throw new ApiRequestException(
                    ErrorMessageConstants.NOT_PERMISSION,
                    HttpStatus.FORBIDDEN
            );
        }

        notification.setRead(true);
        notificationRepository.update(notificationId, notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> {
            notification.setRead(true);
            notificationRepository.update(notification.getId(), notification);
        });
    }
}