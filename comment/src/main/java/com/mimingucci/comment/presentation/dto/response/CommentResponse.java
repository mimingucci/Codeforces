package com.mimingucci.comment.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long id;

    String content;

    Long author;

    Long blog;

    Instant createdAt;

    Instant updatedAt;
}
