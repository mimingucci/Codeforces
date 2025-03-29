package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationEntity;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestRegistrationJpaRepository extends JpaRepository<ContestRegistrationEntity, ContestRegistrationId> {
}
