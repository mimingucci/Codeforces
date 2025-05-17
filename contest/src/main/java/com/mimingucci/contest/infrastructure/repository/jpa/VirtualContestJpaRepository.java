package com.mimingucci.contest.infrastructure.repository.jpa;

import com.mimingucci.contest.infrastructure.repository.entity.VirtualContestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VirtualContestJpaRepository extends JpaRepository<VirtualContestEntity, Long> {
    @Query("SELECT vc FROM VirtualContestEntity vc WHERE vc.user = :userId ORDER BY vc.id DESC LIMIT 1")
    VirtualContestEntity findTopByUserIdOrderByIdDesc(@Param("userId") Long userId);
}
