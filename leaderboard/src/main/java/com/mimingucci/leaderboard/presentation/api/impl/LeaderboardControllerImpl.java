package com.mimingucci.leaderboard.presentation.api.impl;

import com.mimingucci.leaderboard.common.constant.PathConstants;
import com.mimingucci.leaderboard.domain.model.LeaderboardUpdate;
import com.mimingucci.leaderboard.domain.service.LeaderboardService;
import com.mimingucci.leaderboard.presentation.api.LeaderboardController;
import com.mimingucci.leaderboard.presentation.dto.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_LEADERBOARD)
public class LeaderboardControllerImpl implements LeaderboardController {
    private final LeaderboardService service;

    @GetMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<LeaderboardUpdate> getLeaderboard(@PathVariable(name = "contestId") Long contestId) {
        return BaseResponse.success(this.service.getLeaderboardByContestId(contestId));
    }
}
