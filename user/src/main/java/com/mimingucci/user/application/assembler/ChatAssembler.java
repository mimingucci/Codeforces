package com.mimingucci.user.application.assembler;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.presentation.dto.request.ChatMessageRequest;
import com.mimingucci.user.presentation.dto.request.ChatRoomRequest;
import com.mimingucci.user.presentation.dto.response.PageableResponse;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;
import org.springframework.data.domain.Page;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface ChatAssembler {
    ChatRoom toRoom(ChatRoomRequest room);

    ChatMessage toMessage(ChatMessageRequest message);

    default PageableResponse<ChatMessage> pageToResponse(Page<ChatMessage> page) {
        PageableResponse<ChatMessage> response = new PageableResponse<>();
        response.setContent(page.getContent());
        response.setPageNumber(page.getNumber());
        response.setPageSize(page.getSize());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setFirst(page.isFirst());
        response.setLast(page.isLast());
        return response;
    }
}
