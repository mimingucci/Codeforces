package com.mimingucci.user.infrastructure.repository.converter;

import com.mimingucci.user.common.enums.Role;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.infrastructure.repository.entity.UserEntity;
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
        Set<Role> set = domain.getRoles();
        if ( set != null ) {
            userEntity.setRoles( new LinkedHashSet<Role>( set ) );
        }
        userEntity.setCreatedAt( domain.getCreatedAt() );
        userEntity.setFirstname( domain.getFirstname() );
        userEntity.setLastname( domain.getLastname() );
        userEntity.setDescription( domain.getDescription() );
        userEntity.setRating( domain.getRating() );
        userEntity.setContribute( domain.getContribute() );
        userEntity.setAvatar( domain.getAvatar() );
        userEntity.setStatus( domain.getStatus() );
        userEntity.setLastActive( domain.getLastActive() );
        userEntity.setCountry( domain.getCountry() );

        return userEntity;
    }

    @Override
    public User toDomain(UserEntity entity) {
        if ( entity == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.id( entity.getId() );
        user.email( entity.getEmail() );
        user.password( entity.getPassword() );
        user.username( entity.getUsername() );
        Set<Role> set = entity.getRoles();
        if ( set != null ) {
            user.roles( new LinkedHashSet<Role>( set ) );
        }
        user.enabled( entity.getEnabled() );
        user.firstname( entity.getFirstname() );
        user.lastname( entity.getLastname() );
        user.description( entity.getDescription() );
        user.rating( entity.getRating() );
        user.contribute( entity.getContribute() );
        user.avatar( entity.getAvatar() );
        user.status( entity.getStatus() );
        user.lastActive( entity.getLastActive() );
        user.country( entity.getCountry() );
        user.createdAt( entity.getCreatedAt() );

        return user.build();
    }
}
