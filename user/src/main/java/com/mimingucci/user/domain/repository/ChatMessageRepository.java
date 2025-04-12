package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.chat.ChatMessage;

import java.util.List;

public interface ChatMessageRepository {
    ChatMessage create(ChatMessage message);

    ChatMessage update(Long id, ChatMessage message, Long userId);

    ChatMessage getById(Long id, Long userId);

    List<ChatMessage> getByRoom(Long id, int limit, Long userId);

    ChatMessage delete(Long id, Long userId);
}