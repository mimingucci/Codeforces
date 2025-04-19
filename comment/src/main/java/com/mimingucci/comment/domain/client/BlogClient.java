package com.mimingucci.comment.domain.client;

import com.mimingucci.comment.common.configuration.FeignConfiguration;
import com.mimingucci.comment.domain.client.response.BlogResponse;
import com.mimingucci.comment.presentation.dto.response.BaseResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import static com.mimingucci.comment.common.constant.PathConstants.*;


@CircuitBreaker(name = BLOG_SERVICE)
@FeignClient(name = BLOG_SERVICE, path = API_V1_BLOG, configuration = FeignConfiguration.class)
public interface BlogClient {
    @GetMapping(path = BLOG_ID)
    BaseResponse<BlogResponse> getBlogById(@PathVariable("blogId") Long id);
}
