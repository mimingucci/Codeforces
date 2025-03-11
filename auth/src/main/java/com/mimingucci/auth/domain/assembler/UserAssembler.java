package com.mimingucci.auth.domain.assembler;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.infrastructure.util.IdGenerator;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;


@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class UserAssembler {
    public User registerToDomain(UserRegisterRequest request) {
        User user = this.regToDomain(request);
        user.setId(IdGenerator.INSTANCE.nextId());
        user.addRole(Role.USER);
        user.setEnabled(false);
        return user;
    }

    public abstract User regToDomain(UserRegisterRequest request);

    public abstract User loginToDomain(UserLoginRequest request);

    public abstract UserEntity toEntity(User domain);

    public abstract User forgotToDomain(UserForgotPasswordRequest request);
}
