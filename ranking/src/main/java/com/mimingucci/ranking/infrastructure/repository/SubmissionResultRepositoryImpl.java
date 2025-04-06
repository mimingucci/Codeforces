package com.mimingucci.ranking.infrastructure.repository;

import com.mimingucci.ranking.domain.event.SubmissionResultEvent;
import com.mimingucci.ranking.domain.repository.SubmissionResultRepository;
import com.mimingucci.ranking.infrastructure.repository.converter.SubmissionResultConverter;
import com.mimingucci.ranking.infrastructure.repository.jpa.SubmissionResultJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class SubmissionResultRepositoryImpl implements SubmissionResultRepository {
    private final SubmissionResultJpaRepository repository;

    @Override
    public void saveSubmissionResultEventsDuringContest(List<SubmissionResultEvent> events) {
        repository.saveAll(events.stream().map(SubmissionResultConverter.INSTANCE::toEntity).toList());
    }
}
