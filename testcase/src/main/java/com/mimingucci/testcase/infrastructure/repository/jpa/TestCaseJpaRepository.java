package com.mimingucci.testcase.infrastructure.repository.jpa;

import com.mimingucci.testcase.infrastructure.repository.entity.TestCaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TestCaseJpaRepository extends JpaRepository<TestCaseEntity, Long> {
    @Query("""
            SELECT testcase
            FROM TestCase testcase
            WHERE testcase.problem = :problemId
            """)
    List<TestCaseEntity> findAllByProblemId(@Param("problemId") Long problemId);
}
