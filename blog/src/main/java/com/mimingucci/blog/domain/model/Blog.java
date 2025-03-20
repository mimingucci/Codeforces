package com.mimingucci.blog.domain.model;

import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class Blog {
    private Long id;

    private String title;

    private String content;

    private List<Integer> tags;

    private Long author;

    private Instant createdAt;

    private Instant updatedAt;
}
