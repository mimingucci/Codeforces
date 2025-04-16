package com.mimingucci.submission.domain.client;

import com.mimingucci.submission.common.configuration.FeignConfiguration;
import com.mimingucci.submission.domain.client.response.ProblemResponse;
import com.mimingucci.submission.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import static com.mimingucci.submission.common.constant.PathConstants.*;

@CircuitBreaker(name = CONTEST_SERVICE)
@FeignClient(name = CONTEST_SERVICE, path = API_V1_CONTEST, configuration = FeignConfiguration.class)
public interface ProblemClient {
    @GetMapping(path = PROBLEM_ID)
    BaseResponse<ProblemResponse> getProblemById(@PathVariable(name = "problemId") Long problemId);
}
