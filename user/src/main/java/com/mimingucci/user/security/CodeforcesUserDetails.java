package com.mimingucci.user.security;

import com.mimingucci.user.entities.Role;
import com.mimingucci.user.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Set;

public class CodeforcesUserDetails implements UserDetails {
    private static final long serialVersionUID = 1L;

    private User user;

    public CodeforcesUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<Role> roles = this.user.getRoles();
        List<SimpleGrantedAuthority> authorities=new ArrayList<>();
        for(Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return authorities;
    }

    @Override
    public String getPassword() {
        return this.user.getPassword();
    }

    @Override
    public String getUsername() {
        return this.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return this.user.getEnabled();
    }

    public String getFullname() {
        return this.user.getFirstname() + " " + this.user.getLastname();
    }

    public boolean hasRole(String roleName) {
        return this.user.hasRole(roleName);
    }


}
