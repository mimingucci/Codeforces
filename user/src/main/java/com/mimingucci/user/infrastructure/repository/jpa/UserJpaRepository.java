package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.domain.model.chat.UserStatus;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserJpaRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {
    Optional<UserEntity> findByUsername(String username);

    Optional<UserEntity> findByEmail(String email);

    Page<UserEntity> findByEnabledTrueOrderByRatingDesc(Pageable pageable);

    Boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE UserEntity user SET user.contribute = user.contribute + 1 WHERE user.id = :userId")
    void increaseContributeCount(@Param("userId") Long id);

    @Modifying
    @Query("UPDATE UserEntity user SET user.contribute = user.contribute - 1 WHERE user.id = :userId")
    void decreaseContributeCount(@Param("userId") Long id);

    @Modifying
    @Query("UPDATE UserEntity user SET user.rating = user.rating + :rating WHERE user.id = :userId")
    void updateRating(@Param("userId") Long id, @Param("rating") Integer rating);

    // Custom query with JPQL
    @Query("SELECT u FROM UserEntity u WHERE u.country = :country")
    List<UserEntity> findByCountry(@Param("country") String country);

    boolean existsByUsername(String username);

    // Search queries
    Page<UserEntity> findByUsernameContainingIgnoreCase(String username, Pageable pageable);

    // Update queries
    @Modifying
    @Query("UPDATE UserEntity u SET u.status = :status WHERE u.id = :userId")
    int updateUserStatus(@Param("userId") Long userId, @Param("status") UserStatus.Status status);

    @Modifying
    @Query("UPDATE UserEntity u SET u.lastActive = :lastActive WHERE u.id = :userId")
    int updateLastActive(@Param("userId") Long userId, @Param("lastActive") Instant lastActive);

    // Find users by list of IDs
    List<UserEntity> findByIdIn(Collection<Long> userIds);

    // Check if user exists by ID
    boolean existsById(Long userId);

    @Modifying
    @Query(value = "UPDATE user SET rating = CASE id " +
            "#{#ratings.entrySet().stream()" +
            ".map(entry -> 'WHEN ' + entry.getKey() + ' THEN ' + entry.getValue())" +
            ".collect(java.util.stream.Collectors.joining(' ')} " +
            "END WHERE id IN :ids", nativeQuery = true)
    void batchUpdateRatings(@Param("ratings") Map<Long, Integer> userRatings, @Param("ids") Collection<Long> userIds);

    @Query("SELECT u FROM UserEntity u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<UserEntity> quickSearch(@Param("query") String query, Pageable pageable);
}
