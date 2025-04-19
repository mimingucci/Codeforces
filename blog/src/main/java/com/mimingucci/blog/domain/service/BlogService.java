package com.mimingucci.blog.domain.service;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.presentation.dto.response.BlogGetResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlogService {
    Blog createBlog(Blog domain);

    Blog findBlogById(Long id);

    List<Blog> findByTag(String tagName);

    Boolean deleteById(Long id, Long author);

    Page<Blog> getAll(Pageable pageable);

    Page<Blog> getAllByUserId(Long userId, Pageable pageable);

    Blog updateById(Blog blog);
}
