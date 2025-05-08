package com.mimingucci.user.domain.repository;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.presentation.dto.request.UserParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public interface UserRepository {
    User findByEmail(String email);

    User findByUsername(String username);

    User update(User domain);

    Boolean unsetAvatar(Long userId);

    Boolean existsByEmail(String email);

    User findById(Long userId);

    List<User> findByCountry(String country);

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

    Page<User> findAll(UserParam param, Pageable pageable);

    void batchUpdateRatings(Map<Long, Integer> userRatings);

    Page<User> search(String query, Pageable pageable);

    Boolean setOnline(Long userId);

    Boolean setOffline(Long userId);
}