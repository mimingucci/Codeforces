package com.mimingucci.leaderboard.presentation.api;

import com.mimingucci.leaderboard.domain.model.LeaderboardUpdate;
import com.mimingucci.leaderboard.presentation.dto.response.BaseResponse;

public interface LeaderboardController {
    BaseResponse<LeaderboardUpdate> getLeaderboard(Long contestId);
}
