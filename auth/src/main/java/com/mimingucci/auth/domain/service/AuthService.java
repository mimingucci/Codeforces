package com.mimingucci.auth.domain.service;

import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;

public interface AuthService {
    UserLoginResponse login(UserLoginRequest request);
}
