/**
 * Socket.io Handler for Live Music Sync (Blend Feature)
 * Replicates the logic from the Java companion backend for real-time playlist synchronization.
 */
export const handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to Sync Network:', socket.id);

    // ── JOIN BLEND ROOM ──
    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId}`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', { socketId: socket.id });
    });

    // ── SYNC PLAYBACK STATE ──
    // payload: { roomId, songId, isPlaying, currentTime, timestamp, senderId }
    socket.on('sync-playback', (payload) => {
      const { roomId, ...syncData } = payload;
      
      // Broadcast the sync event to everyone in the room except the sender
      socket.to(roomId).emit('playback-synced', syncData);
    });

    // ── SYNC QUEUE UPDATE (VOTE/ADD/REMOVE) ──
    socket.on('sync-queue', (payload) => {
      const { roomId, queue } = payload;
      socket.to(roomId).emit('queue-synced', queue);
    });

    // ── CHAT / MESSAGE ──
    socket.on('send-message', (payload) => {
      const { roomId, message, user } = payload;
      socket.to(roomId).emit('new-message', { message, user, timestamp: new Date() });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected from Sync Network:', socket.id);
    });
  });
};
