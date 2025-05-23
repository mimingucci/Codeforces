package com.mimingucci.user.application.assembler;

import com.mimingucci.user.domain.model.chat.ChatMessage;
import com.mimingucci.user.domain.model.chat.ChatRoom;
import com.mimingucci.user.presentation.dto.request.ChatMessageRequest;
import com.mimingucci.user.presentation.dto.request.ChatRoomRequest;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-10T22:13:07+0700",
    comments = "version: 1.6.3, compiler: javac, environment: Java 21.0.6 (Amazon.com Inc.)"
)
@Component
public class ChatAssemblerImpl implements ChatAssembler {

    @Override
    public ChatRoom toRoom(ChatRoomRequest room) {
        if ( room == null ) {
            return null;
        }

        ChatRoom chatRoom = new ChatRoom();

        if ( room.getId() != null ) {
            chatRoom.setId( String.valueOf( room.getId() ) );
        }
        chatRoom.setName( room.getName() );
        Set<Long> set = room.getParticipants();
        if ( set != null ) {
            chatRoom.setParticipants( new LinkedHashSet<Long>( set ) );
        }
        Set<Long> set1 = room.getAdmins();
        if ( set1 != null ) {
            chatRoom.setAdmins( new LinkedHashSet<Long>( set1 ) );
        }
        chatRoom.setGroupChat( room.isGroupChat() );

        return chatRoom;
    }

    @Override
    public ChatMessage toMessage(ChatMessageRequest message) {
        if ( message == null ) {
            return null;
        }

        ChatMessage chatMessage = new ChatMessage();

        chatMessage.setId( message.getId() );
        chatMessage.setContent( message.getContent() );
        chatMessage.setAuthor( message.getAuthor() );
        chatMessage.setType( message.getType() );
        chatMessage.setChat( message.getChat() );
        chatMessage.setCreatedAt( message.getCreatedAt() );
        chatMessage.setUpdatedAt( message.getUpdatedAt() );
        Map<Long, ChatMessage.MessageReaction> map = message.getReactions();
        if ( map != null ) {
            chatMessage.setReactions( new LinkedHashMap<Long, ChatMessage.MessageReaction>( map ) );
        }
        Set<Long> set = message.getIsRead();
        if ( set != null ) {
            chatMessage.setIsRead( new LinkedHashSet<Long>( set ) );
        }

        return chatMessage;
    }
}
