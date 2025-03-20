package com.mimingucci.blog.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogGetResponse {
    Long id;

    String title;

    String content;

    Long author;

    Instant createdAt;

    Instant updatedAt;
}
