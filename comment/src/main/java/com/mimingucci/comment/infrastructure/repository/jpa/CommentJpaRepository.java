package com.mimingucci.comment.infrastructure.repository.jpa;

import com.mimingucci.comment.infrastructure.repository.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentJpaRepository extends JpaRepository<CommentEntity, Long> {
    @Query("""
            SELECT comment 
            FROM Comment comment
            WHERE comment.blog = :blogId
            """)
    List<CommentEntity> findAllByBlogId(@Param("blogId") Long blogId);

    @Query("""
            SELECT comment 
            FROM Comment comment
            WHERE comment.author = :userId
            """)
    List<CommentEntity> findAllByUserId(@Param("userId") Long userId);
}
