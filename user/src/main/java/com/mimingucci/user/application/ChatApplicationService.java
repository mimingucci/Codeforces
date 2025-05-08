package com.mimingucci.user.application;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.presentation.dto.request.ChatRoomRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ChatApplicationService {

    ChatRoom createRoom(ChatRoomRequest room, HttpServletRequest request);

    List<ChatRoom> getRooms(HttpServletRequest request);

    PageableResponse<ChatMessage> getMessages(Long roomId, Pageable pageable, HttpServletRequest request);
}
