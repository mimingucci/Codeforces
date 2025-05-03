package com.mimingucci.user.presentation.api;

import com.mimingucci.user.presentation.dto.request.UserParam;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserController {
    BaseResponse<UserGetResponse> updateProfile(UserUpdateRequest request);

    BaseResponse<UserGetResponse> getUserById(Long userId);

    BaseResponse<UserGetResponse> getUserByUsername(String username);

    BaseResponse<PageableResponse<UserGetResponse>> getAll(@ModelAttribute UserParam param, Pageable pageable);

    BaseResponse<Boolean> banAccount(Long userId, HttpServletRequest request);

    BaseResponse<Boolean> addAdmin(Long userId, HttpServletRequest request);

    BaseResponse<String> uploadAvatar(MultipartFile file, HttpServletRequest request);

    BaseResponse<Boolean> unsetAvatar(HttpServletRequest request);

    BaseResponse<Boolean> updateUserRatings(List<Pair<Long, Integer>> users, String authToken);

}
