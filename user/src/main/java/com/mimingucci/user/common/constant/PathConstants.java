package com.mimingucci.user.common.constant;

public class PathConstants {
    public static final String API_V1 = "/api/v1";

    public static final String AUTH = "/auth";
    public static final String LOGIN = "/login";
    public static final String REGISTER = "/register";

    public static final String USER = "/user";
    public static final String API_V1_USER = API_V1 + USER;
    public static final String PROFILE = API_V1_USER + "/profile";
    public static final String UPDATE = PROFILE + "/update";
    public static final String USER_ID = "/{userId}";
    public static final String USERNAME = "/username";
    public static final String USER_USERNAME = "/{userName}";

    public static final String ALL = "/all";
    public static final String BAN = "/ban";
    public static final String ROLE = "/role";
}
