package com.mimingucci.testcase.common.configuration;

import com.mimingucci.testcase.common.util.JwtUtil;
import feign.RequestInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class FeignConfiguration {

    private final JwtUtil jwtUtil;

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            template.header("Authorization",  jwtUtil.generateToken());
        };
    }
}