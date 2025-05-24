package com.mimingucci.auth.presentation.api;

import com.mimingucci.auth.presentation.dto.request.*;
import com.mimingucci.auth.presentation.dto.response.BaseResponse;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;

public interface AuthController {
    BaseResponse<UserLoginResponse> login(@RequestBody @Validated UserLoginRequest request);

    BaseResponse<UserRegisterResponse> register(@RequestBody @Validated UserRegisterRequest request);

    BaseResponse<UserForgotPasswordResponse> forgotPassword(@RequestBody @Validated UserForgotPasswordRequest request);

    BaseResponse<?> changePassword(@RequestBody @Validated UserChangePasswordRequest request, HttpServletRequest httpRequest);

    BaseResponse<Boolean> verifyAccount(@RequestBody @Validated UserVerificationRequest request);

    BaseResponse<Boolean> resetPassword(@RequestBody @Validated UserResetPasswordRequest request);
}
