package com.mimingucci.user.presentation.api;

import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import lombok.Getter;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

public interface UserController {
    @PutMapping
    BaseResponse<UserUpdateResponse> updateProfile(@RequestBody @Validated UserUpdateRequest request);

    @GetMapping
    BaseResponse<UserGetResponse> getUserById(@PathVariable("userId")Long userId);
}
