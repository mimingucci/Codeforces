package com.mimingucci.user.presentation.api.impl;

import com.mimingucci.user.application.ChatApplicationService;
import com.mimingucci.user.common.constant.PathConstants;
import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.presentation.api.ChatController;
import com.mimingucci.user.presentation.dto.request.ChatRoomRequest;
import com.mimingucci.user.presentation.dto.response.BaseResponse;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = PathConstants.API_V1_CHAT)
public class ChatControllerImpl implements ChatController {
    private final ChatApplicationService chatApplicationService;

    @PostMapping(path = PathConstants.ROOM)
    @Override
    public BaseResponse<ChatRoom> createRoom(@RequestBody ChatRoomRequest room, HttpServletRequest request) {
        return BaseResponse.success(this.chatApplicationService.createRoom(room, request));
    }

    @GetMapping(path = PathConstants.ROOM + PathConstants.USER)
    @Override
    public BaseResponse<List<ChatRoom>> getRooms(HttpServletRequest request) {
        return BaseResponse.success(this.chatApplicationService.getRooms(request));
    }

    @GetMapping(path = PathConstants.ROOM + PathConstants.ROOM_ID + PathConstants.MESSAGE)
    @Override
    public BaseResponse<PageableResponse<ChatMessage>> getMessages(@PathVariable("roomId") Long roomId, Pageable pageable, HttpServletRequest request) {
        return BaseResponse.success(this.chatApplicationService.getMessages(roomId, pageable, request));
    }
}
