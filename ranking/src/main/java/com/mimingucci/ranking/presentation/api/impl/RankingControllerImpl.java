package com.mimingucci.ranking.presentation.api.impl;

import com.mimingucci.ranking.application.RankingApplicationService;
import com.mimingucci.ranking.common.constant.PathConstants;
import com.mimingucci.ranking.common.util.SubmissionHistoryFileHandler;
import com.mimingucci.ranking.domain.model.LeaderboardEntry;
import com.mimingucci.ranking.domain.model.RatingChange;
import com.mimingucci.ranking.domain.model.VirtualContestMetadata;
import com.mimingucci.ranking.presentation.api.RankingController;
import com.mimingucci.ranking.presentation.dto.request.VirtualContestRequest;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_RANKING)
public class RankingControllerImpl implements RankingController {
    private final RankingApplicationService service;

    @PostMapping(path = PathConstants.VIRTUAL_CONTEST)
    @Override
    public BaseResponse<VirtualContestMetadata> startVirtualContest(@RequestBody @Validated VirtualContestRequest request,
                                                                    @RequestHeader(value = "Authorization", required = true) String authToken) {
        return BaseResponse.success(service.startVirtual(request, authToken));
    }

    @GetMapping(path = PathConstants.CHANGES + PathConstants.USER_ID)
    @Override
    public BaseResponse<List<RatingChange>> getHistoryRatingChanges(@PathVariable("userId") Long userId) {
        return BaseResponse.success(service.getHistoryRatingChanges(userId));
    }

    @GetMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<List<LeaderboardEntry>> getLeaderboardByContestId(@PathVariable("contestId") Long contestId) {
        return BaseResponse.success(service.getLeaderboard(contestId));
    }

    @PostMapping(path = PathConstants.CONTEST_ID)
    @Override
    public BaseResponse<Boolean> completeContest(@PathVariable("contestId") Long contestId, @RequestHeader(value = "Authorization", required = true) String authToken) {
        return BaseResponse.success(service.completeContest(contestId, authToken));
    }

}
