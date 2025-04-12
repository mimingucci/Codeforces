package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.State;

import java.util.List;

public interface StateRepository {
    State create(State state);

    State getById(Long id);

    List<State> getByCountryId(Long countryId);

    State update(Long id, State state);

    void deleteById(Long id);
}