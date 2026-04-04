package com.yourpackage.model.dto;

import lombok.Data;

@Data
public class SyncMessage {
    public enum MessageType {
        JOIN, PLAY, PAUSE, SEEK, SONG_CHANGE, VOTE_SKIP, REACTION
    }

    private MessageType type;
    private String sessionId;
    private Long userId;
    private Long songId;
    private Double timestamp;
    private String content; // E.g., Emoji for reactions
}
