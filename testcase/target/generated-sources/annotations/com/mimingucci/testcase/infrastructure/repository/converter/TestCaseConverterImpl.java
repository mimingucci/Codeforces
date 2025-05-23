package com.mimingucci.testcase.infrastructure.repository.converter;

import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.infrastructure.repository.entity.TestCaseEntity;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:41:29+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class TestCaseConverterImpl implements TestCaseConverter {

    @Override
    public TestCaseEntity toEntity(TestCase testCase) {
        if ( testCase == null ) {
            return null;
        }

        TestCaseEntity testCaseEntity = new TestCaseEntity();

        testCaseEntity.setId( testCase.getId() );
        testCaseEntity.setInput( testCase.getInput() );
        testCaseEntity.setOutput( testCase.getOutput() );
        testCaseEntity.setProblem( testCase.getProblem() );

        return testCaseEntity;
    }

    @Override
    public TestCase toModel(TestCaseEntity testCaseEntity) {
        if ( testCaseEntity == null ) {
            return null;
        }

        TestCase testCase = new TestCase();

        testCase.setId( testCaseEntity.getId() );
        testCase.setInput( testCaseEntity.getInput() );
        testCase.setOutput( testCaseEntity.getOutput() );
        testCase.setProblem( testCaseEntity.getProblem() );

        return testCase;
    }
}
