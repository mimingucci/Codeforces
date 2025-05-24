package com.mimingucci.testcase.application.assembler;

import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.presentation.dto.request.TestCaseCreateBatchRequest;
import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING, unmappedSourcePolicy = ReportingPolicy.IGNORE, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TestCaseAssembler {
    TestCaseAssembler INSTANCE = Mappers.getMapper(TestCaseAssembler.class);

    TestCase toDomain(TestCaseRequest request);

    TestCaseResponse toResponse(TestCase domain);

    default List<TestCase> toListDomain(TestCaseCreateBatchRequest batch) {
        List<TestCase> domains = batch.getData().stream().map(this::toDomain).toList();
        for (TestCase tc : domains) {
            tc.setProblem(batch.getProblem());
        }
        return domains;
    }
}
