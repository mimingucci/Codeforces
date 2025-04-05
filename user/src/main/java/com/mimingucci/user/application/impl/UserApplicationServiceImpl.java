package com.mimingucci.user.application.impl;

import com.mimingucci.user.application.UserApplicationService;
import com.mimingucci.user.application.assembler.UserAssembler;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.service.UserService;
import com.mimingucci.user.infrastructure.repository.converter.UserConverter;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserApplicationServiceImpl implements UserApplicationService {

    private final UserService userService;

    @Override
    public UserUpdateResponse updateProfile(UserUpdateRequest request) {
        User updatedUser = this.userService.updateUserInfo(UserAssembler.INSTANCE.regToDomain(request));
        return UserAssembler.INSTANCE.toUpdateResponse(updatedUser);
    }

    @Override
    public UserGetResponse getUserById(Long userId) {
        User user = this.userService.getUserById(userId);
        return UserAssembler.INSTANCE.toGetResponse(user);
    }
}
