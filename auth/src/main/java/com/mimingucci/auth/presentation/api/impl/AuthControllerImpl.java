package com.mimingucci.auth.presentation.api.impl;

import com.mimingucci.auth.application.AuthApplicationService;
import com.mimingucci.auth.common.constant.PathConstants;
import com.mimingucci.auth.presentation.api.AuthController;
import com.mimingucci.auth.presentation.dto.request.UserChangePasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import com.mimingucci.auth.presentation.dto.response.BaseResponse;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_AUTH)
public class AuthControllerImpl implements AuthController {

    private final AuthApplicationService authApplicationService;

    @PostMapping(path = PathConstants.LOGIN)
    @Override
    public BaseResponse<UserLoginResponse> login(UserLoginRequest request) {
        return BaseResponse.success(this.authApplicationService.login(request));
    }

    @PostMapping(path = PathConstants.REGISTRATION)
    @Override
    public BaseResponse<UserRegisterResponse> register(UserRegisterRequest request) {
        return BaseResponse.success(this.authApplicationService.register(request));
    }

    @PostMapping(path = PathConstants.FORGOT)
    @Override
    public BaseResponse<UserForgotPasswordResponse> forgotPassword(UserForgotPasswordRequest request) {
        return BaseResponse.success(this.authApplicationService.forgotPassword(request));
    }

    @PostMapping(path = PathConstants.CHANGE_PASSWORD)
    @Override
    public BaseResponse<?> changePassword(UserChangePasswordRequest request, HttpServletRequest httpRequest) {
        this.authApplicationService.changePassword(request, httpRequest);
        return BaseResponse.success();
    }
}
