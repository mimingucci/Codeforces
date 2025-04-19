package com.mimingucci.blog.infrastructure.repository.jpa;

import com.mimingucci.blog.infrastructure.repository.entity.TagEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface TagJpaRepository extends JpaRepository<TagEntity, Integer> {
    // Existing queries
    Optional<TagEntity> findByNameIgnoreCase(String name);

    @Query("SELECT t FROM TagEntity t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<TagEntity> searchTags(@Param("query") String query);

    // New queries
    // Find related tags (tags that appear together often)
    @Query(value = """
            SELECT t2.* FROM tag t1
            JOIN blog_tags bt1 ON t1.id = bt1.tag_id
            JOIN blog_tags bt2 ON bt1.blog_id = bt2.blog_id
            JOIN tag t2 ON bt2.tag_id = t2.id
            WHERE t1.name = :tagName AND t2.name != :tagName
            GROUP BY t2.id
            ORDER BY COUNT(*) DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<TagEntity> findRelatedTags(@Param("tagName") String tagName, @Param("limit") int limit);

    // Find trending tags in recent blogs
    @Query("SELECT t FROM TagEntity t JOIN t.blogs b WHERE b.createdAt >= :since GROUP BY t ORDER BY COUNT(b) DESC")
    List<TagEntity> findTrendingTags(@Param("since") Instant since, Pageable pageable);

    // Find tags used by specific author
    @Query("SELECT DISTINCT t FROM TagEntity t JOIN t.blogs b WHERE b.author = :authorId")
    List<TagEntity> findTagsByAuthor(@Param("authorId") Long authorId);

    // Find tags with usage count
    @Query("SELECT t, COUNT(b) as count FROM TagEntity t LEFT JOIN t.blogs b GROUP BY t")
    Page<Object[]> findTagsWithCount(Pageable pageable);

    // Find unused tags
    @Query("SELECT t FROM TagEntity t WHERE t.blogs IS EMPTY")
    List<TagEntity> findUnusedTags();

    // Find tags used in a date range
    @Query("SELECT DISTINCT t FROM TagEntity t JOIN t.blogs b WHERE b.createdAt BETWEEN :startDate AND :endDate")
    List<TagEntity> findTagsUsedInPeriod(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}
