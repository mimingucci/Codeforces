package com.mimingucci.submission.infrastructure.repository.jpa;

import com.mimingucci.submission.common.enums.SubmissionVerdict;
import com.mimingucci.submission.infrastructure.repository.entity.SubmissionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface SubmissionJpaRepository extends JpaRepository<SubmissionEntity, Long> {
    /**
     * Find all submissions by a specific author with pagination
     *
     * @param authorId The ID of the author
     * @param pageable The pagination information
     * @return A page of submissions for the given author
     */
    Page<SubmissionEntity> findByAuthor(Long authorId, Pageable pageable);

    /**
     * Find all submissions by a specific author with date range filtering
     *
     * @param authorId The ID of the author
     * @param startDate The start date for filtering
     * @param endDate The end date for filtering
     * @return List of submissions within the date range
     */
    List<SubmissionEntity> findByAuthorAndSentBetween(Long authorId, Instant startDate, Instant endDate);

    /**
     * Find all submissions by a specific author with verdict
     *
     * @param authorId The ID of the author
     * @param verdict The verdict to filter by
     * @return List of submissions with the specified verdict
     */
    List<SubmissionEntity> findByAuthorAndVerdict(Long authorId, SubmissionVerdict verdict);

    /**
     * Find all accepted submissions for a contest in a date range
     *
     * @param contestId The contest ID
     * @param verdict The verdict (should be SubmissionVerdict.ACCEPTED)
     * @param startDate The start date
     * @param endDate The end date
     * @return List of accepted submissions
     */
    List<SubmissionEntity> findByContestAndVerdictAndSentBetween(
            Long contestId,
            SubmissionVerdict verdict,
            Instant startDate,
            Instant endDate
    );
}
