package com.mimingucci.blog.domain.repository;

import com.mimingucci.blog.domain.model.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.util.List;

public interface BlogRepository {
    Blog findById(Long id);

    Blog createBlog(Blog blog);

    Blog updateBlog(Blog blog);

    Boolean deleteBlog(Long id, Long author);

    Page<Blog> findByAuthor(Long authorId, Pageable pageable);

    List<Blog> findByTag(String tagName);

    Page<Blog> searchBlogs(String query, Pageable pageable);

    List<Blog> findRecentBlogsByTag(String tagName, Instant since);

    Page<Blog> findTrendingBlogs(Pageable pageable);

    Page<Blog> findAll(Pageable pageable);

    Page<Blog> findAllByUserId(Long userId, Pageable pageable);
}
