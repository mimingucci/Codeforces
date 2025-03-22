package com.mimingucci.problem.domain.service.impl;

import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.domain.repository.ProblemRepository;
import com.mimingucci.problem.domain.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {
    private final ProblemRepository repository;

    @Override
    public Problem createProblem(Problem domain) {
        return this.repository.createProblem(domain);
    }

    @Override
    public Problem findById(Long id) {
        return this.repository.findById(id);
    }

    @Override
    public Problem updateProblem(Long id, Problem domain) {
        return this.repository.updateProblem(id, domain);
    }

    @Override
    public Page<Problem> findAll(Pageable pageable) {
        return this.repository.findProblems(pageable);
    }

    @Override
    public Page<Problem> findAllByRating(Integer rating, Pageable pageable) {
        return this.repository.findProblemsByRating(rating, pageable);
    }
}
