package com.mimingucci.user.presentation.dto.response;

import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.domain.model.chat.UserStatus;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.Set;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserGetResponse {
    private Long id;

    private String email;

    private String username;

    private Boolean enabled;

    private String firstname;

    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private Set<Role> roles;

    private String country;

    private String avatar;

    private Instant createdAt;

    private UserStatus.Status status;

    private Instant lastActive;
}
