package com.mimingucci.user.application.assembler;

import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:13:07+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class UserAssemblerImpl implements UserAssembler {

    @Override
    public User regToDomain(UserUpdateRequest request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( request.getId() );
        user.firstname( request.getFirstname() );
        user.lastname( request.getLastname() );
        user.description( request.getDescription() );
        user.avatar( request.getAvatar() );
        user.country( request.getCountry() );

        return user.build();
    }

    @Override
    public UserGetResponse toGetResponse(User domain) {
        if ( domain == null ) {
            return null;
        }

        UserGetResponse userGetResponse = new UserGetResponse();

        userGetResponse.setId( domain.getId() );
        userGetResponse.setEmail( domain.getEmail() );
        userGetResponse.setUsername( domain.getUsername() );
        userGetResponse.setEnabled( domain.getEnabled() );
        userGetResponse.setFirstname( domain.getFirstname() );
        userGetResponse.setLastname( domain.getLastname() );
        userGetResponse.setDescription( domain.getDescription() );
        userGetResponse.setRating( domain.getRating() );
        userGetResponse.setContribute( domain.getContribute() );
        Set<Role> set = domain.getRoles();
        if ( set != null ) {
            userGetResponse.setRoles( new LinkedHashSet<Role>( set ) );
        }
        userGetResponse.setCountry( domain.getCountry() );
        userGetResponse.setAvatar( domain.getAvatar() );
        userGetResponse.setCreatedAt( domain.getCreatedAt() );
        userGetResponse.setStatus( domain.getStatus() );
        userGetResponse.setLastActive( domain.getLastActive() );

        return userGetResponse;
    }

    @Override
    public UserUpdateResponse toUpdateResponse(User domain) {
        if ( domain == null ) {
            return null;
        }

        UserUpdateResponse userUpdateResponse = new UserUpdateResponse();

        userUpdateResponse.setId( domain.getId() );
        userUpdateResponse.setEmail( domain.getEmail() );
        userUpdateResponse.setEnabled( domain.getEnabled() );
        userUpdateResponse.setFirstname( domain.getFirstname() );
        userUpdateResponse.setLastname( domain.getLastname() );
        userUpdateResponse.setDescription( domain.getDescription() );
        userUpdateResponse.setRating( domain.getRating() );
        userUpdateResponse.setContribute( domain.getContribute() );
        userUpdateResponse.setCountry( domain.getCountry() );
        userUpdateResponse.setAvatar( domain.getAvatar() );
        userUpdateResponse.setStatus( domain.getStatus() );
        userUpdateResponse.setLastActive( domain.getLastActive() );

        return userUpdateResponse;
    }
}
