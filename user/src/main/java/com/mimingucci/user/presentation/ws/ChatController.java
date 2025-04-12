package com.mimingucci.user.presentation.ws;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.domain.service.chat.ChatService;
import com.mimingucci.user.presentation.dto.request.ChatMessageRequest;
import com.mimingucci.user.presentation.dto.request.MessageReactionRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate messagingTemplate;

    private final ChatService chatService;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest messageRequest,
                            SimpMessageHeaderAccessor headerAccessor) {
        // Get user ID from session
        Long senderId = (Long) headerAccessor.getSessionAttributes().get("userId");

        // Process and save the message
        ChatMessage message = chatService.sendMessage(
                messageRequest.getChat(),
                senderId,
                messageRequest.getContent()
        );

        // Send to room participants
        messagingTemplate.convertAndSend(
                "/topic/room." + messageRequest.getChat(),
                message
        );
    }

    @MessageMapping("/chat.typing")
    public void typing(@Payload Long roomId,
                       SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        // Broadcast typing status to room
        messagingTemplate.convertAndSend(
                "/topic/room." + roomId + ".typing",
                username + " is typing..."
        );
    }
}
