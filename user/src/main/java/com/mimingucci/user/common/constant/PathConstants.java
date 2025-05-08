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
    public static final String AVATAR = "/avatar";
    public static final String RATING = "/rating";
    public static final String SEARCH = "/search";
    public static final String BATCH = "/batch";

    public static final String CHAT = "/chat";
    public static final String ROOM = "/room";
    public static final String MESSAGE = "/message";
    public static final String API_V1_CHAT = API_V1 + CHAT;
    public static final String ROOM_ID = "/{roomId}";
}
