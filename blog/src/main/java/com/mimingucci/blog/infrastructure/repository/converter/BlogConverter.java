package com.mimingucci.blog.infrastructure.repository.converter;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface BlogConverter {
    BlogConverter INSTANCE = Mappers.getMapper(BlogConverter.class);

    BlogEntity toEntity(Blog domain);

    Blog toDomain(BlogEntity entity);
}
