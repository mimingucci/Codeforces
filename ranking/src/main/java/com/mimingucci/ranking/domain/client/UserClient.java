package com.mimingucci.ranking.domain.client;

import com.mimingucci.ranking.common.configuration.FeignConfiguration;
import com.mimingucci.ranking.domain.client.response.UserResponse;
import com.mimingucci.ranking.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.data.util.Pair;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.mimingucci.ranking.common.constant.PathConstants.*;

@CircuitBreaker(name = USER_SERVICE)
@FeignClient(name = USER_SERVICE, path = API_V1_USER, configuration = FeignConfiguration.class)
public interface UserClient {
    @GetMapping(path = USER_ID)
    BaseResponse<UserResponse> getUserById(@PathVariable("userId") Long userId);

    @PutMapping(path = RATING)
    BaseResponse<Boolean> updateUserRatings(@RequestBody @Validated List<Pair<Long, Integer>> users);
}
