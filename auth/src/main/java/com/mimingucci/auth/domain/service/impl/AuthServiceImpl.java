package com.mimingucci.auth.domain.service.impl;

import com.mimingucci.auth.common.exception.UserNotFoundException;
import com.mimingucci.auth.common.util.JwtUtil;
import com.mimingucci.auth.domain.assembler.UserAssembler;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.domain.repository.UserRepository;
import com.mimingucci.auth.domain.service.AuthService;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserAssembler userAssembler;

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = this.userAssembler.loginToDomain(request);
        User queriedUser = this.userRepository.findByEmail(user.getEmail());
        if (queriedUser == null) throw new UserNotFoundException();
        // check if password match

        return UserLoginResponse.builder().token(this.jwtUtil.generateAccessToken(queriedUser.getEmail())).build();
    }
}
