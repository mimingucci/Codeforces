package com.mimingucci.user.infrastructure.repository.entity;

import com.mimingucci.user.common.enums.Role;
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

    private Set<Role> roles;

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

    @ManyToOne
    @JoinColumn(name = "country_id")
    private CountryEntity country;

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now(); // Set to current UTC time
        this.enabled = true;
        this.rating = 0;
    }
}
