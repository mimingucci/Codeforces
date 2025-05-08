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

    @Query("SELECT cr FROM ChatRoomEntity cr JOIN cr.participants p WHERE p = :userId")
    List<ChatRoomEntity> findRoomsByParticipantId(@Param("userId") Long userId);

    @Query("SELECT cr FROM ChatRoomEntity cr JOIN cr.admins a WHERE a = :userId")
    List<ChatRoomEntity> findRoomsByAdminId(@Param("userId") Long userId);

    // Find direct chat between two users
    @Query("SELECT cr FROM ChatRoomEntity cr " +
            "WHERE cr.isGroupChat = false " +
            "AND EXISTS (SELECT p1 FROM cr.participants p1 WHERE p1 = :userOneId) " +
            "AND EXISTS (SELECT p2 FROM cr.participants p2 WHERE p2 = :userTwoId)")
    Optional<ChatRoomEntity> findDirectChatBetweenUsers(
            @Param("userOneId") Long userOneId,
            @Param("userTwoId") Long userTwoId
    );

    // These can remain unchanged
    List<ChatRoomEntity> findByIsGroupChatTrue();
    List<ChatRoomEntity> findByIsGroupChatFalse();
    List<ChatRoomEntity> findByNameContainingIgnoreCase(String name);

}
