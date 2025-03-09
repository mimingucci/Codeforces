package com.mimingucci.auth.presentation.api.impl;

import com.mimingucci.auth.application.AuthApplicationService;
import com.mimingucci.auth.common.constant.PathConstants;
import com.mimingucci.auth.presentation.api.AuthController;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.response.BaseResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
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
}
