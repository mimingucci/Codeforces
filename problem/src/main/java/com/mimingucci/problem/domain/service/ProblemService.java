package com.mimingucci.problem.domain.service;

import com.mimingucci.problem.domain.model.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;

public interface ProblemService {
    Problem createProblem(Problem domain);

    Problem findById(Long id);

    Problem updateProblem(Long id, Problem domain);

    Problem getById(Long id);

    Page<Problem> findAll(Pageable pageable);

    Page<Problem> findAllByRating(Integer rating, Pageable pageable);

    List<Problem> findAllByContest(Long contest);

    void updateProblemStatus(Long contestId, Boolean status);

    Problem findByIdDev(Long problemId, Long userId);

    List<Problem> findAllByContestDev(Long contestId, Long userId);

    String uploadFile(MultipartFile file);
}
