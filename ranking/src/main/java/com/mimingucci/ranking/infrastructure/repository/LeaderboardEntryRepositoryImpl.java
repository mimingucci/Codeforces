package com.mimingucci.ranking.infrastructure.repository;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.repository.LeaderboardEntryRepository;
import com.mimingucci.ranking.infrastructure.repository.converter.LeaderboardEntryConverter;
import com.mimingucci.ranking.infrastructure.repository.jpa.LeaderboardEntryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class LeaderboardEntryRepositoryImpl implements LeaderboardEntryRepository {
    private final LeaderboardEntryJpaRepository repository;

    @Override
    public void saveLeaderboardEntriesDuringContest(List<LeaderboardEntry> entries) {
        repository.saveAll(entries.stream().map(LeaderboardEntryConverter.INSTANCE::toEntity).toList());
    }

    @Override
    public List<LeaderboardEntry> getAllEntriesByContestId(Long id) {
        return repository.findAllByContestIdOrderByRank(id).stream().map(LeaderboardEntryConverter.INSTANCE::toDomain).toList();
    }
}
