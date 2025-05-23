package com.mimingucci.auth.application.assembler;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.presentation.dto.request.UserChangePasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T21:54:43+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class UserAssemblerImpl implements UserAssembler {

    @Override
    public User regToDomain(UserRegisterRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( request.getEmail() );
        user.setUsername( request.getUsername() );
        user.setPassword( request.getPassword() );

        return user;
    }

    @Override
    public User loginToDomain(UserLoginRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( request.getEmail() );
        user.setPassword( request.getPassword() );

        return user;
    }

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
    public User forgotToDomain(UserForgotPasswordRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( request.getEmail() );

        return user;
    }

    @Override
    public User changePasswordRequestToDomain(UserChangePasswordRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setEmail( request.getEmail() );
        user.setPassword( request.getPassword() );

        return user;
    }
}
