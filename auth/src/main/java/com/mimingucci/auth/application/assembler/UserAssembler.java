package com.mimingucci.auth.application.assembler;

import com.mimingucci.auth.common.enums.Role;
import com.mimingucci.auth.domain.model.User;
import com.mimingucci.auth.infrastructure.repository.entity.UserEntity;
import com.mimingucci.auth.infrastructure.util.IdGenerator;
import com.mimingucci.auth.presentation.dto.request.UserChangePasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserForgotPasswordRequest;
import com.mimingucci.auth.presentation.dto.request.UserLoginRequest;
import com.mimingucci.auth.presentation.dto.request.UserRegisterRequest;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserAssembler {
    UserAssembler INSTANCE = Mappers.getMapper(UserAssembler.class);

    User regToDomain(UserRegisterRequest request);

    User loginToDomain(UserLoginRequest request);

    UserEntity toEntity(User domain);

    User forgotToDomain(UserForgotPasswordRequest request);

    User changePasswordRequestToDomain(UserChangePasswordRequest request);

    default User registerToDomain(UserRegisterRequest request) {
        User user = this.regToDomain(request);
        user.setId(IdGenerator.INSTANCE.nextId());
        user.addRole(Role.USER);
        user.setEnabled(false);
        return user;
    }
}
