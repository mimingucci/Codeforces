package com.mimingucci.ranking.domain.client;

import com.mimingucci.ranking.common.configuration.FeignConfiguration;
import com.mimingucci.ranking.domain.client.response.ContestResponse;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import static com.mimingucci.ranking.common.constant.PathConstants.*;

@CircuitBreaker(name = CONTEST_SERVICE)
@FeignClient(name = CONTEST_SERVICE, path = API_V1_CONTEST, configuration = FeignConfiguration.class)
public interface ContestClient {
    @GetMapping(path = CONTEST_ID)
    BaseResponse<ContestResponse> getContest(@PathVariable(name = "contestId") Long contestId);
}
