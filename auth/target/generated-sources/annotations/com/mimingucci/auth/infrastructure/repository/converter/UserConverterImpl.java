package com.mimingucci.auth.infrastructure.repository.converter;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-06-04T22:14:54+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class UserConverterImpl implements UserConverter {

    @Override
    public UserEntity toEntity(User domain) {
        if ( domain == null ) {
            return null;
        }

        UserEntity userEntity = new UserEntity();

        userEntity.setId( domain.getId() );
        userEntity.setEmail( domain.getEmail() );
        userEntity.setUsername( domain.getUsername() );
        userEntity.setPassword( domain.getPassword() );
        userEntity.setEnabled( domain.getEnabled() );
        userEntity.setForgotPasswordToken( domain.getForgotPasswordToken() );
        Set<Role> set = domain.getRoles();
        if ( set != null ) {
            userEntity.setRoles( new LinkedHashSet<Role>( set ) );
        }

        return userEntity;
    }

    @Override
    public User toDomain(UserEntity entity) {
        if ( entity == null ) {
            return null;
        }

        User user = new User();

        user.setId( entity.getId() );
        user.setEmail( entity.getEmail() );
        user.setUsername( entity.getUsername() );
        user.setPassword( entity.getPassword() );
        Set<Role> set = entity.getRoles();
        if ( set != null ) {
            user.setRoles( new LinkedHashSet<Role>( set ) );
        }
        user.setEnabled( entity.getEnabled() );
        user.setForgotPasswordToken( entity.getForgotPasswordToken() );

        return user;
    }
}
