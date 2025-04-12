package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;

public interface UserRepository {
    User findByEmail(String email);

    User findByUsername(String username);

    User update(User domain);

    Boolean existsByEmail(String email);

    User findById(Long userId);

    List<User> findByCountry(Long countryId);

    Page<User> findByCountry(Long countryId, Pageable pageable);

    List<User> findByState(Long stateId);

    Page<User> findByState(Long stateId, Pageable pageable);

    List<User> findByCountryAndState(Long countryId, Long stateId);

    long getCountryUserCount(Long countryId);

    long getStateUserCount(Long stateId);

    /**
     * Check if a user exists by their ID
     * @param userId the ID of the user to check
     * @return true if the user exists, false otherwise
     */
    boolean existsById(Long userId);

    /**
     * Find multiple users by their IDs
     * @param userIds collection of user IDs to find
     * @return List of found users
     */
    List<User> findByIds(Collection<Long> userIds);
}