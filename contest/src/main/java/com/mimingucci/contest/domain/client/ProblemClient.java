package com.mimingucci.contest.domain.client;

import com.mimingucci.contest.common.configuration.FeignConfiguration;
import com.mimingucci.contest.domain.client.response.ProblemResponse;
import com.mimingucci.contest.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

import static com.mimingucci.contest.common.constant.PathConstants.*;

@CircuitBreaker(name = PROBLEM_SERVICE)
@FeignClient(name = PROBLEM_SERVICE, path = API_V1_PROBLEM, configuration = FeignConfiguration.class)
public interface ProblemClient {
    @GetMapping(path = CONTEST + CONTEST_ID)
    BaseResponse<List<ProblemResponse>> getAllProblemsByContestId(@PathVariable(name = "contestId") Long contestId);
}
