package com.mimingucci.blog.infrastructure.repository.converter;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BlogConverter {
    BlogConverter INSTANCE = Mappers.getMapper(BlogConverter.class);

    BlogEntity toEntity(Blog domain);

    Blog toDomain(BlogEntity entity);
}
