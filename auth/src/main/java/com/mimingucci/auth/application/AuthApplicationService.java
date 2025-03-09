package com.mimingucci.auth.application;

import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;

public interface AuthApplicationService {
    UserLoginResponse login(UserLoginRequest request);
}
