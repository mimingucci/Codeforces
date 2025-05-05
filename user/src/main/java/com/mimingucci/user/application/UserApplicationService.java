package com.mimingucci.user.application;

import com.mimingucci.user.presentation.dto.request.UserParam;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserApplicationService {
    UserGetResponse updateProfile(UserUpdateRequest request);

    UserGetResponse getUserById(Long userId);

    UserGetResponse getUserByUsername(String username);

    PageableResponse<UserGetResponse> getAll(UserParam param, Pageable pageable);

    Boolean ban(Long userId, HttpServletRequest request);

    Boolean changeRole(Long userId, HttpServletRequest request);

    String uploadAvatar(MultipartFile file, HttpServletRequest request);

    Boolean unsetAvatar(HttpServletRequest request);

    Boolean updateRatings(List<Pair<Long, Integer>> users, String authToken);

    PageableResponse<UserGetResponse> search(String query, Pageable pageable);

    List<UserGetResponse> getUserByIds(List<Long> userIds);
}
