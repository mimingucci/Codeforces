package com.mimingucci.user.application;

import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;

public interface UserApplicationService {
    UserUpdateResponse updateProfile(UserUpdateRequest request);

    UserGetResponse getUserById(Long userId);

    UserGetResponse getUserByUsername(String username);
}
