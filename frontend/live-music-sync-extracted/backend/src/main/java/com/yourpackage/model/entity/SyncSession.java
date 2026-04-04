package com.yourpackage.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.util.UUID;

@Data
@Entity
@Table(name = "sync_sessions")
public class SyncSession {
    @Id
    private String sessionId = UUID.randomUUID().toString();
    
    @Column(nullable = false)
    private Long hostId;
    
    private Long currentSongId;
    
    private boolean isPlaying;
    
    private Double currentTimestamp; // Seconds into the song
    
    private Instant lastUpdatedAt = Instant.now();
    
    private String blendPlaylistId; // Optional link to blend
}
