package com.mimingucci.user.application.assembler;

import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.presentation.dto.request.UserUpdateRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import com.mimingucci.user.presentation.dto.response.UserGetResponse;
import com.mimingucci.user.presentation.dto.response.UserUpdateResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface UserAssembler {
    UserAssembler INSTANCE = Mappers.getMapper(UserAssembler.class);

    User regToDomain(UserUpdateRequest request);

    UserGetResponse toGetResponse(User domain);

    UserUpdateResponse toUpdateResponse(User domain);

    default PageableResponse<UserGetResponse> pageToResponse(Page<User> page) {
        PageableResponse<UserGetResponse> response = new PageableResponse<>();
        response.setContent(page.getContent().stream().map(this::toGetResponse).toList());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}

