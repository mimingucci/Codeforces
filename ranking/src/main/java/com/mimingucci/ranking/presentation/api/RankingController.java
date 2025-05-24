package com.mimingucci.ranking.presentation.api;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface RankingController {
    BaseResponse<List<LeaderboardEntry>> getLeaderboardByContestId(Long contestId);

    BaseResponse<List<LeaderboardEntry>> getVirtualLeaderboardByContestId(Long contestId);

    BaseResponse<VirtualContestMetadata> startVirtualContest(VirtualContestRequest request, String authToken);

    BaseResponse<Boolean> completeContest(Long contestId, String authToken);

    BaseResponse<List<RatingChange>> getHistoryRatingChanges(Long userId);
}
