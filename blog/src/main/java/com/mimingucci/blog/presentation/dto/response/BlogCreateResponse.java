package com.mimingucci.blog.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogCreateResponse {
    Long id;

    String title;

    String content;

    Long author;

    Instant createdAt;

    Instant updatedAt;
}
