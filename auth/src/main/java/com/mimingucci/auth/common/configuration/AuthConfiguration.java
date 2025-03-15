package com.mimingucci.auth.common.configuration;

import com.mimingucci.auth.common.filter.JwtUserChangePasswordRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class AuthConfiguration {

    private final JwtUserChangePasswordRequestFilter userChangePasswordRequestFilter;

    @Bean
    public PasswordEncoder getPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests((requests) -> requests
                        .anyRequest().permitAll() // Allow all requests without authentication
                )
                .csrf().disable(); // Disable CSRF protection (optional, but recommended for APIs)

        http.addFilterAfter(this.userChangePasswordRequestFilter, BasicAuthenticationFilter.class);
        return http.build();
    }
}
