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

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class ProblemRepositoryImpl implements ProblemRepository {
    private final ProblemJpaRepository jpaRepository;

    private final ProblemConverter converter;

    @Override
    public Problem findById(Long id) {
        Optional<ProblemEntity> optional = this.jpaRepository.findById(id);
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.PROBLEM_NOT_FOUND, HttpStatus.NOT_FOUND);
        return this.converter.toDomain(optional.get());
    }

    @Override
    public Problem createProblem(Problem domain) {
        domain.setId(IdGenerator.INSTANCE.nextId());
        return this.converter.toDomain(this.jpaRepository.save(this.converter.toEntity(domain)));
    }

    @Override
    public Page<Problem> findProblems(Pageable pageable) {
        Page<ProblemEntity> entities = this.jpaRepository.findProblems(pageable);
        return entities.map(this.converter::toDomain);
    }

    @Override
    public Page<Problem> findProblemsByRating(Integer rating, Pageable pageable) {
        Page<ProblemEntity> entities = this.jpaRepository.findProblemsByRating(rating, pageable);
        return entities.map(this.converter::toDomain);
    }
}
