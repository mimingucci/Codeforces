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
    // Find blogs by tag name
    @Query("SELECT DISTINCT b FROM BlogEntity b JOIN b.tags t WHERE LOWER(t.name) = LOWER(:tagName)")
    List<BlogEntity> findByTagName(@Param("tagName") String tagName);

    // Find blogs by multiple tags (AND condition)
    @Query("SELECT b FROM BlogEntity b JOIN b.tags t WHERE LOWER(t.name) IN :tagNames GROUP BY b HAVING COUNT(DISTINCT t) = :tagCount")
    List<BlogEntity> findByAllTagNames(@Param("tagNames") List<String> tagNames, @Param("tagCount") Long tagCount);

    // Find blogs by author with pagination
    Page<BlogEntity> findByAuthorOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    // Search blogs by title or content
    @Query("SELECT b FROM BlogEntity b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.content) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<BlogEntity> searchBlogs(@Param("query") String query, Pageable pageable);

    // Find recent blogs with specific tag
    @Query("SELECT b FROM BlogEntity b JOIN b.tags t WHERE LOWER(t.name) = LOWER(:tagName) AND b.createdAt >= :since ORDER BY b.createdAt DESC")
    List<BlogEntity> findRecentBlogsByTag(@Param("tagName") String tagName, @Param("since") Instant since);

    // Find trending blogs (most tagged)
    @Query("SELECT b FROM BlogEntity b LEFT JOIN b.tags t GROUP BY b ORDER BY COUNT(t) DESC")
    Page<BlogEntity> findTrendingBlogs(Pageable pageable);

    // Count blogs by tag
    @Query("SELECT COUNT(DISTINCT b) FROM BlogEntity b JOIN b.tags t WHERE LOWER(t.name) = LOWER(:tagName)")
    Long countBlogsByTag(@Param("tagName") String tagName);

    // Find newest blogs with pagination
    @Query("SELECT b FROM BlogEntity b ORDER BY b.createdAt DESC")
    Page<BlogEntity> findNewestBlogs(Pageable pageable);

    // Find newest blogs by author
    @Query("SELECT b FROM BlogEntity b WHERE b.author = :authorId ORDER BY b.createdAt DESC")
    Page<BlogEntity> findNewestBlogsByAuthor(@Param("authorId") Long authorId, Pageable pageable);

    // Find newest blogs by tag
    @Query("SELECT DISTINCT b FROM BlogEntity b JOIN b.tags t " +
            "WHERE LOWER(t.name) = LOWER(:tagName) " +
            "ORDER BY b.createdAt DESC")
    Page<BlogEntity> findNewestBlogsByTag(@Param("tagName") String tagName, Pageable pageable);

    // Find newest blogs in date range
    @Query("SELECT b FROM BlogEntity b " +
            "WHERE b.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY b.createdAt DESC")
    Page<BlogEntity> findNewestBlogsInDateRange(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate,
            Pageable pageable);
}
