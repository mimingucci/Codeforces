package com.mimingucci.user.common.constant;

public class ErrorMessageConstants {
    public static final String INTERNAL_SERVER = "Something went wrong with your request. Try again later!";

    public static final String ACCOUNT_DISABLED = "Account is disabled, try to active your account.";

    public static final String JWT_TOKEN_EXPIRED = "JWT token is expired or invalid";
    public static final String JWT_TOKEN_NOT_FOUND = "JWT token is not found, please provide your token to continue.";

    public static final String USER_NOT_FOUND = "User not found";
    public static final String USER_PROFILE_BLOCKED = "User profile blocked";

    public static final String EMAIL_NOT_FOUND = "Email not found";
    public static final String EMAIL_NOT_VALID = "Please enter a valid email address.";
    public static final String EMAIL_HAS_ALREADY_BEEN_TAKEN = "Email has already been taken.";
    public static final String BLANK_NAME = "What’s your name?";
    public static final String NAME_NOT_VALID = "Please enter a valid name.";

    public static final String STATE_NOT_FOUND = "State not found";

    public static final String COUNTRY_NOT_FOUND = "Country not found";
    public static final String COUNTRY_ALREADY_EXISTS = "Country already exists";

    public static final String NOTIFICATION_NOT_FOUND = "Notification not found";

    public static final String CHAT_ROOM_NOT_FOUND = "Chat room not found";
    public static final String CHAT_ROOM_INVALIDATED = "Chat room data is invalidated";
    public static final String USER_NOT_ADMIN = "User is not an admin of this chat room";
    public static final String USER_NOT_PARTICIPANT = "User is not a participant in this chat room";

    public static final String NOT_PERMISSION = "User can not have permission to do";

    public static final String UPLOAD_IMAGE_ERROR = "Something wrong happens when uploading image";
    public static final String CHAT_MESSAGE_NOT_FOUND = "Chat message not found";
}
