package com.mimingucci.auth.presentation.dto.response;

import com.mimingucci.auth.common.enums.Role;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserLoginResponse {
    String token;

    Long id;

    String email;

    String username;

    List<Role> roles;
}
