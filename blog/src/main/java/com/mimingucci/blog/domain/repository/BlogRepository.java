package com.mimingucci.blog.domain.repository;

import com.mimingucci.blog.domain.model.Blog;

public interface BlogRepository {
    Blog findById(Long id);

    Blog createBlog(Blog blog);

    Blog updateBlog(Blog blog);

    Boolean deleteBlog(Long id);
}
