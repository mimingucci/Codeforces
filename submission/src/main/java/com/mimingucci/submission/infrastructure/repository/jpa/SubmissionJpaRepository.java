package com.mimingucci.submission.infrastructure.repository.jpa;

import com.mimingucci.submission.infrastructure.repository.entity.SubmissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmissionJpaRepository extends JpaRepository<SubmissionEntity, Long> {
    /**
     * Find all submissions by a specific author with pagination
     *
     * @param authorId The ID of the author
     * @param pageable The pagination information
     * @return A page of submissions for the given author
     */
    Page<SubmissionEntity> findByAuthor(Long authorId, Pageable pageable);

}
