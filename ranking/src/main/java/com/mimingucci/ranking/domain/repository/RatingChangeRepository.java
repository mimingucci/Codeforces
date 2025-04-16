package com.mimingucci.ranking.domain.repository;

import com.mimingucci.ranking.domain.model.RatingChange;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RatingChangeRepository {
    RatingChange persistOne(RatingChange domain);

    List<RatingChange> persistBatch(List<RatingChange> domains);

    List<RatingChange> getAll(Long contestId);

    Page<RatingChange> getByPage(Long contestId, Pageable pageable);

    RatingChange getById(Long userId, Long contestId);

    List<RatingChange> getByUser(Long userId);

    void deleteById(Long userId, Long contestId);
}
