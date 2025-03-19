package com.mimingucci.blog.domain.model;

import lombok.Data;

@Data
public class Blog {
    private Long id;

    private String title;

    private String content;
}
