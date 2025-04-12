package com.mimingucci.user.presentation.ws;

import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.domain.repository.NotificationRepository;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationRepository notificationRepository;

    @GetMapping("/unread/count")
    public BaseResponse<Long> getUnreadCount(@AuthenticationPrincipal UserDetails user) {
        return BaseResponse.success(
                notificationRepository.countByUserAndIsReadFalse(Long.valueOf(user.getUsername()))
        );
    }

    @GetMapping
    public BaseResponse<List<Notification>> getNotifications(
            @AuthenticationPrincipal UserDetails user,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        if (unreadOnly) {
            return ResponseEntity.ok(
                    notificationRepository.findByUserAndIsReadFalse(Long.valueOf(user.getUsername()))
            );
        }
        return ResponseEntity.ok(
                notificationRepository.getAll(Long.valueOf(user.getUsername()))
        );
    }
}
