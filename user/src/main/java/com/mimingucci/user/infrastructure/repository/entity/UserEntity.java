package com.mimingucci.user.infrastructure.repository.entity;

import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.domain.model.chat.UserStatus;
import com.mimingucci.user.infrastructure.repository.converter.RoleSetConverter;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.HashSet;
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

    @Column(unique = true, nullable = false, updatable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    private String password;

    private Boolean enabled;

    @Convert(converter = RoleSetConverter.class)
    private Set<Role> roles = new HashSet<>();

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt; // UTC timestamp

    @Column(name = "first_name")
    private String firstname;

    @Column(name = "last_name")
    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private String avatar;

    @Column(name = "forgot_password_token")
    private String forgotPasswordToken = "";

    @Enumerated(EnumType.STRING)
    private UserStatus.Status status = UserStatus.Status.OFFLINE;

    @Column(name = "last_active")
    private Instant lastActive;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "country_id")
    private CountryEntity country;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
        this.enabled = true;
        this.rating = 0;
    }
}
