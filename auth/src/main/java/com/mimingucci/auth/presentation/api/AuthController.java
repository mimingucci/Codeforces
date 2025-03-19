package com.mimingucci.auth.presentation.api;

import com.mimingucci.auth.presentation.dto.request.UserChangePasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import com.mimingucci.auth.presentation.dto.response.BaseResponse;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface AuthController {
    @PostMapping
    BaseResponse<UserLoginResponse> login(@RequestBody @Validated UserLoginRequest request);

    @PostMapping
    BaseResponse<UserRegisterResponse> register(@RequestBody @Validated UserRegisterRequest request);

    @PostMapping
    BaseResponse<UserForgotPasswordResponse> forgotPassword(@RequestBody @Validated UserForgotPasswordRequest request);

    @PostMapping
    BaseResponse<?> changePassword(@RequestBody @Validated UserChangePasswordRequest request, HttpServletRequest httpRequest);
}
