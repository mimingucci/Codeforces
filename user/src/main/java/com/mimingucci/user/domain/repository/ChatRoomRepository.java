package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.chat.ChatRoom;

import java.util.List;

public interface ChatRoomRepository {
    ChatRoom create(ChatRoom domain);

    ChatRoom getById(Long id);

    List<ChatRoom> getAllByUserId(Long userId);

    ChatRoom update(Long id, ChatRoom chatRoom);

    void delete(Long id, Long userId);

    boolean isUserParticipant(Long roomId, Long userId);

    boolean isUserAdmin(Long roomId, Long userId);
}
