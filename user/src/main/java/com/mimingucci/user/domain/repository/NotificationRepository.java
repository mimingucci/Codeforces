package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.chat.Notification;
import java.util.List;

public interface NotificationRepository {
    Notification create(Notification domain);

    List<Notification> findByUserAndIsReadFalse(Long userId);

    Notification update(Long id, Notification domain);

    List<Notification> getAll(Long userId);

    Notification findById(Long id);
}
