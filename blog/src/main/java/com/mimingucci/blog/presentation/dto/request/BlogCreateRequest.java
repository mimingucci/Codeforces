package com.mimingucci.blog.presentation.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class BlogCreateRequest {

    private String title;

    private String content;

    private List<Integer> tags;

}
