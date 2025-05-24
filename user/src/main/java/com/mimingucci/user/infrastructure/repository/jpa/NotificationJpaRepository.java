package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.infrastructure.repository.entity.NotificationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface NotificationJpaRepository extends JpaRepository<NotificationEntity, Long> {
    // Find all notifications for a user
    List<NotificationEntity> findByUser(Long userId);

    // Find all unread notifications for a user
    List<NotificationEntity> findByUserAndIsReadFalse(Long userId);

    // Find notifications with pagination
    Page<NotificationEntity> findByUser(Long userId, Pageable pageable);

    // Count unread notifications for a user
    long countByUserAndIsReadFalse(Long userId);

    // Find notifications by date range
    List<NotificationEntity> findByUserAndCreatedAtBetween(
            Long userId,
            Instant startDate,
            Instant endDate
    );

    // Find latest notifications
    List<NotificationEntity> findByUserOrderByCreatedAtDesc(Long userId);


}
