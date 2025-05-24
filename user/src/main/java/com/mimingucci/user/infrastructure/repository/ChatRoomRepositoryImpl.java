package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.common.util.IdGenerator;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.domain.repository.ChatRoomRepository;
import com.mimingucci.user.infrastructure.repository.converter.ChatConverter;
import com.mimingucci.user.infrastructure.repository.entity.ChatRoomEntity;
import com.mimingucci.user.infrastructure.repository.jpa.ChatRoomJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class ChatRoomRepositoryImpl implements ChatRoomRepository {
    private final ChatRoomJpaRepository repository;

    private final ChatConverter chatConverter;

    @Override
    public ChatRoom create(ChatRoom domain) {
        ChatRoomEntity entity = chatConverter.toRoomEntity(domain);
        entity.setId(IdGenerator.INSTANCE.nextId());
        ChatRoomEntity savedEntity = repository.save(entity);
        return chatConverter.toRoomDomain(savedEntity);
    }

    @Override
    public ChatRoom getById(Long id) {
        return repository.findById(id)
                .map(chatConverter::toRoomDomain)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.CHAT_ROOM_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));
    }

    @Override
    public List<ChatRoom> getAllByUserId(Long userId) {
        return repository.findRoomsByParticipantId(userId)
                .stream()
                .map(chatConverter::toRoomDomain)
                .collect(Collectors.toList());
    }

    @Override
    public ChatRoom update(Long id, ChatRoom chatRoom) {
        ChatRoomEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.CHAT_ROOM_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        // Validate if user is admin for group chats
        if (existingEntity.isGroupChat() &&
                !existingEntity.getAdmins().contains(chatRoom.getAdmins().iterator().next())) {
            throw new ApiRequestException(
                    ErrorMessageConstants.USER_NOT_ADMIN,
                    HttpStatus.FORBIDDEN
            );
        }

        // Update fields
        if (chatRoom.getName() != null) existingEntity.setName(chatRoom.getName());
        if (chatRoom.getParticipants() != null) existingEntity.setParticipants(chatRoom.getParticipants());
        if (chatRoom.getAdmins() != null) existingEntity.setAdmins(chatRoom.getAdmins());

        ChatRoomEntity updatedEntity = repository.save(existingEntity);
        return chatConverter.toRoomDomain(updatedEntity);
    }

    @Override
    public void delete(Long id, Long userId) {
        ChatRoomEntity entity = repository.findById(id)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.CHAT_ROOM_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        // Check if user is admin for group chats
        if (entity.isGroupChat() && !entity.getAdmins().contains(userId)) {
            throw new ApiRequestException(
                    ErrorMessageConstants.USER_NOT_ADMIN,
                    HttpStatus.FORBIDDEN
            );
        }

        // For direct chats, check if user is participant
        if (!entity.isGroupChat() && !entity.getParticipants().contains(userId)) {
            throw new ApiRequestException(
                    ErrorMessageConstants.USER_NOT_PARTICIPANT,
                    HttpStatus.FORBIDDEN
            );
        }

        repository.deleteById(id);
    }

    @Override
    public boolean isUserParticipant(Long roomId, Long userId) {
        return repository.findById(roomId)
                .map(room -> room.getParticipants().contains(userId))
                .orElse(false);
    }

    @Override
    public boolean isUserAdmin(Long roomId, Long userId) {
        return repository.findById(roomId)
                .map(room -> room.getAdmins().contains(userId))
                .orElse(false);
    }
}
