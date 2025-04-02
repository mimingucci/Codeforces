package com.mimingucci.user.presentation.dto.response;

import com.mimingucci.user.domain.model.User;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateResponse {
    private String email;

    private Boolean enabled;

    private String firstname;

    private String lastname;

    private String description;

    private Integer rating;

    private Integer contribute;

    private String avatar;

    public UserUpdateResponse(User user) {
        this.avatar = user.getAvatar();
        this.email = user.getEmail();
        this.contribute = user.getContribute();
        this.rating = user.getRating();
        this.description = user.getDescription();
        this.firstname = user.getFirstname();
        this.lastname = user.getLastname();
        this.enabled = user.getEnabled();
    }
}
