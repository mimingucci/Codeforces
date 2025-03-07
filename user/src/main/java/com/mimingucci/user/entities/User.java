package com.mimingucci.user.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "user")
public class User {
    @Id
    private Long id;

    private String username;

    private String email;

    private String password;

    @Column(name = "first_name")
    private String firstname;

    @Column(name = "last_name")
    private String lastname;

    private String description;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "users_roles", joinColumns = @JoinColumn(name="user_id")
            , inverseJoinColumns = @JoinColumn(name="role_id")
    )
    private Set<Role> roles=new HashSet<>();

    private Integer rating;

    private Integer contribute;

    private Boolean enabled;

    @Column(name = "refresh_token")
    private String refreshToken;

    @Column(name = "password_reset_token")
    private String passwordResetToken;

    private String avatar;

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @Column(nullable = false, length = 50, name = "time_zone")
    private String timeZone;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
    }

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Country country;

    public boolean hasRole(String roleName) {
        return this.roles.stream().anyMatch(role -> role.getName().equals(roleName));
    }
}
