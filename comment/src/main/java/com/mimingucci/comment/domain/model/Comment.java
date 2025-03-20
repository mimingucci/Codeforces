package com.mimingucci.comment.domain.model;

import lombok.Data;

import java.time.Instant;

@Data
public class Comment {
    Long id;

    String content;

    Long author;

    Long blog;

    Instant createdAt;

    Instant updatedAt;
}
