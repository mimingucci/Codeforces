package com.mimingucci.auth.infrastructure.repository;

import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.domain.repository.UserRepository;
import com.mimingucci.auth.infrastructure.repository.converter.UserConverter;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.infrastructure.repository.jpa.UserJpaRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@AllArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository userJpaRepository;

    @Override
    public User findByEmail(String email) {
        Optional<UserEntity> entity = this.userJpaRepository.findByEmail(email);
        return entity.map(UserConverter.INSTANCE::toDomain).orElse(null);
    }

    @Override
    public User findByUsername(String username) {
        Optional<UserEntity> entity = this.userJpaRepository.findByUsername(username);
        return entity.map(UserConverter.INSTANCE::toDomain).orElse(null);
    }
}
