package com.mimingucci.blog.infrastructure.repository.converter;

import com.mimingucci.blog.domain.model.Blog;
import com.mimingucci.blog.infrastructure.repository.entity.BlogEntity;
import com.mimingucci.blog.infrastructure.repository.entity.TagEntity;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BlogConverter {
    BlogConverter INSTANCE = Mappers.getMapper(BlogConverter.class);

    @Mapping(target = "tags", ignore = true)
    BlogEntity toEntity(Blog domain);

    @AfterMapping
    default void mapTags(@MappingTarget BlogEntity entity, Blog domain) {
        if (domain.getTags() != null) {
            Set<TagEntity> tagEntities = domain.getTags().stream()
                    .map(tagName -> {
                        TagEntity tag = new TagEntity();
                        tag.setName(tagName);
                        return tag;
                    })
                    .collect(Collectors.toSet());
            entity.setTags(tagEntities);
        }
    }

    @Mapping(target = "tags", expression = "java(mapTagsToStrings(entity))")
    Blog toDomain(BlogEntity entity);

    default List<String> mapTagsToStrings(BlogEntity entity) {
        if (entity.getTags() == null) {
            return null;
        }
        return entity.getTags().stream()
                .map(TagEntity::getName)
                .collect(Collectors.toList());
    }
}
