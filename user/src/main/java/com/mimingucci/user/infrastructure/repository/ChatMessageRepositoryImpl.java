package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ChatMessageRepositoryImpl implements ChatMessageRepository {
    @Override
    public ChatMessage create(ChatMessage message) {
        return null;
    }

    @Override
    public ChatMessage update(Long id, ChatMessage message, Long userId) {
        return null;
    }

    @Override
    public ChatMessage getById(Long id, Long userId) {
        return null;
    }

    @Override
    public List<ChatMessage> getByRoom(Long id, int limit, Long userId) {
        return List.of();
    }

    @Override
    public ChatMessage delete(Long id, Long userId) {
        return null;
    }
}
