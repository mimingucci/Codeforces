package com.mimingucci.auth.common.filter;

import com.mimingucci.auth.common.constant.PathConstants;
import com.mimingucci.auth.common.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtUserChangePasswordRequestFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        if (request.getRequestURI().startsWith(PathConstants.API_V1_AUTH + PathConstants.CHANGE_PASSWORD)) {
            // Extract the JWT token from the Authorization header
            final String authorizationHeader = request.getHeader("Authorization");

            String email = null;

            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
                email = this.jwtUtil.extractEmail(token); // Extract email from the token
            }

            // Add the email to the request attributes
            request.setAttribute("email", email);
        }

        filterChain.doFilter(request, response);
    }
}
