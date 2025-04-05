package com.mimingucci.user.presentation.api.impl;

import com.mimingucci.user.application.UserApplicationService;
import com.mimingucci.user.common.constant.PathConstants;
import com.mimingucci.user.presentation.api.UserController;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_USER)
public class UserControllerImpl implements UserController {
    private final UserApplicationService userApplicationService;

    @PutMapping(path = PathConstants.UPDATE)
    @Override
    public BaseResponse<UserUpdateResponse> updateProfile(@RequestBody @Validated UserUpdateRequest request) {
        return BaseResponse.success(this.userApplicationService.updateProfile(request));
    }

    @GetMapping(path = PathConstants.USER_ID)
    @Override
    public BaseResponse<UserGetResponse> getUserById(@PathVariable("userId") Long userId) {
        return BaseResponse.success(this.userApplicationService.getUserById(userId));
    }
}
