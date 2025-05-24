package com.mimingucci.problem.infrastructure.repository.jpa;

import com.mimingucci.problem.infrastructure.repository.entity.ProblemEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProblemJpaRepository extends JpaRepository<ProblemEntity, Long> {
    Optional<ProblemEntity> findByIdAndIsPublishedTrue(Long id);

    @Query("""
            SELECT problem
            FROM ProblemEntity problem
            WHERE problem.isPublished = true
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblems(Pageable pageable);

    @Query("""
            SELECT problem
            FROM ProblemEntity problem
            WHERE problem.rating = :rating
            AND problem.isPublished = true
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblemsByRating(@Param("rating") Integer rating, Pageable pageable);

    @Query("""
            SELECT problem
            FROM ProblemEntity problem
            WHERE problem.author = :author
            AND problem.isPublished = true
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblemsByAuthor(@Param("author") Long author, Pageable pageable);

    @Query("""
        SELECT problem
        FROM ProblemEntity problem
        WHERE problem.contest = :contest
        AND problem.isPublished = true
        ORDER BY problem.createdAt asc
        """)
    List<ProblemEntity> findAllProblemsByContest(@Param("contest") Long contest);

    @Query("""
        UPDATE ProblemEntity problem
        SET problem.isPublished = :status
        WHERE problem.contest = :contestId
        """)
    @Modifying
    @Transactional
    Integer updateProblemStatusByContest(@Param("contestId") Long contestId, @Param("status") Boolean status);

    @Query("""
        SELECT problem
        FROM ProblemEntity problem
        WHERE problem.contest = :contest
        ORDER BY problem.createdAt asc
        """)
    List<ProblemEntity> findAllProblemsByContestDev(@Param("contest") Long contest);

    @Query("""
            SELECT problem
            FROM ProblemEntity problem
            WHERE (:title IS NULL OR LOWER(problem.title) LIKE LOWER(CONCAT('%', :title, '%')))
            AND (:rating IS NULL OR problem.rating = :rating)
            AND (:tags IS NULL OR problem.tags IN :tags)
            AND problem.isPublished = true
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblemsWithFilters(
        @Param("title") String title,
        @Param("rating") Integer rating,
        @Param("tags") List<String> tags,
        Pageable pageable
    );
}
