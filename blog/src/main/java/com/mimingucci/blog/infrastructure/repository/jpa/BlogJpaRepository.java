package com.mimingucci.blog.infrastructure.repository.jpa;

import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface BlogJpaRepository extends JpaRepository<BlogEntity, Long> {

    // Find blogs by author with pagination
    Page<BlogEntity> findByAuthorOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    // Search blogs by title or content
    @Query("SELECT b FROM BlogEntity b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<BlogEntity> searchBlogs(@Param("query") String query, Pageable pageable);

    // Find trending blogs (most tagged)
    @Query("SELECT b FROM BlogEntity b LEFT JOIN b.tags t GROUP BY b ORDER BY COUNT(t) DESC")
    Page<BlogEntity> findTrendingBlogs(Pageable pageable);

    // Find newest blogs with pagination
    @Query("SELECT b FROM BlogEntity b ORDER BY b.createdAt DESC")
    Page<BlogEntity> findNewestBlogs(Pageable pageable);

    // Find newest blogs by author
    @Query("SELECT b FROM BlogEntity b WHERE b.author = :authorId ORDER BY b.createdAt DESC")
    Page<BlogEntity> findNewestBlogsByAuthor(@Param("authorId") Long authorId, Pageable pageable);
}
