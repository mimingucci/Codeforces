package com.mimingucci.submission.domain.client;

import com.mimingucci.submission.common.configuration.FeignConfiguration;
import com.mimingucci.submission.common.constant.PathConstants;
import com.mimingucci.submission.domain.client.response.ContestantCheckResponse;
import com.mimingucci.submission.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import static com.mimingucci.submission.common.constant.PathConstants.*;

@CircuitBreaker(name = CONTEST_SERVICE)
@FeignClient(name = CONTEST_SERVICE, path = API_V1_CONTEST, configuration = FeignConfiguration.class)
public interface ContestClient {
    @GetMapping(path = CONTEST_ID + CHECK)
    BaseResponse<Boolean> getContestById(@RequestParam(required = true, name = "userId") Long userId, @PathVariable(name = "contestId") Long contestId);

    @GetMapping(path = PathConstants.CONTEST_ID + PathConstants.REGISTRATION + PathConstants.USER_ID)
    BaseResponse<ContestantCheckResponse> checkRegistration(@PathVariable(name = "contestId") Long contestId, @PathVariable(name = "userId") Long userId);
}