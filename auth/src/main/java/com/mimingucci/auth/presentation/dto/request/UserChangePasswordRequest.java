package com.mimingucci.auth.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserChangePasswordRequest {
    String email;

    @NotNull
    @NotBlank
    String password;
}
