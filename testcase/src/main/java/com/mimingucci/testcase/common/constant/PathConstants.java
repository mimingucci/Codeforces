package com.mimingucci.testcase.common.constant;

public class PathConstants {
    public static final String API_V1 = "/api/v1";

    public static final String PROBLEM_SERVICE = "problem";
    public static final String PROBLEM = "/problem";
    public static final String API_V1_PROBLEM = API_V1 + PROBLEM;
    public static final String PROBLEM_ID = "/{problemId}";
    public static final String ALL = "/all";

    public static final String CONTEST_SERVICE = "contest";
    public static final String CONTEST = "/contest";
    public static final String API_V1_CONTEST = API_V1 + CONTEST;
    public static final String CONTEST_ID = "/{contestId}";

    public static final String TEST_CASE = "/testcase";
    public static final String TEST_CASE_ID = "/{testCaseId}";
    public static final String API_V1_TEST_CASE = API_V1 + TEST_CASE;
    public static final String API_V1_TEST_CASE_PROBLEM = API_V1 + TEST_CASE + PROBLEM;
    public static final String BATCH = "/batch";
    public static final String DEV = "/dev";
}
