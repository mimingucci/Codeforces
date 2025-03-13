package com.mimingucci.api_gateway.filter;

import com.mimingucci.api_gateway.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.function.Predicate;

@Component
public class AuthFilter extends AbstractGatewayFilterFactory<AuthFilter.Config> {
    private final JwtUtil jwtUtil;

    public AuthFilter(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }


    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // Check if the request is to a public endpoint
            if (isSecured.test(request)) {
                if (!request.getHeaders().containsKey("Authorization")) {
                    return onError(exchange, "Authorization header is missing", HttpStatus.UNAUTHORIZED);
                }

                String token = request.getHeaders().getOrEmpty("Authorization").get(0);
                if (token != null && token.startsWith("Bearer ")) {
                    token = token.substring(7);
                } else {
                    return onError(exchange, "Invalid Authorization header", HttpStatus.UNAUTHORIZED);
                }

                // Validate JWT
                try {
                    if (!this.jwtUtil.isValidToken(token)) return onError(exchange, "invalid JWT", HttpStatus.BAD_REQUEST);

                    Claims claims = this.jwtUtil.extractAllClaims(token);
                    // Add claims to the request headers for downstream services
                    exchange.getRequest().mutate()
                            .header("X-User-Email", claims.getSubject())
                            .header("X-User-Roles", claims.get("roles", List.class).toString())
                            .build();
                } catch (Exception e) {
                    return onError(exchange, "Invalid JWT", HttpStatus.UNAUTHORIZED);
                }
            }

            return chain.filter(exchange);
        };
    }

    private Mono<Void> onError(ServerWebExchange exchange, String error, HttpStatus status) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(status);
        return response.setComplete();
    }

    // Define public endpoints that don't require JWT validation
    public static final Predicate<ServerHttpRequest> isSecured = request -> {
        String path = request.getURI().getPath();
        return !path.startsWith("/auth/register") && !path.startsWith("/auth/login");
    };

    public static class Config {
        // Configuration properties (if needed)
    }
}
