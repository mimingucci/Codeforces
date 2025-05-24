package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.common.util.IdGenerator;
import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.repository.ChatMessageRepository;
import com.mimingucci.user.infrastructure.repository.converter.ChatConverter;
import com.mimingucci.user.infrastructure.repository.entity.ChatMessageEntity;
import com.mimingucci.user.infrastructure.repository.jpa.ChatMessageJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ChatMessageRepositoryImpl implements ChatMessageRepository {
    private final ChatConverter converter;

    private final ChatMessageJpaRepository repository;

    @Override
    public ChatMessage create(ChatMessage message) {
        ChatMessageEntity entity = this.converter.toMessageEntity(message);
        entity.setId(IdGenerator.INSTANCE.nextId());
        return converter.toMessageDomain(repository.save(entity));
    }

    @Override
    public ChatMessage update(Long id, ChatMessage message, Long userId) {
        Optional<ChatMessageEntity> entity = this.repository.findById(id);
        if (entity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CHAT_MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
        ChatMessageEntity message1 = entity.get();
        if (!message1.getAuthor().equals(userId)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_GATEWAY);
        if (message.getContent().equals(message1.getContent())) return converter.toMessageDomain(message1);
        message1.setContent(message.getContent());
        return converter.toMessageDomain(this.repository.save(message1));
    }

    @Override
    public ChatMessage getById(Long id, Long userId) {
        return null;
    }

    @Override
    public List<ChatMessage> getByRoom(Long id, int limit) {
        return this.repository.findLatestMessages(id, limit).stream().map(converter::toMessageDomain).toList();
    }

    @Override
    public Page<ChatMessage> getMessages(Long id, Pageable pageable) {
        return this.repository.findPageMessages(id, pageable).map(converter::toMessageDomain);
    }

    @Override
    public Boolean delete(Long id, Long userId) {
        Optional<ChatMessageEntity> entity = this.repository.findById(id);
        if (entity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.CHAT_MESSAGE_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (!entity.get().getAuthor().equals(userId)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_GATEWAY);
        this.repository.deleteById(id);
        return true;
    }
}
