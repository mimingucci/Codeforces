package com.mimingucci.auth.application;

import com.mimingucci.auth.presentation.dto.request.UserChangePasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthApplicationService {
    UserLoginResponse login(UserLoginRequest request);

    UserRegisterResponse register(UserRegisterRequest request);

    UserForgotPasswordResponse forgotPassword(UserForgotPasswordRequest request);

    void changePassword(UserChangePasswordRequest request, HttpServletRequest httpRequest);
}
