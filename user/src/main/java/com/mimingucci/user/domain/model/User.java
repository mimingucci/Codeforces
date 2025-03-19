package com.mimingucci.user.domain.model;

import com.mimingucci.user.common.enums.Role;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
public class User {
    private Long Id;

    private String email;

    private String password;

    private Set<Role> roles = new HashSet<>();

    private Boolean enabled;

    private String firstname;

    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private String avatar;

    public boolean hasRole(Role role) {
        return this.roles.contains(role);
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }
}