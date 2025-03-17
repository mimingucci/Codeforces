package com.mimingucci.user.domain.service;

import com.mimingucci.user.domain.model.User;

public interface UserRepository {
    User findByEmail(String email);
    User findByUsername(String username);
    User update(User domain);
    Boolean existsByEmail(String email);
}