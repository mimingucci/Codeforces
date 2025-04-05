package com.mimingucci.user.presentation.api;

import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;

public interface UserController {
    BaseResponse<UserUpdateResponse> updateProfile(UserUpdateRequest request);

    BaseResponse<UserGetResponse> getUserById(Long userId);
}
