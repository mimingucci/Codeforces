package com.mimingucci.blog.domain.service.impl;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.domain.repository.BlogRepository;
import com.mimingucci.blog.domain.service.BlogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlogServiceImpl implements BlogService {
    private final BlogRepository blogRepository;

    @Override
    public Blog createBlog(String email, Blog domain) {
        return null;
    }
}
