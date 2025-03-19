package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.User;

public interface UserRepository {
    User findByEmail(String email);

    User findByUsername(String username);

    User update(User domain);

    Boolean existsByEmail(String email);

    User findById(Long userId);
}