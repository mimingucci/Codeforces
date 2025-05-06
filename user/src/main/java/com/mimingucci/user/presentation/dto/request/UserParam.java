package com.mimingucci.user.presentation.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserParam {
    @Pattern(regexp = "^(ASC|DESC)$", message = "Sort direction must be either ASC or DESC")
    private String ratingDir;

    @Pattern(regexp = "^(ASC|DESC)$", message = "Sort direction must be either ASC or DESC")
    private String usernameDir;

    @Pattern(regexp = "^(ASC|DESC)$", message = "Sort direction must be either ASC or DESC")
    private String contributeDir;

    private Integer rating;

    private String username;

    private String email;

}
