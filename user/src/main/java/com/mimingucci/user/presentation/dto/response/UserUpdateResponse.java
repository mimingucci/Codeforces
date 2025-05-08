package com.mimingucci.user.presentation.dto.response;

import com.mimingucci.user.domain.model.chat.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateResponse {
    private Long id;

    private String email;

    private Boolean enabled;

    private String firstname;

    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private String country;

    private String avatar;

    private UserStatus.Status status;

    private Instant lastActive;
}
