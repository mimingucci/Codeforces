package com.mimingucci.problem.domain.client;

import com.mimingucci.problem.common.configuration.FeignConfiguration;
import com.mimingucci.problem.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import static com.mimingucci.problem.common.constant.PathConstants.*;

@CircuitBreaker(name = CONTEST_SERVICE)
@FeignClient(name = CONTEST_SERVICE, path = API_V1_CONTEST, configuration = FeignConfiguration.class)
public interface ContestClient {
    @GetMapping(path = CONTEST_ID)
    BaseResponse<?> getContestById(@PathVariable(name = "contestId") Long contestId);
}
