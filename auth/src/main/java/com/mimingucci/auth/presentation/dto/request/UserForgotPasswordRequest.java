package com.mimingucci.auth.presentation.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserForgotPasswordRequest {
    @NotNull
    @Email
    private String email;
}
