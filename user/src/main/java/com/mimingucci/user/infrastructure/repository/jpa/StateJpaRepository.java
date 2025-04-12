package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.infrastructure.repository.entity.StateEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StateJpaRepository extends JpaRepository<StateEntity, Long> {
    List<StateEntity> findByCountryId(Long countryId);
    List<StateEntity> findByCountryCode(String countryCode);
    List<StateEntity> findByNameContainingIgnoreCase(String name);

    @Query("SELECT s FROM StateEntity s WHERE s.country.id = :countryId ORDER BY s.name ASC")
    List<StateEntity> findByCountryIdOrderByName(@Param("countryId") Long countryId);

    boolean existsByNameAndCountryId(String name, Long countryId);
}
