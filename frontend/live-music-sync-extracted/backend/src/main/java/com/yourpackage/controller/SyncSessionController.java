package com.yourpackage.controller;

import com.yourpackage.model.dto.SyncMessage;
import com.yourpackage.service.SyncSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class SyncSessionController {

    private final SimpMessageSendingOperations messagingTemplate;
    private final SyncSessionService syncSessionService;

    @MessageMapping("/sync/{sessionId}")
    public void handleSyncEvent(@DestinationVariable String sessionId, @Payload SyncMessage message) {
        // Validate and update session state in DB/Cache
        SyncMessage updatedMessage = syncSessionService.processMessage(sessionId, message);
        
        // Broadcast to all clients subscribed to /topic/session/{sessionId}
        messagingTemplate.convertAndSend("/topic/session/" + sessionId, updatedMessage);
    }
}
