package com.mimingucci.testcase.domain.client;

import com.mimingucci.testcase.common.configuration.FeignConfiguration;
import com.mimingucci.testcase.presentation.dto.response.BaseResponse;
import com.mimingucci.testcase.presentation.dto.response.ProblemResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import static com.mimingucci.testcase.common.constant.PathConstants.*;

@CircuitBreaker(name = PROBLEM_SERVICE)
@FeignClient(name = PROBLEM_SERVICE, path = API_V1_PROBLEM, configuration = FeignConfiguration.class)
public interface ProblemClient {
    @GetMapping(path = PROBLEM_ID)
    BaseResponse<ProblemResponse> getProblemById(@PathVariable(name = "problemId") Long problemId);
}
