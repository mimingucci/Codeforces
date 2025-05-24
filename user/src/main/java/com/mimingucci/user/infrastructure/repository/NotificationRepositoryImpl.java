package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.domain.repository.NotificationRepository;
import com.mimingucci.user.infrastructure.repository.converter.ChatConverter;
import com.mimingucci.user.infrastructure.repository.entity.NotificationEntity;
import com.mimingucci.user.infrastructure.repository.jpa.NotificationJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class NotificationRepositoryImpl implements NotificationRepository {
    private final NotificationJpaRepository repository;

    private final ChatConverter chatConverter;

    @Override
    public Notification create(Notification domain) {
        NotificationEntity entity = chatConverter.toNotificationDomain(domain);
        NotificationEntity savedEntity = repository.save(entity);
        return chatConverter.toNotificationDomain(savedEntity);
    }

    @Override
    public List<Notification> findByUserAndIsReadFalse(Long userId) {
        return repository.findByUserAndIsReadFalse(userId)
                .stream()
                .map(chatConverter::toNotificationDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Notification update(Long id, Notification domain) {
        NotificationEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.NOTIFICATION_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        // Update fields
        if (domain.getContent() != null) existingEntity.setContent(domain.getContent());
        if (domain.isRead()) existingEntity.setRead(true);

        NotificationEntity updatedEntity = repository.save(existingEntity);
        return chatConverter.toNotificationDomain(updatedEntity);

    }

    @Override
    public List<Notification> getAll(Long userId) {
        return repository.findByUser(userId)
                .stream()
                .map(chatConverter::toNotificationDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Notification findById(Long id) {
        NotificationEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.NOTIFICATION_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));
        return chatConverter.toNotificationDomain(existingEntity);
    }
}
