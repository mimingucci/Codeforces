package com.mimingucci.contest.common.configuration;

import com.mimingucci.contest.common.interceptor.JwtAuthenticationInterceptor;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebMvcConfig implements WebMvcConfigurer {

    private final JwtAuthenticationInterceptor jwtAuthenticationInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // Apply the interceptor to all paths except those we want to exclude
        registry.addInterceptor(jwtAuthenticationInterceptor)
                .addPathPatterns("/**")
                .excludePathPatterns(
                    "/api/auth/**",       // Authentication endpoints
                    "/swagger-ui/**",     // Swagger UI
                    "/v3/api-docs/**",    // OpenAPI docs
                    "/error"              // Error pages
                );
    }
}