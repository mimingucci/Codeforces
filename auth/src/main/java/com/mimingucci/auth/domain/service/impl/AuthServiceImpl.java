package com.mimingucci.auth.domain.service.impl;

import com.mimingucci.auth.common.constant.ErrorMessageConstants;
import com.mimingucci.auth.common.constant.SuccessMessageConstants;
import com.mimingucci.auth.common.exception.ApiRequestException;
import com.mimingucci.auth.common.util.JwtUtil;
import com.mimingucci.auth.domain.assembler.UserAssembler;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.domain.repository.UserRepository;
import com.mimingucci.auth.domain.service.AuthService;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import com.mimingucci.auth.presentation.dto.response.UserForgotPasswordResponse;
import com.mimingucci.auth.presentation.dto.response.UserLoginResponse;
import com.mimingucci.auth.presentation.dto.response.UserRegisterResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final UserAssembler userAssembler;

    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = this.userAssembler.loginToDomain(request);
        User queriedUser = this.userRepository.findByEmail(user.getEmail());
        if (queriedUser == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);

        if (!queriedUser.getEnabled()) {
            throw new ApiRequestException(ErrorMessageConstants.ACCOUNT_DISABLED, HttpStatus.LOCKED);
        }

        // check if password match
        if (!passwordEncoder.matches(user.getPassword(), queriedUser.getPassword())) {
            throw new ApiRequestException(ErrorMessageConstants.INCORRECT_PASSWORD, HttpStatus.BAD_REQUEST);
        }

        return UserLoginResponse.builder().token(this.jwtUtil.generateAccessToken(queriedUser.getEmail(), queriedUser.getRoles())).build();
    }

    @Override
    public UserRegisterResponse register(UserRegisterRequest request) {
        User user = this.userAssembler.registerToDomain(request);
        Boolean isExist = this.userRepository.existsByEmail(user.getEmail());
        if (isExist) throw new ApiRequestException(ErrorMessageConstants.EMAIL_HAS_ALREADY_BEEN_TAKEN, HttpStatus.BAD_REQUEST);
        user.setPassword(this.passwordEncoder.encode(user.getPassword()));
        User savedUser = this.userRepository.save(user);
        return UserRegisterResponse.builder().done(Boolean.TRUE).message(SuccessMessageConstants.REGISTER_SUCCESS).build();
    }

    @Override
    public UserForgotPasswordResponse forgotPassword(UserForgotPasswordRequest request) {
        User user = this.userAssembler.forgotToDomain(request);
        Boolean isExist = this.userRepository.existsByEmail(user.getEmail());
        if (isExist) throw new ApiRequestException(ErrorMessageConstants.EMAIL_HAS_ALREADY_BEEN_TAKEN, HttpStatus.BAD_REQUEST);
        // put to kafka/rabbitmq

        return UserForgotPasswordResponse.builder().sentEmail(Boolean.TRUE).message(SuccessMessageConstants.SEND_EMAIL_SUCCESS).build();
    }

}
