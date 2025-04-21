package com.mimingucci.blog.domain.model;

import lombok.Data;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
public class Blog {
    private Long id;

    private String title;

    private String content;

    private List<String> tags;

    private Long author;

    private Set<Long> likes = new HashSet<>();

    private Set<Long> dislikes = new HashSet<>();

    private Instant createdAt;

    private Instant updatedAt;
}
