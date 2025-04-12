package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.infrastructure.repository.entity.ChatRoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomJpaRepository extends JpaRepository<ChatRoomEntity, Long> {

    // Find rooms where user is participant
    @Query("SELECT cr FROM ChatRoomEntity cr WHERE :userId MEMBER OF cr.participants")
    List<ChatRoomEntity> findRoomsByParticipantId(@Param("userId") Long userId);

    // Find rooms where user is admin
    @Query("SELECT cr FROM ChatRoomEntity cr WHERE :userId MEMBER OF cr.admins")
    List<ChatRoomEntity> findRoomsByAdminId(@Param("userId") Long userId);

    // Find group chats only
    List<ChatRoomEntity> findByIsGroupChatTrue();

    // Find direct (1-1) chats
    List<ChatRoomEntity> findByIsGroupChatFalse();

    // Find rooms by name (for group chats)
    List<ChatRoomEntity> findByNameContainingIgnoreCase(String name);

    // Find direct chat between two users
    @Query("SELECT cr FROM ChatRoomEntity cr WHERE cr.isGroupChat = false " +
            "AND :userOneId MEMBER OF cr.participants " +
            "AND :userTwoId MEMBER OF cr.participants")
    Optional<ChatRoomEntity> findDirectChatBetweenUsers(
            @Param("userOneId") Long userOneId,
            @Param("userTwoId") Long userTwoId
    );

}
