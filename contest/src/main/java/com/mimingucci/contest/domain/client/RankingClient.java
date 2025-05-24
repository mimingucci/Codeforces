package com.mimingucci.contest.domain.client;

import com.mimingucci.contest.common.configuration.FeignConfiguration;
import com.mimingucci.contest.domain.client.request.VirtualContestRequest;
import com.mimingucci.contest.domain.client.response.VirtualContestResponse;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import static com.mimingucci.contest.common.constant.PathConstants.*;

@CircuitBreaker(name = RANKING_SERVICE)
@FeignClient(name = RANKING_SERVICE, path = API_V1_RANKING, configuration = FeignConfiguration.class)
public interface RankingClient {
    @PostMapping(path = VIRTUAL_CONTEST)
    BaseResponse<VirtualContestResponse> startVirtualContest(
            @RequestBody @Validated VirtualContestRequest request);

    @PostMapping(path = CONTEST_ID)
    BaseResponse<Boolean> completeContest(@PathVariable("contestId") Long contestId);
}
