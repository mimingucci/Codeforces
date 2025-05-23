package com.mimingucci.testcase.infrastructure.repository;

import com.mimingucci.testcase.common.constant.ErrorMessageConstants;
import com.mimingucci.testcase.common.exception.ApiRequestException;
import com.mimingucci.testcase.domain.model.TestCase;
import com.mimingucci.testcase.domain.repository.TestCaseRepository;
import com.mimingucci.testcase.infrastructure.repository.converter.TestCaseConverter;
import com.mimingucci.testcase.infrastructure.repository.entity.TestCaseEntity;
import com.mimingucci.testcase.infrastructure.repository.jpa.TestCaseJpaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class TestCaseRepositoryImpl implements TestCaseRepository {
    private final TestCaseJpaRepository testCaseJpaRepository;

    @Override
    public TestCase createTestCase(TestCase testCase) {
        TestCaseEntity entity = TestCaseConverter.INSTANCE.toEntity(testCase);
        return TestCaseConverter.INSTANCE.toModel(testCaseJpaRepository.save(entity));
    }

    @Override
    public List<TestCase> createTestCases(List<TestCase> testCases) {
        List<TestCaseEntity> entities = testCases.stream().map(TestCaseConverter.INSTANCE::toEntity).toList();
        return testCaseJpaRepository.saveAll(entities).stream().map(TestCaseConverter.INSTANCE::toModel).toList();
    }

    @Override
    public TestCase getTestCase(Long id) {
        TestCaseEntity entity = testCaseJpaRepository.findById(id).orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.TEST_CASE_NOT_FOUND, HttpStatus.NOT_FOUND));
        return TestCaseConverter.INSTANCE.toModel(entity);
    }

    @Override
    public List<TestCase> getTestCasesByProblemId(Long problemId) {
        List<TestCaseEntity> entities = testCaseJpaRepository.findAllByProblemId(problemId);
        return entities.stream().map(TestCaseConverter.INSTANCE::toModel).toList();
    }

    @Override
    public void deleteTestCase(Long id) {
        if (!testCaseJpaRepository.existsById(id)) {
            throw new ApiRequestException(ErrorMessageConstants.TEST_CASE_NOT_FOUND, HttpStatus.NOT_FOUND);
        }
        testCaseJpaRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteTestCasesByProblemId(Long problemId) {
        testCaseJpaRepository.deleteAllByProblemId(problemId);
    }

    @Override
    public TestCase updateTestCase(Long id, TestCase testCase) {
        TestCaseEntity entity = testCaseJpaRepository.findById(id).orElseThrow(() -> new ApiRequestException(ErrorMessageConstants.TEST_CASE_NOT_FOUND, HttpStatus.NOT_FOUND));
        if (testCase.getInput() != null) entity.setInput(testCase.getInput());
        if (testCase.getOutput() != null) entity.setOutput(testCase.getOutput());
        return TestCaseConverter.INSTANCE.toModel(testCaseJpaRepository.save(entity));
    }
}
