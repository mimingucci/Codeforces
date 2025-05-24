package com.mimingucci.user.domain.service;

import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.presentation.dto.request.UserParam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.util.Pair;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.Set;

public interface UserService {
    User updateUserInfo(User domain);

    Boolean activeUser(String email);

    Boolean disactiveUser(String email);

    User getUserProfile(String email);

    Page<User> getUsersByRating(Pageable pageable);

    User getUserById(Long userId);

    User getUserByUsername(String username);

    Page<User> getAll(UserParam param, Pageable pageable);

    void updateContestRatings(List<Pair<Long, Integer>> results);

    Boolean ban(Long userId, Set<Role> roles);

    Boolean changeRole(Long userId);

    String uploadAvatar(MultipartFile file, Long userId);

    /**
     * Unsets the avatar for a given user
     * @param userId the ID of the user
     * @return true if successful, false otherwise
     */
    Boolean unsetAvatar(Long userId);

    Page<User> search(String query, Pageable pageable);

    List<User> getUserByIds(List<Long> userIds);

    Boolean setOnline(Long userId);

    Boolean setOffline(Long userId);
}
