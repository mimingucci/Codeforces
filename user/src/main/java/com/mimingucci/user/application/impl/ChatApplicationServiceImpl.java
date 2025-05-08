package com.mimingucci.user.application.impl;

import com.mimingucci.user.application.ChatApplicationService;
import com.mimingucci.user.application.assembler.ChatAssembler;
import com.mimingucci.user.common.constant.ErrorMessageConstants;
import com.mimingucci.user.common.exception.ApiRequestException;
import com.mimingucci.user.common.util.JwtUtil;
import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.domain.service.chat.ChatService;
import com.mimingucci.user.presentation.dto.request.ChatRoomRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatApplicationServiceImpl implements ChatApplicationService {
    private final ChatAssembler chatAssembler;

    private final ChatService service;

    private final JwtUtil jwtUtil;

    @Override
    public ChatRoom createRoom(ChatRoomRequest room, HttpServletRequest request) {
        Long userId = null;
        try {
            userId = (Long) request.getAttribute("userId");
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        }
        if (userId == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_REQUEST);
        if (room.isGroupChat()) {
            if (room.getParticipants().isEmpty() || room.getName() == null) throw new ApiRequestException(ErrorMessageConstants.CHAT_ROOM_INVALIDATED, HttpStatus.BAD_REQUEST);
            return this.service.createGroupChat(room.getName(), userId, room.getParticipants());
        }

        if (room.getParticipants().size() != 1) throw new ApiRequestException(ErrorMessageConstants.CHAT_ROOM_INVALIDATED, HttpStatus.BAD_REQUEST);
        Long par = room.getParticipants().stream().toList().getFirst();
        if (Objects.equals(par, userId)) throw new ApiRequestException(ErrorMessageConstants.CHAT_ROOM_INVALIDATED, HttpStatus.BAD_REQUEST);
        return this.service.createDirectChat(userId, par);
    }

    @Override
    public List<ChatRoom> getRooms(HttpServletRequest request) {
        Long user = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            user = claims.get("id", Long.class);
            if (user == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_GATEWAY);
        }
        return this.service.getUserChatRooms(user);
    }

    @Override
    public PageableResponse<ChatMessage> getMessages(Long roomId, Pageable pageable, HttpServletRequest request) {
        Long userId = null;
        try {
            Claims claims = this.jwtUtil.extractClaimsFromHttpRequest(request);
            userId = claims.get("id", Long.class);
            if (userId == null) throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_GATEWAY);
        } catch (Exception e) {
            throw new ApiRequestException(ErrorMessageConstants.JWT_TOKEN_NOT_FOUND, HttpStatus.BAD_GATEWAY);
        }
        return this.chatAssembler.pageToResponse(this.service.getMessages(roomId, userId, pageable));
    }
}
