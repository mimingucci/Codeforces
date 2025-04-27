package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.repository.UserRepository;
import com.mimingucci.user.infrastructure.repository.converter.UserConverter;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import com.mimingucci.user.infrastructure.repository.jpa.UserJpaRepository;
import com.mimingucci.user.infrastructure.repository.specification.UserSpecification;
import com.mimingucci.user.presentation.dto.request.UserParam;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@RequiredArgsConstructor
public class UserRepositoryImpl implements UserRepository {
    private final UserJpaRepository userJpaRepository;

    private final UserConverter converter;

    @Override
    public User findByEmail(String email) {
        Optional<UserEntity> optionalEntity = this.userJpaRepository.findByEmail(email);
        if (optionalEntity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        return converter.toDomain(optionalEntity.get());
    }

    @Override
    public User findByUsername(String username) {
        Optional<UserEntity> optionalEntity = this.userJpaRepository.findByUsername(username);
        if (optionalEntity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        return converter.toDomain(optionalEntity.get());
    }

    @Override
    public User update(User domain) {
        Optional<UserEntity> optional = this.userJpaRepository.findByEmail(domain.getEmail());
        if (optional.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        UserEntity entity = optional.get();
        if (domain.getFirstname() != null) entity.setFirstname(domain.getFirstname());
        if (domain.getLastname() != null) entity.setLastname(domain.getLastname());
        if (domain.getAvatar() != null) entity.setAvatar(domain.getAvatar());
        if (domain.getDescription() != null) entity.setDescription(domain.getDescription());
        if (domain.getRoles() != null) entity.setRoles(domain.getRoles());
        if (domain.getContribute() != null) entity.setContribute(domain.getContribute());
        UserEntity updatedEntity = this.userJpaRepository.save(entity);
        return converter.toDomain(updatedEntity);
    }

    @Override
    public Boolean existsByEmail(String email) {
        return this.userJpaRepository.existsByEmail(email);
    }

    @Override
    public User findById(Long userId) {
        Optional<UserEntity> optionalEntity = this.userJpaRepository.findById(userId);
        if (optionalEntity.isEmpty()) throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        System.out.println(optionalEntity.get().getId() + " - " + optionalEntity.get().getRoles().toString());
        return converter.toDomain(optionalEntity.get());
    }

    @Override
    public List<User> findByCountry(Long countryId) {
        return this.userJpaRepository.findByCountryId(countryId).stream().map(converter::toDomain).toList();
    }

    @Override
    public Page<User> findByCountry(Long countryId, Pageable pageable) {
        return this.userJpaRepository.findByCountryId(countryId, pageable).map(converter::toDomain);
    }

    @Override
    public long getCountryUserCount(Long countryId) {
        return 0;
    }

    @Override
    public boolean existsById(Long userId) {
        return userJpaRepository.existsById(userId);
    }

    @Override
    public List<User> findByIds(Collection<Long> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return List.of();
        }
        return userJpaRepository.findByIdIn(userIds)
                .stream()
                .map(converter::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Page<User> findAll(UserParam param, Pageable pageable) {
        Specification<UserEntity> spec = UserSpecification.withParams(param);
        Page<UserEntity> userEntities = userJpaRepository.findAll(spec, pageable);
        return userEntities.map(converter::toDomain);
    }

    @Override
    @Transactional
    public void batchUpdateRatings(Map<Long, Integer> userRatings) {
        if (userRatings == null || userRatings.isEmpty()) {
            return;
        }

        // Execute batch update
        userJpaRepository.batchUpdateRatings(
                userRatings,
                userRatings.keySet()
        );
    }
}
