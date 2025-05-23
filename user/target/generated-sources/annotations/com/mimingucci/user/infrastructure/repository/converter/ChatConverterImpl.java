package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.infrastructure.repository.entity.ChatMessageEntity;
import com.mimingucci.user.infrastructure.repository.entity.ChatRoomEntity;
import com.mimingucci.user.infrastructure.repository.entity.NotificationEntity;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:13:07+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ChatConverterImpl implements ChatConverter {

    @Override
    public ChatMessage toMessageDomain(ChatMessageEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setId( entity.getId() );
        chatMessage.setContent( entity.getContent() );
        chatMessage.setAuthor( entity.getAuthor() );
        chatMessage.setType( entity.getType() );
        chatMessage.setChat( entity.getChat() );
        chatMessage.setCreatedAt( entity.getCreatedAt() );
        chatMessage.setUpdatedAt( entity.getUpdatedAt() );
        Map<Long, ChatMessage.MessageReaction> map = entity.getReactions();
        if ( map != null ) {
            chatMessage.setReactions( new LinkedHashMap<Long, ChatMessage.MessageReaction>( map ) );
        }
        Set<Long> set = entity.getIsRead();
        if ( set != null ) {
            chatMessage.setIsRead( new LinkedHashSet<Long>( set ) );
        }

        return chatMessage;
    }

    @Override
    public ChatMessageEntity toMessageEntity(ChatMessage domain) {
        if ( domain == null ) {
            return null;
        }

        ChatMessageEntity chatMessageEntity = new ChatMessageEntity();

        chatMessageEntity.setId( domain.getId() );
        chatMessageEntity.setContent( domain.getContent() );
        chatMessageEntity.setAuthor( domain.getAuthor() );
        chatMessageEntity.setType( domain.getType() );
        chatMessageEntity.setChat( domain.getChat() );
        chatMessageEntity.setCreatedAt( domain.getCreatedAt() );
        chatMessageEntity.setUpdatedAt( domain.getUpdatedAt() );
        Map<Long, ChatMessage.MessageReaction> map = domain.getReactions();
        if ( map != null ) {
            chatMessageEntity.setReactions( new LinkedHashMap<Long, ChatMessage.MessageReaction>( map ) );
        }
        Set<Long> set = domain.getIsRead();
        if ( set != null ) {
            chatMessageEntity.setIsRead( new LinkedHashSet<Long>( set ) );
        }

        return chatMessageEntity;
    }

    @Override
    public ChatRoom toRoomDomain(ChatRoomEntity entity) {
        if ( entity == null ) {
            return null;
        }

        ChatRoom chatRoom = new ChatRoom();

        if ( entity.getId() != null ) {
            chatRoom.setId( String.valueOf( entity.getId() ) );
        }
        chatRoom.setName( entity.getName() );
        Set<Long> set = entity.getParticipants();
        if ( set != null ) {
            chatRoom.setParticipants( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = entity.getAdmins();
        if ( set1 != null ) {
            chatRoom.setAdmins( new LinkedHashSet<Long>( set1 ) );
        }
        chatRoom.setCreatedAt( entity.getCreatedAt() );
        chatRoom.setUpdatedAt( entity.getUpdatedAt() );
        chatRoom.setGroupChat( entity.isGroupChat() );

        return chatRoom;
    }

    @Override
    public ChatRoomEntity toRoomEntity(ChatRoom domain) {
        if ( domain == null ) {
            return null;
        }

        ChatRoomEntity chatRoomEntity = new ChatRoomEntity();

        if ( domain.getId() != null ) {
            chatRoomEntity.setId( Long.parseLong( domain.getId() ) );
        }
        chatRoomEntity.setName( domain.getName() );
        Set<Long> set = domain.getParticipants();
        if ( set != null ) {
            chatRoomEntity.setParticipants( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = domain.getAdmins();
        if ( set1 != null ) {
            chatRoomEntity.setAdmins( new LinkedHashSet<Long>( set1 ) );
        }
        chatRoomEntity.setCreatedAt( domain.getCreatedAt() );
        chatRoomEntity.setUpdatedAt( domain.getUpdatedAt() );
        chatRoomEntity.setGroupChat( domain.isGroupChat() );

        return chatRoomEntity;
    }

    @Override
    public Notification toNotificationDomain(NotificationEntity entity) {
        if ( entity == null ) {
            return null;
        }

        Notification notification = new Notification();

        notification.setId( entity.getId() );
        notification.setContent( entity.getContent() );
        notification.setRead( entity.isRead() );
        notification.setCreatedAt( entity.getCreatedAt() );

        return notification;
    }

    @Override
    public NotificationEntity toNotificationDomain(Notification domain) {
        if ( domain == null ) {
            return null;
        }

        NotificationEntity notificationEntity = new NotificationEntity();

        notificationEntity.setId( domain.getId() );
        notificationEntity.setContent( domain.getContent() );
        notificationEntity.setRead( domain.isRead() );
        notificationEntity.setCreatedAt( domain.getCreatedAt() );

        return notificationEntity;
    }
}
