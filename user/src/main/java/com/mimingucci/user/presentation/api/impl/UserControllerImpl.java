package com.mimingucci.user.presentation.api.impl;

import com.mimingucci.user.application.UserApplicationService;
import com.mimingucci.user.common.constant.PathConstants;
import com.mimingucci.user.presentation.api.UserController;
import com.mimingucci.user.presentation.dto.request.UserParam;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_USER)
public class UserControllerImpl implements UserController {
    private final UserApplicationService userApplicationService;

    @GetMapping(path = PathConstants.USERNAME + PathConstants.USER_USERNAME)
    @Override
    public BaseResponse<UserGetResponse> getUserByUsername(@PathVariable("userName") String username) {
        return BaseResponse.success(this.userApplicationService.getUserByUsername(username));
    }

    @GetMapping(path = PathConstants.ALL)
    @Override
    public BaseResponse<PageableResponse<UserGetResponse>> getAll(@ModelAttribute UserParam param, Pageable pageable) {
        return BaseResponse.success(this.userApplicationService.getAll(param, pageable));
    }

    @PutMapping(path = PathConstants.BAN + PathConstants.USER_ID)
    @Override
    public BaseResponse<Boolean> banAccount(@PathVariable("userId") Long userId, HttpServletRequest request) {
        return BaseResponse.success(this.userApplicationService.ban(userId, request));
    }

    @PutMapping(path = PathConstants.ROLE + PathConstants.USER_ID)
    @Override
    public BaseResponse<Boolean> addAdmin(@PathVariable("userId") Long userId, HttpServletRequest request) {
        return BaseResponse.success(this.userApplicationService.changeRole(userId, request));
    }

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
