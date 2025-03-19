package com.mimingucci.auth.domain.service;

import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;

public interface AuthService {
    UserLoginResponse login(User domain);

    UserRegisterResponse register(User domain);

    UserForgotPasswordResponse forgotPassword(User domain);

    void changePassword(User domain);
}
