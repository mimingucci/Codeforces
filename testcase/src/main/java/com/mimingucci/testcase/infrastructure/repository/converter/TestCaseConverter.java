package com.mimingucci.testcase.infrastructure.repository.converter;

import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.infrastructure.repository.entity.TestCaseEntity;
import org.mapstruct.Mapper;

@Mapper
public interface TestCaseConverter {
    TestCaseEntity toEntity(TestCase testCase);
    TestCase toModel(TestCaseEntity testCaseEntity);
}
