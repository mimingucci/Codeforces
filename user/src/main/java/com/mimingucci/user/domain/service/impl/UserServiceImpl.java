package com.mimingucci.user.domain.service.impl;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.repository.UserRepository;
import com.mimingucci.user.domain.service.UserService;
import com.mimingucci.user.presentation.dto.request.UserParam;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

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

    @Override
    public User getUserByUsername(String username) {
        return this.userRepository.findByUsername(username);
    }

    @Override
    public Page<User> getAll(UserParam param, Pageable pageable) {
        return this.userRepository.findAll(param, pageable);
    }

    @Override
    public void updateContestRatings(List<Pair<Long, Integer>> results) {
        // Create a map of userId to new rating
        Map<Long, Integer> newRatings = results.stream()
                .collect(Collectors.toMap(
                        Pair::getFirst,
                        Pair::getSecond
                ));

        // Perform batch update
        userRepository.batchUpdateRatings(newRatings);
    }

    @Override
    public Boolean ban(Long userId, Set<Role> roles) {
        if (!roles.contains(Role.SUPER_ADMIN) && !roles.contains(Role.ADMIN)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        User user = this.userRepository.findById(userId);
        if (user == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (user.getRoles().contains(Role.SUPER_ADMIN)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        if (user.getRoles().contains(Role.ADMIN) && !roles.contains(Role.SUPER_ADMIN)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.BAD_REQUEST);
        }
        user.setEnabled(false);
        this.userRepository.update(user);
        // send mail
        return true;
    }

    @Override
    public Boolean changeRole(Long userId) {
        User user = this.userRepository.findById(userId);
        if (user == null) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        if (user.getRoles().contains(Role.ADMIN)) user.getRoles().remove(Role.ADMIN);
        else user.getRoles().add(Role.ADMIN);
        this.userRepository.update(user);
        return true;
    }
}
