package com.mimingucci.contest.infrastructure.repository;

import com.mimingucci.contest.domain.model.VirtualContest;
import com.mimingucci.contest.domain.repository.VirtualContestRepository;
import com.mimingucci.contest.infrastructure.repository.converter.VirtualContestConverter;
import com.mimingucci.contest.infrastructure.repository.jpa.VirtualContestJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VirtualContestRepositoryImpl implements VirtualContestRepository {
    private final VirtualContestJpaRepository jpaRepository;

    private final VirtualContestConverter converter;

    @Override
    public VirtualContest create(VirtualContest domain) {
        return this.converter.toDomain(this.jpaRepository.save(this.converter.toEntity(domain)));
    }

    @Override
    public VirtualContest getById(Long id) {
        var entity = this.jpaRepository.findById(id);
        return entity.map(this.converter::toDomain).orElse(null);
    }

    @Override
    public VirtualContest getNearestOne(Long user) {
        return this.converter.toDomain(this.jpaRepository.findTopByUserIdOrderByIdDesc(user));
    }
}
