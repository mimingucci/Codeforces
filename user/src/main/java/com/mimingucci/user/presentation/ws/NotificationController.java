package com.mimingucci.user.presentation.ws;

import com.mimingucci.user.common.constant.PathConstants;
import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.domain.service.chat.NotificationService;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = PathConstants.API_V1_USER + "/notification")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService service;

    @GetMapping("/unread/count")
    public BaseResponse<Long> getUnreadCount(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        return BaseResponse.success(
                service.getUnreadCount(userId)
        );
    }

    @GetMapping
    public BaseResponse<List<Notification>> getNotifications(
            HttpServletRequest request,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        Long userId = (Long) request.getAttribute("userId");
        List<Notification> notifications = unreadOnly ?
                service.getUnreadNotifications(userId) :
                service.getAllNotifications(userId);
        return BaseResponse.success(notifications);
    }

    @PostMapping("/{notificationId}/read")
    public BaseResponse<Void> markAsRead(
            HttpServletRequest request,
            @PathVariable Long notificationId) {
        Long userId = (Long) request.getAttribute("userId");
        service.markAsRead(notificationId, userId);
        return BaseResponse.success();
    }

    @PostMapping("/read-all")
    public BaseResponse<Void> markAllAsRead(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        service.markAllAsRead(userId);
        return BaseResponse.success();
    }
}
