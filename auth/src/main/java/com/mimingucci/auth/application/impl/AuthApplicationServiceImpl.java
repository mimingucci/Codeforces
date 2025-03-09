package com.mimingucci.auth.application.impl;

import com.mimingucci.auth.application.AuthApplicationService;
import com.mimingucci.auth.domain.service.AuthService;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthApplicationServiceImpl implements AuthApplicationService {

    private final AuthService authService;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        return this.authService.login(request);
    }
}
