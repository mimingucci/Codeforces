package com.mimingucci.user.domain.service.impl;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.repository.UserRepository;
import com.mimingucci.user.domain.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public User updateUserInfo(User domain) {
        User user = this.userRepository.findByEmail(domain.getEmail());
        if (!user.getEnabled()) throw new ApiRequestException(ErrorMessageConstants.ACCOUNT_DISABLED, HttpStatus.LOCKED);
        return this.userRepository.update(domain);
    }

    @Override
    public Boolean activeUser(String email) {
        User user = this.userRepository.findByEmail(email);
        if (user == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        user.setEnabled(true);
        this.userRepository.update(user);
        return true;
    }

    @Override
    public Boolean disactiveUser(String email) {
        User user = this.userRepository.findByEmail(email);
        if (user == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        user.setEnabled(false);
        this.userRepository.update(user);
        // send email announce to user such that their account has been banned


        return true;
    }

    @Override
    public User getUserProfile(String email) {
        return this.userRepository.findByEmail(email);
    }

    @Override
    public Page<User> getUsersByRating(Pageable pageable) {
        return null;
    }

    @Override
    public User getUserById(Long userId) {
        return this.userRepository.findById(userId);
    }
}
