package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.infrastructure.repository.entity.ChatMessageEntity;
import com.mimingucci.user.infrastructure.repository.entity.ChatRoomEntity;
import com.mimingucci.user.infrastructure.repository.entity.NotificationEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface ChatConverter {
    ChatConverter INSTANCE = Mappers.getMapper(ChatConverter.class);

    ChatMessage toMessageDomain(ChatMessageEntity entity);

    ChatMessageEntity toMessageEntity(ChatMessage domain);

    ChatRoom toRoomDomain(ChatRoomEntity entity);

    ChatRoomEntity toRoomEntity(ChatRoom domain);

    Notification toNotificationDomain(NotificationEntity entity);

    NotificationEntity toNotificationDomain(Notification domain);
}
