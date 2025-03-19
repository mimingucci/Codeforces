package com.mimingucci.user.presentation.dto.request;

import lombok.Data;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
public class UserUpdateRequest {

    private String firstname;

    private String lastname;

    private String description;

    private String avatar;
}
