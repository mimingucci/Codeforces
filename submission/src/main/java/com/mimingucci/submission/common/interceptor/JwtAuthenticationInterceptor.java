package com.mimingucci.submission.common.interceptor;

import com.mimingucci.submission.common.enums.Role;
import com.mimingucci.submission.common.util.JwtUtil;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Skip validation for GET requests
        if (request.getMethod().equals(HttpMethod.GET.name())) {
            return true;
        }

        try {
            // Extract and validate the token
            Claims claims = jwtUtil.extractClaimsFromHttpRequest(request);
            // If validation successful, store claims in request attributes for later use in controllers
            request.setAttribute("userId", claims.get("id", Long.class));
            request.setAttribute("userEmail", claims.getSubject());
            // Get the roles claim as a List
            List<String> roleNames = claims.get("roles", List.class);

            // Convert role names to Role enum values
            request.setAttribute("userRoles", roleNames.stream()
                    .map(Role::valueOf)
                    .collect(Collectors.toSet()));

            return true;
        } catch (Exception e) {
            log.error("JWT Authentication failed: {}", e.getMessage());
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write("Authentication failed: " + e.getMessage());
            return false;
        }
    }
}
