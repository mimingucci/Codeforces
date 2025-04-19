package com.mimingucci.ranking.presentation.api;

import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;

import java.util.List;

public interface RankingController {
    BaseResponse<List<LeaderboardEntry>> getLeaderboardByContestId(Long contestId);

    BaseResponse<VirtualContestMetadata> startVirtualContest(VirtualContestRequest request);

    BaseResponse<Boolean> persistSubmissionHistory(Long contestId);
}
