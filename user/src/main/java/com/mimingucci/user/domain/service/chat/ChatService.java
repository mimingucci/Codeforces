package com.mimingucci.user.domain.service.chat;

import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.domain.model.User;
import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.domain.model.chat.Notification;
import com.mimingucci.user.domain.repository.ChatMessageRepository;
import com.mimingucci.user.domain.repository.ChatRoomRepository;
import com.mimingucci.user.domain.repository.NotificationRepository;
import com.mimingucci.user.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final ChatRoomRepository roomRepository;

    private final ChatMessageRepository messageRepository;

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    private final NotificationDispatcherService notificationDispatcher;

    // Chat Room Operations
    public ChatRoom createDirectChat(Long userId1, Long userId2) {
        // Validate users exist
        if (!userRepository.existsById(userId1) || !userRepository.existsById(userId2)) {
            throw new ApiRequestException(ErrorMessageConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
        }

        // Create chat room
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setGroupChat(false);
        chatRoom.setParticipants(Set.of(userId1, userId2));
        chatRoom.setAdmins(new HashSet<>());

        return roomRepository.create(chatRoom);
    }

    public ChatRoom createGroupChat(String name, Long creatorId, Set<Long> participantIds) {
        // Validate all users exist
        List<User> participants = userRepository.findByIds(participantIds);
        if (participants.size() != participantIds.size()) {
            throw new ApiRequestException("One or more users not found", HttpStatus.NOT_FOUND);
        }

        // Create group chat
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(name);
        chatRoom.setGroupChat(true);
        chatRoom.setParticipants(participantIds);
        chatRoom.setAdmins(Set.of(creatorId));

        return roomRepository.create(chatRoom);
    }

    public void addParticipants(Long roomId, Long adminId, Set<Long> newParticipantIds) {
        ChatRoom room = roomRepository.getById(roomId);

        // Verify admin permissions
        if (!room.getAdmins().contains(adminId)) {
            throw new ApiRequestException("User is not an admin", HttpStatus.FORBIDDEN);
        }

        // Add new participants
        room.getParticipants().addAll(newParticipantIds);
        roomRepository.update(roomId, room);

        // Send notifications to new participants
        notifyUsers(newParticipantIds, "You have been added to chat room: " + room.getName());
    }

    // Message Operations
    public ChatMessage sendMessage(Long roomId, Long senderId, String content) {
        // Verify sender is participant
        if (!roomRepository.isUserParticipant(roomId, senderId)) {
            throw new ApiRequestException("User is not a participant", HttpStatus.FORBIDDEN);
        }

        ChatMessage message = new ChatMessage();
        message.setChat(roomId);
        message.setAuthor(senderId);
        message.setContent(content);
        message.setCreatedAt(Instant.now());

        ChatMessage savedMessage = messageRepository.create(message);
        // Notify other participants
        ChatRoom room = roomRepository.getById(roomId);
        Set<Long> recipientIds = new HashSet<>(room.getParticipants());
        recipientIds.remove(senderId);
        List<Notification> notifications = notifyUsers(recipientIds, "New message in chat room: " + room.getName());

        // Notify other participants
        notifications.stream()
                .filter(notification -> !notification.getUserId().equals(senderId))
                .forEach(notificationDispatcher::dispatchNotification);

        return savedMessage;
    }

    public List<ChatMessage> getRoomMessages(Long roomId, Long userId, int limit) {
        // Verify user is participant
        if (!roomRepository.isUserParticipant(roomId, userId)) {
            throw new ApiRequestException("User is not a participant", HttpStatus.FORBIDDEN);
        }

        return messageRepository.getByRoom(roomId, limit, userId);
    }

    // Notification Operations
    private List<Notification> notifyUsers(Set<Long> userIds, String content) {
        return userIds.stream().map(userId -> {
            Notification notification = new Notification();
            notification.setUserId(userId);
            notification.setContent(content);
            notification.setRead(false);
            notification.setCreatedAt(Instant.now());
            return notificationRepository.create(notification);
        }).collect(Collectors.toList());
    }

    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserAndIsReadFalse(userId);
    }

    public void markNotificationAsRead(Long notificationId, Long userId) {
        Notification notification = new Notification();
        notification.setRead(true);
        notificationRepository.update(notificationId, notification);
    }

    // User's Chat Rooms
    public List<ChatRoom> getUserChatRooms(Long userId) {
        return roomRepository.getAllByUserId(userId);
    }

    // Admin Operations
    public void removeParticipant(Long roomId, Long adminId, Long participantId) {
        ChatRoom room = roomRepository.getById(roomId);

        // Verify admin permissions
        if (!room.getAdmins().contains(adminId)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.FORBIDDEN);
        }

        // Remove participant
        room.getParticipants().remove(participantId);
        roomRepository.update(roomId, room);
    }

    public void makeAdmin(Long roomId, Long currentAdminId, Long newAdminId) {
        ChatRoom room = roomRepository.getById(roomId);

        // Verify current admin permissions
        if (!room.getAdmins().contains(currentAdminId)) {
            throw new ApiRequestException(ErrorMessageConstants.NOT_PERMISSION, HttpStatus.FORBIDDEN);
        }

        // Add new admin
        room.getAdmins().add(newAdminId);
        roomRepository.update(roomId, room);
    }
}
