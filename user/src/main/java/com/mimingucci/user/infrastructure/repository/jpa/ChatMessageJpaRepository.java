package com.mimingucci.user.infrastructure.repository.jpa;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.infrastructure.repository.entity.ChatMessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface ChatMessageJpaRepository extends JpaRepository<ChatMessageEntity, Long> {
    // Find latest messages for a chat (1-1 or group) with limit
    @Query("SELECT m FROM ChatMessageEntity m WHERE m.chat = :chatId ORDER BY m.createdAt DESC")
    List<ChatMessageEntity> findLatestMessagesByChatId(
            @Param("chatId") Long chatId,
            Pageable pageable
    );

    // Find messages before a certain timestamp (for pagination/loading more messages)
    @Query("SELECT m FROM ChatMessageEntity m WHERE m.chat = :chatId AND m.createdAt < :before ORDER BY m.createdAt DESC")
    List<ChatMessageEntity> findMessagesByChatIdBeforeTimestamp(
            @Param("chatId") Long chatId,
            @Param("before") Instant before,
            Pageable pageable
    );

//    // Find unread messages for a user in a chat
//    @Query("SELECT m FROM ChatMessageEntity m WHERE m.chat = :chatId AND :userId NOT MEMBER OF m.isRead ORDER BY m.createdAt DESC")
//    List<ChatMessageEntity> findUnreadMessagesByChatForUser(
//            @Param("chatId") Long chatId,
//            @Param("userId") Long userId
//    );

//    // Count unread messages for a user in a chat
//    @Query("SELECT COUNT(m) FROM ChatMessageEntity m WHERE m.chat = :chatId AND :userId NOT MEMBER OF m.isRead")
//    long countUnreadMessagesByChatForUser(
//            @Param("chatId") Long chatId,
//            @Param("userId") Long userId
//    );

    // Get latest N messages for a chat
    @Query(value = "SELECT * FROM message WHERE chat = :chatId ORDER BY created_at DESC LIMIT :limit",
            nativeQuery = true)
    List<ChatMessageEntity> findLatestMessages(
            @Param("chatId") Long chatId,
            @Param("limit") int limit
    );

    @Query("SELECT m FROM ChatMessageEntity m WHERE m.chat = :chatId ORDER BY m.createdAt DESC")
    Page<ChatMessageEntity> findPageMessages(
            @Param("chatId") Long chatId,
            Pageable pageable
    );
}
