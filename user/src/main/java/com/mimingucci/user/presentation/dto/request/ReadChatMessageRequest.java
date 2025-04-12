package com.mimingucci.user.presentation.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ReadChatMessageRequest {
    Long chatId;

    Long userId;
}
