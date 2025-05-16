package com.mimingucci.ranking.application;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface RankingApplicationService {
    List<LeaderboardEntry> getLeaderboard(Long contestId);

    VirtualContestMetadata startVirtual(VirtualContestRequest request, String token);

    Boolean completeContest(Long contestId, String token);

    List<RatingChange> getHistoryRatingChanges(Long userId);
}
