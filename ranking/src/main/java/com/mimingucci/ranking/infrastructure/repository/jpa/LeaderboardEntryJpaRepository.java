package com.mimingucci.ranking.infrastructure.repository.jpa;

import com.mimingucci.ranking.infrastructure.repository.entity.LeaderboardEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeaderboardEntryJpaRepository extends JpaRepository<LeaderboardEntryEntity, Long> {

}
