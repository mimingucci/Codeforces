package com.mimingucci.user.presentation.dto.request;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MessageReactionRequest {
    Long chatId;

    Long userId;

    ChatMessage.MessageReaction reaction;
}
