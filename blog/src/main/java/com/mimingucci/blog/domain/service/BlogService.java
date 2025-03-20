package com.mimingucci.blog.domain.service;

import com.mimingucci.blog.domain.model.Blog;

public interface BlogService {
    Blog createBlog(Blog domain);

    Blog findBlogById(Long id);
}
