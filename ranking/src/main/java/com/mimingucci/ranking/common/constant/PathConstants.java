package com.mimingucci.ranking.common.constant;

public class PathConstants {
    public static final String API_V1 = "/api/v1";
    public static final String RANKING = "/ranking";
    public static final String API_V1_RANKING = API_V1 + RANKING;

    public static final String CONTEST_SERVICE = "contest";
    public static final String CONTEST = "/contest";
    public static final String API_V1_CONTEST = API_V1 + CONTEST;
    public static final String REGISTRATION = "/registration";
    public static final String INVITATION = "/invitation";
    public static final String CONTEST_ID = "/{contestId}";
    public static final String CHECK = "/check";
    public static final String VIRTUAL_CONTEST = "/virtual";

    public static final String PROBLEM = "/problem";
    public static final String API_V1_PROBLEM = API_V1 + PROBLEM;
    public static final String PROBLEM_ID = "/{problemId}";
    public static final String ALL = "/all";

    public static final String USER_SERVICE = "user";
    public static final String USER = "/user";
    public static final String API_V1_USER = API_V1 + USER;
    public static final String PROFILE = API_V1_USER + "/profile";
    public static final String UPDATE = PROFILE + "/update";
    public static final String USER_ID = "/{userId}";
    public static final String RATING = "/rating";
}
