package com.mimingucci.submission.infrastructure.repository;

import com.mimingucci.submission.common.enums.SubmissionLanguage;
import com.mimingucci.submission.domain.model.MossDetection;
import com.mimingucci.submission.domain.repository.MossDetectionRepository;
import com.mimingucci.submission.infrastructure.repository.converter.MossDetectionConverter;
import com.mimingucci.submission.infrastructure.repository.entity.MossDetectionEntity;
import com.mimingucci.submission.infrastructure.repository.jpa.MossDetectionJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MossDetectionRepositoryImpl implements MossDetectionRepository {

    private final MossDetectionJpaRepository mossDetectionJpaRepository;

    private final MossDetectionConverter converter;

    @Override
    public MossDetection save(MossDetection domain) {
        return this.converter.toDomain(mossDetectionJpaRepository.save(converter.toEntity(domain)));
    }

    @Override
    public List<MossDetection> getAllByContest(Long contestId) {
        return mossDetectionJpaRepository.findAllByContestIdAndStatus(contestId, "COMPLETED").stream().map(converter::toDomain).toList();
    }

    @Override
    public MossDetection getByContestAndLanguage(Long contestId, SubmissionLanguage language) {
        Optional<MossDetectionEntity> optional = mossDetectionJpaRepository.findByContestIdAndLanguageAndStatus(contestId, language, "COMPLETED");
        return optional.map(converter::toDomain).orElse(null);
    }

    @Override
    public Optional<MossDetection> findById(Long id) {
        Optional<MossDetectionEntity> optional = mossDetectionJpaRepository.findById(id);
        return optional.map(converter::toDomain);
    }
}
