package com.mimingucci.problem.infrastructure.repository;

import com.mimingucci.problem.common.constant.ErrorMessageConstants;
import com.mimingucci.problem.common.exception.ApiRequestException;
import com.mimingucci.problem.domain.model.Problem;
import com.mimingucci.problem.domain.repository.ProblemRepository;
import com.mimingucci.problem.infrastructure.repository.converter.ProblemConverter;
import com.mimingucci.problem.infrastructure.repository.entity.ProblemEntity;
import com.mimingucci.problem.infrastructure.repository.jpa.ProblemJpaRepository;
import com.mimingucci.problem.infrastructure.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProblemRepositoryImpl implements ProblemRepository {
    private final ProblemJpaRepository jpaRepository;

    @Override
    public Problem findById(Long id) {
        Optional<ProblemEntity> optional = this.jpaRepository.findByIdAndIsPublishedTrue(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        return ProblemConverter.INSTANCE.toDomain(optional.get());
    }

    @Override
    public Problem findByIdDev(Long id) {
        Optional<ProblemEntity> optional = this.jpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        return ProblemConverter.INSTANCE.toDomain(optional.get());
    }

    @Override
    public Problem createProblem(Problem domain) {
        domain.setId(IdGenerator.INSTANCE.nextId());
        return ProblemConverter.INSTANCE.toDomain(this.jpaRepository.save(ProblemConverter.INSTANCE.toEntity(domain)));
    }

    @Override
    public Page<Problem> findProblems(Pageable pageable) {
        Page<ProblemEntity> entities = this.jpaRepository.findProblems(pageable);
        return entities.map(ProblemConverter.INSTANCE::toDomain);
    }

    @Override
    public Page<Problem> findProblemsByRating(Integer rating, Pageable pageable) {
        Page<ProblemEntity> entities = this.jpaRepository.findProblemsByRating(rating, pageable);
        return entities.map(ProblemConverter.INSTANCE::toDomain);
    }

    @Override
    public Problem updateProblem(Long id, Problem domain) {
        Optional<ProblemEntity> optional = this.jpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        ProblemEntity entity = optional.get();
        if (!entity.getAuthor().equals(domain.getAuthor())) throw new ApiRequestException(ErrorMessageConstants.NOT_HAVE_PERMISSION, HttpStatus.BAD_REQUEST);
        if (domain.getScore() != null) entity.setScore(domain.getScore());
        if (domain.getSolution() != null) entity.setSolution(domain.getSolution());
        if (domain.getRating() != null) entity.setRating(domain.getRating());
        if (domain.getStatement() != null) entity.setStatement(domain.getStatement());
        if (domain.getTags() != null) entity.setTags(domain.getTags());
        if (domain.getTitle() != null) entity.setTitle(domain.getTitle());
        if (domain.getMemoryLimit() != null) entity.setMemoryLimit(domain.getMemoryLimit());
        if (domain.getTimeLimit() != null) entity.setTimeLimit(domain.getTimeLimit());
        return ProblemConverter.INSTANCE.toDomain(this.jpaRepository.save(entity));
    }

    @Override
    public List<Problem> findAllProblemsByContest(Long contest) {
        return this.jpaRepository.findAllProblemsByContest(contest).stream().map(ProblemConverter.INSTANCE::toDomain).toList();
    }

    @Override
    public void updateProblemStatus(Long contestId, Boolean status) {
        this.jpaRepository.updateProblemStatusByContest(contestId, status);
    }

    @Override
    public List<Problem> findAllProblemsByContestDev(Long contestId) {
        return this.jpaRepository.findAllProblemsByContestDev(contestId).stream().map(ProblemConverter.INSTANCE::toDomain).toList();
    }
}
