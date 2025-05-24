package com.mimingucci.auth.domain.repository;

import com.mimingucci.auth.domain.model.User;

public interface UserRepository {
    User findByEmail(String email);
    User findByUsername(String username);
    User save(User domain);
    Boolean existsByEmail(String email);
}
