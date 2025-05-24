package com.mimingucci.auth.domain.service;

import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public interface AuthService {
    UserLoginResponse login(User domain);

    UserRegisterResponse register(User domain);

    UserForgotPasswordResponse forgotPassword(User domain);

    void changePassword(User domain);

    Boolean verify(String email);

    Boolean resetPassword(@NotNull @Email String email, @NotNull @NotBlank String password, @NotNull String token);
}
