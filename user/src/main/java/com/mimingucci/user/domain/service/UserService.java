package com.mimingucci.user.domain.service;

import com.mimingucci.user.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    User updateUserInfo(User domain);

    Boolean activeUser(String email);

    Boolean disactiveUser(String email);

    User getUserProfile(String email);

    Page<User> getUsersByRating(Pageable pageable);

    User getUserById(Long userId);
}
