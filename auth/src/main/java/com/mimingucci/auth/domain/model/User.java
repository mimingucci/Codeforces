package com.mimingucci.auth.domain.model;

import com.mimingucci.auth.common.enums.Role;
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

    public boolean hasRole(Role role) {
        return this.roles.contains(role);
    }

    public void addRole(Role role) {
        this.roles.add(role);
    }
}
