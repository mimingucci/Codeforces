package com.mimingucci.ranking.domain.repository;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;

import java.util.List;

public interface LeaderboardEntryRepository {
    void saveLeaderboardEntriesDuringContest(List<LeaderboardEntry> entries);
}
