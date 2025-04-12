package com.mimingucci.user.infrastructure.repository;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.State;
import com.mimingucci.user.domain.repository.StateRepository;
import com.mimingucci.user.infrastructure.repository.converter.StateConverter;
import com.mimingucci.user.infrastructure.repository.entity.CountryEntity;
import com.mimingucci.user.infrastructure.repository.entity.StateEntity;
import com.mimingucci.user.infrastructure.repository.jpa.StateJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
@Transactional
public class StateRepositoryImpl implements StateRepository {
    private final StateJpaRepository repository;

    private final StateConverter stateConverter;

    @Override
    public State create(State state) {
        StateEntity entity = stateConverter.toEntity(state);
        StateEntity savedEntity = repository.save(entity);
        return stateConverter.toDomain(savedEntity);
    }

    @Override
    public State getById(Long id) {
        return repository.findById(id)
                .map(stateConverter::toDomain)
                .orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.STATE_NOT_FOUND, HttpStatus.NOT_FOUND));
    }

    @Override
    public List<State> getByCountryId(Long countryId) {
        return repository.findByCountryId(countryId).stream().map(stateConverter::toDomain).toList();
    }

    @Override
    public State update(Long id, State state) {
        StateEntity existingEntity = repository.findById(id)
                .orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.STATE_NOT_FOUND, HttpStatus.NOT_FOUND));

        // Update fields
        existingEntity.setName(state.getName());
        if (state.getCountry() != null) {
            CountryEntity countryEntity = new CountryEntity();
            countryEntity.setId(state.getCountry().getId());
            existingEntity.setCountry(countryEntity);
        }

        StateEntity updatedEntity = repository.save(existingEntity);
        return stateConverter.toDomain(updatedEntity);
    }

    @Override
    public void deleteById(Long id) {
        if (!repository.existsById(id)) {
            throw new ApiRequestException(ErrorMessageConstants.STATE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        repository.deleteById(id);
    }
}
