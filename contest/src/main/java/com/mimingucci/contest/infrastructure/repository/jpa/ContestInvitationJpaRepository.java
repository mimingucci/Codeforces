package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.ContestInvitationEntity;
import com.mimingucci.contest.infrastructure.repository.entity.ContestRegistrationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContestInvitationJpaRepository extends JpaRepository<ContestInvitationEntity, ContestRegistrationId> {
}
