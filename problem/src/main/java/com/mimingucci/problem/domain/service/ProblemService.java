package com.mimingucci.problem.domain.service;

import com.mimingucci.problem.domain.model.Problem;

public interface ProblemService {
    Problem createProblem(Problem domain);

    Problem findById(Long id);

    Problem updateProblem(Long id, Problem domain);


}
