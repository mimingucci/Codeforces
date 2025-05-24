package com.mimingucci.auth.application;

import com.mimingucci.auth.presentation.dto.request.*;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.servlet.http.HttpServletRequest;

public interface AuthApplicationService {
    UserLoginResponse login(UserLoginRequest request);

    UserRegisterResponse register(UserRegisterRequest request);

    UserForgotPasswordResponse forgotPassword(UserForgotPasswordRequest request);

    void changePassword(UserChangePasswordRequest request, HttpServletRequest httpRequest);

    Boolean verify(UserVerificationRequest request);

    Boolean resetPassword(UserResetPasswordRequest request);
}
