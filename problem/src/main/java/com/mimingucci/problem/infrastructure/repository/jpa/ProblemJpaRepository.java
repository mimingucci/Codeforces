package com.mimingucci.problem.infrastructure.repository.jpa;

import com.mimingucci.problem.infrastructure.repository.entity.ProblemEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProblemJpaRepository extends JpaRepository<ProblemEntity, Long> {
    @Query("""
            SELECT problem
            FROM Problem problem
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblems(Pageable pageable);

    @Query("""
            SELECT problem
            FROM Problem problem
            WHERE problem.rating = :rating
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblemsByRating(@Param("rating") Integer rating, Pageable pageable);

    @Query("""
            SELECT problem
            FROM Problem problem
            WHERE problem.author = :author
            ORDER BY problem.createdAt desc
            """)
    Page<ProblemEntity> findProblemsByAuthor(@Param("author") Long author, Pageable pageable);

    @Query("""
        SELECT problem
        FROM Problem problem
        WHERE problem.contest = :contest
        ORDER BY problem.createdAt asc
        """)
    List<ProblemEntity> findAllProblemsByContest(@Param("contest") Long contest);
}
