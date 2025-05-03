package com.mimingucci.user.presentation.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
public class UserUpdateRequest {
    @NotNull
    private Long id;

    private String firstname;

    private String lastname;

    private String description;

    private String avatar;

    private String country;
}
