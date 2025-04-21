package com.mimingucci.comment.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long id;

    String content;

    Long author;

    Long blog;

    Instant createdAt;

    Instant updatedAt;

    Set<Long> likes;

    Set<Long> dislikes;
}
