package com.mimingucci.user.presentation.dto.response;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserGetResponse {
    private Long id;

    private String email;

    private Boolean enabled;

    private String firstname;

    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private String avatar;
}
