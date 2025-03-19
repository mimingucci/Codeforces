package com.mimingucci.auth.infrastructure.service;

import com.mimingucci.auth.common.constant.ErrorMessageConstants;
import com.mimingucci.auth.common.constant.SuccessMessageConstants;
import com.mimingucci.auth.common.exception.ApiRequestException;
import com.mimingucci.auth.common.util.JwtUtil;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.domain.repository.UserRepository;
import com.mimingucci.auth.domain.service.AuthService;
import com.mimingucci.auth.domain.service.KafkaProducerService;
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
    private final JwtUtil jwtUtil;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final KafkaProducerService producer;

    @Override
    public UserLoginResponse login(User domain) {
        User queriedUser = this.userRepository.findByEmail(domain.getEmail());
        if (queriedUser == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);

        if (!queriedUser.getEnabled()) {
            throw new ApiRequestException(ErrorMessageConstants.ACCOUNT_DISABLED, HttpStatus.LOCKED);
        }

        // check if password match
        if (!passwordEncoder.matches(domain.getPassword(), queriedUser.getPassword())) {
            throw new ApiRequestException(ErrorMessageConstants.INCORRECT_PASSWORD, HttpStatus.BAD_REQUEST);
        }

        return UserLoginResponse.builder().token(this.jwtUtil.generateAccessToken(queriedUser.getEmail(), queriedUser.getRoles())).build();
    }

    @Override
    public UserRegisterResponse register(User domain) {
        Boolean isExist = this.userRepository.existsByEmail(domain.getEmail());
        if (isExist) throw new ApiRequestException(ErrorMessageConstants.EMAIL_HAS_ALREADY_BEEN_TAKEN, HttpStatus.BAD_REQUEST);
        domain.setPassword(this.passwordEncoder.encode(domain.getPassword()));
        User savedUser = this.userRepository.save(domain);
        this.producer.sendVerificationRegistrationEmail(savedUser.getEmail());
        return UserRegisterResponse.builder().done(Boolean.TRUE).message(SuccessMessageConstants.REGISTER_SUCCESS).build();
    }

    @Override
    public UserForgotPasswordResponse forgotPassword(User domain) {
        Boolean isExist = this.userRepository.existsByEmail(domain.getEmail());
        if (isExist) throw new ApiRequestException(ErrorMessageConstants.EMAIL_HAS_ALREADY_BEEN_TAKEN, HttpStatus.BAD_REQUEST);
        // put event to kafka
        this.producer.sendChangingPasswordEmail(domain.getEmail());

        return UserForgotPasswordResponse.builder().sentEmail(Boolean.TRUE).message(SuccessMessageConstants.SEND_EMAIL_SUCCESS).build();
    }

    @Override
    public void changePassword(User domain) {
        User queriedUser = this.userRepository.findByEmail(domain.getEmail());

        if (queriedUser == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);

        if (!queriedUser.getEnabled()) {
            throw new ApiRequestException(ErrorMessageConstants.ACCOUNT_DISABLED, HttpStatus.LOCKED);
        }

        queriedUser.setPassword(this.passwordEncoder.encode(domain.getPassword()));
        this.userRepository.save(queriedUser);
    }

}
