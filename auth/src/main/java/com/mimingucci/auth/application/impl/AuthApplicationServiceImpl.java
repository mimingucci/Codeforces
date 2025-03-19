package com.mimingucci.auth.application.impl;

import com.mimingucci.auth.application.AuthApplicationService;
import com.mimingucci.auth.application.assembler.UserAssembler;
import com.mimingucci.auth.domain.service.AuthService;
import com.mimingucci.auth.presentation.dto.request.UserChangePasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthApplicationServiceImpl implements AuthApplicationService {

    private final AuthService authService;

    private final UserAssembler userAssembler;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        return this.authService.login(this.userAssembler.loginToDomain(request));
    }

    @Override
    public UserRegisterResponse register(UserRegisterRequest request) {
        return this.authService.register(this.userAssembler.registerToDomain(request));
    }

    @Override
    public UserForgotPasswordResponse forgotPassword(UserForgotPasswordRequest request) {
        return this.authService.forgotPassword(this.userAssembler.forgotToDomain(request));
    }

    @Override
    public void changePassword(UserChangePasswordRequest request, HttpServletRequest httpRequest) {
        String email = (String) httpRequest.getAttribute("email"); // Get email from the request attributes
        request.setEmail(email);
        this.authService.changePassword(this.userAssembler.changePasswordRequestToDomain(request));
    }
}
