package com.mimingucci.auth.infrastructure.repository;

import com.mimingucci.auth.common.constant.ErrorMessageConstants;
import com.mimingucci.auth.common.exception.ApiRequestException;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.domain.repository.UserRepository;
import com.mimingucci.auth.infrastructure.repository.converter.UserConverter;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.infrastructure.repository.jpa.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
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

    @Override
    public User save(User domain) {
        UserEntity entity = this.userJpaRepository.save(UserConverter.INSTANCE.toEntity(domain));
        if (!entity.getEmail().equals(domain.getEmail())) throw new ApiRequestException(ErrorMessageConstants.INTERNAL_SERVER, HttpStatus.INTERNAL_SERVER_ERROR);
        return UserConverter.INSTANCE.toDomain(entity);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return this.userJpaRepository.existsByEmail(email);
    }
}
