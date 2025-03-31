package com.mimingucci.testcase.application.assembler;

import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.presentation.dto.request.TestCaseCreateBatchRequest;
import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

import java.util.List;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public abstract class TestCaseAssembler {
    public abstract TestCase toDomain(TestCaseRequest request);

    public List<TestCase> toListDomain(TestCaseCreateBatchRequest batch) {
        List<TestCase> domains = batch.getData().stream().map(this::toDomain).toList();
        for (TestCase tc : domains) {
            tc.setProblem(batch.getProblem());
        }
        return domains;
    }

    public abstract TestCaseResponse toResponse(TestCase domain);
}
