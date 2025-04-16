package com.mimingucci.auth.infrastructure.repository.entity;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.infrastructure.repository.converter.RoleSetConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.Set;

@Entity
@Table(name = "user")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity {
    @Id
    private Long id;

    private String email;

    private String username;

    private String password;

    private Boolean enabled;

    private Integer rating;

    @Column(name = "forgot_password_token")
    private String forgotPasswordToken = "";

    @Convert(converter = RoleSetConverter.class)
    private Set<Role> roles;

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
        this.enabled = false;
        this.rating = 0;
    }
}
