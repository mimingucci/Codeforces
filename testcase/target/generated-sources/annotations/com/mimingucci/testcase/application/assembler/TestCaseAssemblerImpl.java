package com.mimingucci.testcase.application.assembler;

import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.presentation.dto.request.TestCaseRequest;
import com.mimingucci.testcase.presentation.dto.response.TestCaseResponse;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:41:29+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class TestCaseAssemblerImpl implements TestCaseAssembler {

    @Override
    public TestCase toDomain(TestCaseRequest request) {
        if ( request == null ) {
            return null;
        }

        TestCase testCase = new TestCase();

        testCase.setInput( request.getInput() );
        testCase.setOutput( request.getOutput() );
        testCase.setProblem( request.getProblem() );

        return testCase;
    }

    @Override
    public TestCaseResponse toResponse(TestCase domain) {
        if ( domain == null ) {
            return null;
        }

        TestCaseResponse testCaseResponse = new TestCaseResponse();

        testCaseResponse.setId( domain.getId() );
        testCaseResponse.setInput( domain.getInput() );
        testCaseResponse.setOutput( domain.getOutput() );
        testCaseResponse.setProblem( domain.getProblem() );

        return testCaseResponse;
    }
}
