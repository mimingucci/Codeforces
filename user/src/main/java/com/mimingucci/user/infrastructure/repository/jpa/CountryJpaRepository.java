package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.infrastructure.repository.entity.CountryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CountryJpaRepository extends JpaRepository<CountryEntity, Long> {
    Optional<CountryEntity> findByCode(String code);
    Optional<CountryEntity> findByName(String name);
    List<CountryEntity> findByNameContainingIgnoreCase(String name);
    boolean existsByCode(String code);
    List<CountryEntity> findAllByOrderByNameAsc();
}
