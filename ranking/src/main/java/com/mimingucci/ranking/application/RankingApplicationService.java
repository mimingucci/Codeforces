package com.mimingucci.ranking.application;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;

import java.util.List;

public interface RankingApplicationService {
    List<LeaderboardEntry> getLeaderboard(Long contestId);

    VirtualContestMetadata startVirtual(VirtualContestRequest request);
}
