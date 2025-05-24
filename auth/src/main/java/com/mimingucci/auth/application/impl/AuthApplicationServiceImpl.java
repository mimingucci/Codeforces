package com.mimingucci.auth.application.impl;

import com.mimingucci.auth.application.AuthApplicationService;
import com.mimingucci.auth.application.assembler.UserAssembler;
import com.mimingucci.auth.common.util.JwtUtil;
import com.mimingucci.auth.domain.service.AuthService;
import com.mimingucci.auth.presentation.dto.request.*;
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

    private final JwtUtil jwtUtil;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        return this.authService.login(UserAssembler.INSTANCE.loginToDomain(request));
    }

    @Override
    public UserRegisterResponse register(UserRegisterRequest request) {
        return this.authService.register(UserAssembler.INSTANCE.registerToDomain(request));
    }

    @Override
    public UserForgotPasswordResponse forgotPassword(UserForgotPasswordRequest request) {
        return this.authService.forgotPassword(UserAssembler.INSTANCE.forgotToDomain(request));
    }

    @Override
    public void changePassword(UserChangePasswordRequest request, HttpServletRequest httpRequest) {
        String email = (String) httpRequest.getAttribute("email"); // Get email from the request attributes
        request.setEmail(email);
        this.authService.changePassword(UserAssembler.INSTANCE.changePasswordRequestToDomain(request));
    }

    @Override
    public Boolean verify(UserVerificationRequest request) {
        try {
            String email = this.jwtUtil.extractEmail(request.getToken());
            return this.authService.verify(email);
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public Boolean resetPassword(UserResetPasswordRequest request) {
        return this.authService.resetPassword(request.getEmail(), request.getPassword(), request.getToken());
    }
}
