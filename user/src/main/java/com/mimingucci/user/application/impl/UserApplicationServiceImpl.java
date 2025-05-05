package com.mimingucci.user.application.impl;

import com.mimingucci.user.application.UserApplicationService;
import com.mimingucci.user.application.assembler.UserAssembler;
import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.common.util.JwtUtil;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.service.UserService;
import com.mimingucci.user.presentation.dto.request.UserParam;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;

    private final JwtUtil jwtUtil;

    @Override
    public UserGetResponse updateProfile(UserUpdateRequest request) {
        User updatedUser = this.userService.updateUserInfo(UserAssembler.INSTANCE.regToDomain(request));
        return UserAssembler.INSTANCE.toGetResponse(updatedUser);
    }

    @Override
    public UserGetResponse getUserById(Long userId) {
        User user = this.userService.getUserById(userId);
        return UserAssembler.INSTANCE.toGetResponse(user);
    }

    @Override
    public UserGetResponse getUserByUsername(String username) {
        return UserAssembler.INSTANCE.toGetResponse(this.userService.getUserByUsername(username));
    }

    @Override
    public PageableResponse<UserGetResponse> getAll(UserParam param, Pageable pageable) {
        return UserAssembler.INSTANCE.pageToResponse(this.userService.getAll(param, pageable));
    }

    @Override
    public Boolean ban(Long userId, HttpServletRequest request) {
        Set<Role> roles = (Set<Role>) request.getAttribute("userRoles");
        return this.userService.ban(userId, roles);
    }

    @Override
    public Boolean changeRole(Long userId, HttpServletRequest request) {
        Set<Role> roles = (Set<Role>) request.getAttribute("userRoles");
        if (!roles.contains(Role.SUPER_ADMIN)) throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_REQUEST);
        return this.userService.changeRole(userId);
    }

    @Override
    public String uploadAvatar(MultipartFile file, HttpServletRequest request) {
        Long userId = null;
        try {
            userId = (Long) request.getAttribute("userId");
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        if (userId == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        return this.userService.uploadAvatar(file, userId);
    }

    @Override
    public Boolean unsetAvatar(HttpServletRequest request) {
        Long userId = null;
        try {
            userId = (Long) request.getAttribute("userId");
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        if (userId == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        return this.userService.unsetAvatar(userId);
    }

    @Override
    public Boolean updateRatings(List<Pair<Long, Integer>> users, String authToken) {
        if (authToken == null) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        try {
            Claims claims = this.jwtUtil.validateToken(authToken);
            if (!claims.getSubject().equals("SYSTEM")) return false;
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        this.userService.updateContestRatings(users);
        return true;
    }

    @Override
    public PageableResponse<UserGetResponse> search(String query, Pageable pageable) {
        return UserAssembler.INSTANCE.pageToResponse(this.userService.search(query, pageable));
    }

    @Override
    public List<UserGetResponse> getUserByIds(List<Long> userIds) {
        return this.userService.getUserByIds(userIds).stream().map(UserAssembler.INSTANCE::toGetResponse).toList();
    }
}
