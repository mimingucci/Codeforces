package com.mimingucci.blog.presentation.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class BlogUpdateRequest {
    private Long id;

    private String title;

    private String content;

    private List<String> tags;
}
