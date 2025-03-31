package com.mimingucci.problem.domain.repository;

import com.mimingucci.problem.domain.model.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProblemRepository {
    Problem findById(Long id);

    Problem createProblem(Problem domain);

    Page<Problem> findProblems(Pageable pageable);

    Page<Problem> findProblemsByRating(Integer rating, Pageable pageable);

    Problem updateProblem(Long id, Problem domain);

    List<Problem> findAllProblemsByContest(Long contest);
}
