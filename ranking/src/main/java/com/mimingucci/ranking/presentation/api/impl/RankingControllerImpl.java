package com.mimingucci.ranking.presentation.api.impl;

import com.mimingucci.ranking.application.RankingApplicationService;
import com.mimingucci.ranking.common.constant.PathConstants;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.api.RankingController;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_RANKING)
public class RankingControllerImpl implements RankingController {
    private final RankingApplicationService service;

    @GetMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<List<LeaderboardEntry>> getLeaderboardByContestId(Long contestId) {
        return null;
    }

    @PostMapping
    @Override
    public BaseResponse<VirtualContestMetadata> startVirtualContest(VirtualContestRequest request) {
        return BaseResponse.success(service.startVirtual(request));
    }
}
