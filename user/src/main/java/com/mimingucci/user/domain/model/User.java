package com.mimingucci.user.domain.model;

import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.domain.model.chat.UserStatus;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class User {
    private Long id;

    private String email;

    private String password;

    private String username;

    private Set<Role> roles = new HashSet<>();

    private Boolean enabled;

    private String firstname;

    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private String avatar;

    private UserStatus.Status status;

    private Instant lastActive;

    private String country;

    private Instant createdAt;

    public boolean hasRole(Role role) {
        return this.roles.contains(role);
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }
}