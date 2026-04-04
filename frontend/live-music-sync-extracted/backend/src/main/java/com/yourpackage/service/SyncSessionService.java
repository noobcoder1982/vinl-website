package com.yourpackage.service;

import com.yourpackage.model.dto.SyncMessage;
import com.yourpackage.model.entity.SyncSession;
import com.yourpackage.repository.SyncSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class SyncSessionService {
    
    private final SyncSessionRepository sessionRepository;
    
    public SyncSession createSession(Long hostId, String blendPlaylistId) {
        SyncSession session = new SyncSession();
        session.setHostId(hostId);
        session.setBlendPlaylistId(blendPlaylistId);
        return sessionRepository.save(session);
    }

    public SyncMessage processMessage(String sessionId, SyncMessage message) {
        SyncSession session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (message.getUserId().equals(session.getHostId())) {
            if (message.getType() == SyncMessage.MessageType.PLAY) {
                session.setPlaying(true);
                session.setCurrentTimestamp(message.getTimestamp());
                session.setLastUpdatedAt(Instant.now());
            } else if (message.getType() == SyncMessage.MessageType.PAUSE) {
                session.setPlaying(false);
                session.setCurrentTimestamp(message.getTimestamp());
                session.setLastUpdatedAt(Instant.now());
            } else if (message.getType() == SyncMessage.MessageType.SEEK) {
                session.setCurrentTimestamp(message.getTimestamp());
                session.setLastUpdatedAt(Instant.now());
            }
            sessionRepository.save(session);
        }
        
        return message; 
    }
}
