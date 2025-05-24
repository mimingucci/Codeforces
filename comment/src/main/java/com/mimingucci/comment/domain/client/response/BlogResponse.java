package com.mimingucci.comment.domain.client.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogResponse {
    Long id;

    String title;

    String content;

    Long author;

    Instant createdAt;

    Instant updatedAt;

    List<String> tags;
}
