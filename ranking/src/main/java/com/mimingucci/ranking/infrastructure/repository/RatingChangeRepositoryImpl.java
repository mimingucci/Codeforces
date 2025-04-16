package com.mimingucci.ranking.infrastructure.repository;

import com.mimingucci.ranking.common.exception.ApiRequestException;
import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.domain.repository.RatingChangeRepository;
import com.mimingucci.ranking.infrastructure.repository.converter.RatingChangeConverter;
import com.mimingucci.ranking.infrastructure.repository.entity.RatingChangeEntity;
import com.mimingucci.ranking.infrastructure.repository.entity.RatingChangeId;
import com.mimingucci.ranking.infrastructure.repository.jpa.RatingChangeJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class RatingChangeRepositoryImpl implements RatingChangeRepository {
    private final RatingChangeJpaRepository ratingChangeJpaRepository;

    private final RatingChangeConverter converter;

    @Override
    public RatingChange persistOne(RatingChange domain) {
        RatingChangeEntity entity = converter.toEntity(domain);
        RatingChangeEntity savedEntity = ratingChangeJpaRepository.save(entity);
        return converter.toDomain(savedEntity);
    }

    @Override
    public List<RatingChange> persistBatch(List<RatingChange> domains) {
        List<RatingChangeEntity> entities = domains.stream()
                .map(converter::toEntity)
                .collect(Collectors.toList());
        List<RatingChangeEntity> savedEntities = ratingChangeJpaRepository.saveAll(entities);
        return savedEntities.stream()
                .map(converter::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<RatingChange> getAll(Long contestId) {
        List<RatingChangeEntity> entities = ratingChangeJpaRepository.findByContestOrderByRankAsc(contestId);
        return entities.stream()
                .map(converter::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Page<RatingChange> getByPage(Long contestId, Pageable pageable) {
        Page<RatingChangeEntity> entityPage = ratingChangeJpaRepository.findAll(pageable);
        return entityPage.map(converter::toDomain);
    }

    @Override
    public RatingChange getById(Long userId, Long contestId) {
        RatingChangeId id = new RatingChangeId(userId, contestId);
        RatingChangeEntity entity = ratingChangeJpaRepository.findById(id)
                .orElseThrow(() -> new ApiRequestException("Rating change not found", HttpStatus.NOT_FOUND));
        return converter.toDomain(entity);
    }

    @Override
    public List<RatingChange> getByUser(Long userId) {
        List<RatingChangeEntity> entities = ratingChangeJpaRepository.findByUserOrderByContestDesc(userId);
        return entities.stream()
                .map(converter::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Long userId, Long contestId) {
        RatingChangeId id = new RatingChangeId(userId, contestId);
        ratingChangeJpaRepository.deleteById(id);
    }
}
