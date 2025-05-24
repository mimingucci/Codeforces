package com.mimingucci.testcase.infrastructure.repository.converter;

import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.infrastructure.repository.entity.TestCaseEntity;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TestCaseConverter {
    TestCaseConverter INSTANCE = Mappers.getMapper(TestCaseConverter.class);

    TestCaseEntity toEntity(TestCase testCase);

    TestCase toModel(TestCaseEntity testCaseEntity);
}
