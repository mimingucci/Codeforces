package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.Country;
import com.mimingucci.user.domain.repository.CountryRepository;
import com.mimingucci.user.infrastructure.repository.converter.CountryConverter;
import com.mimingucci.user.infrastructure.repository.entity.CountryEntity;
import com.mimingucci.user.infrastructure.repository.jpa.CountryJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CountryRepositoryImpl implements CountryRepository {
    private final CountryJpaRepository repository;

    private final CountryConverter countryConverter;

    @Override
    public Country create(Country domain) {
        if (repository.existsByCode(domain.getCode())) {
            throw new ApiRequestException(ErrorMessageConstants.COUNTRY_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        CountryEntity entity = countryConverter.toEntity(domain);
        CountryEntity savedEntity = repository.save(entity);
        return countryConverter.toDomain(savedEntity);
    }

    @Override
    public Country getById(Long id) {
        return repository.findById(id)
                .map(countryConverter::toDomain)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.COUNTRY_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));
    }

    @Override
    public Country update(Long id, Country domain) {
        CountryEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new ApiRequestException(
                        ErrorMessageConstants.COUNTRY_NOT_FOUND,
                        HttpStatus.NOT_FOUND
                ));

        // Check if code is being changed and new code already exists
        if (!existingEntity.getCode().equals(domain.getCode())
                && repository.existsByCode(domain.getCode())) {
            throw new ApiRequestException(
                    ErrorMessageConstants.COUNTRY_ALREADY_EXISTS,
                    HttpStatus.CONFLICT
            );
        }

        existingEntity.setName(domain.getName());
        existingEntity.setCode(domain.getCode());

        CountryEntity updatedEntity = repository.save(existingEntity);
        return countryConverter.toDomain(updatedEntity);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ApiRequestException(
                    ErrorMessageConstants.COUNTRY_NOT_FOUND,
                    HttpStatus.NOT_FOUND
            );
        }
        repository.deleteById(id);
    }
}
