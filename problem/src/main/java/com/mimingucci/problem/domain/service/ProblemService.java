package com.mimingucci.problem.domain.service;

import com.mimingucci.problem.domain.model.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProblemService {
    Problem createProblem(Problem domain);

    Problem findById(Long id);

    Problem updateProblem(Long id, Problem domain);

    Page<Problem> findAll(Pageable pageable);

    Page<Problem> findAllByRating(Integer rating, Pageable pageable);

    List<Problem> findAllByContest(Long contest);
}
