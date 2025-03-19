package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Page<UserEntity> findByEnabledTrueOrderByRatingDesc(Pageable pageable);

    Boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User user SET user.contribute = user.contribute + 1 WHERE user.id = :userId")
    void increaseContributeCount(@Param("userId") Long id);

    @Modifying
    @Query("UPDATE User user SET user.contribute = user.contribute - 1 WHERE user.id = :userId")
    void decreaseContributeCount(@Param("userId") Long id);

    @Modifying
    @Query("UPDATE User user SET user.rating = user.rating + :rating WHERE user.id = :userId")
    void updateRating(@Param("userId") Long id, @Param("rating") Integer rating);
}
