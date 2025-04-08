package com.mimingucci.leaderboard.domain.service;

import com.mimingucci.leaderboard.domain.model.LeaderboardUpdate;

public interface LeaderboardService {
    LeaderboardUpdate getLeaderboardByContestId(Long contestId);
}
