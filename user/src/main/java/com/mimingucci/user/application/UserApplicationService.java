package com.mimingucci.user.application;

import com.mimingucci.user.presentation.dto.request.UserParam;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

public interface UserApplicationService {
    UserUpdateResponse updateProfile(UserUpdateRequest request);

    UserGetResponse getUserById(Long userId);

    UserGetResponse getUserByUsername(String username);

    PageableResponse<UserGetResponse> getAll(UserParam param, Pageable pageable);

    Boolean ban(Long userId, HttpServletRequest request);

    Boolean changeRole(Long userId, HttpServletRequest request);
}
