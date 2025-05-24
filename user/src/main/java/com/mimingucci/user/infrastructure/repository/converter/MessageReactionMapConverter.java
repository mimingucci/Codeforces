package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

import java.util.*;
import java.util.stream.Collectors;

@Converter(autoApply = true)
public class MessageReactionMapConverter implements AttributeConverter<Map<Long, ChatMessage.MessageReaction>, String> {

    private static final String ENTRY_DELIMITER = ";";
    private static final String KV_DELIMITER = ":";
    private static final String EMPTY_STRING = "";

    @Override
    public String convertToDatabaseColumn(Map<Long, ChatMessage.MessageReaction> reactionMap) {
        if (reactionMap == null || reactionMap.isEmpty()) {
            return EMPTY_STRING;
        }

        return reactionMap.entrySet().stream()
                .map(entry -> entry.getKey() + KV_DELIMITER + entry.getValue().name())
                .sorted() // Optional: keep consistent ordering
                .collect(Collectors.joining(ENTRY_DELIMITER));
    }

    @Override
    public Map<Long, ChatMessage.MessageReaction> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.trim().isEmpty()) {
            return new HashMap<>();
        }

        return Arrays.stream(dbData.split(ENTRY_DELIMITER))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(entry -> entry.split(KV_DELIMITER))
                .filter(parts -> parts.length == 2)
                .collect(Collectors.toMap(
                        parts -> Long.valueOf(parts[0]),
                        parts -> ChatMessage.MessageReaction.valueOf(parts[1]),
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
    }
}