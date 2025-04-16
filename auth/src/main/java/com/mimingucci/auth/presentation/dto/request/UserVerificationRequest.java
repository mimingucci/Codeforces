package com.mimingucci.auth.presentation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserVerificationRequest {
    @NotNull
    @NotBlank
    private String token;
}
