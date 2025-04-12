package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.Country;

public interface CountryRepository {
    Country create(Country domain);

    Country getById(Long id);

    Country update(Long id, Country domain);

    void delete(Long id);
}
