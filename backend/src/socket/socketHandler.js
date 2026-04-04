/**
 * Socket.io Handler for Live Music Sync (Blend Feature)
 * Replicates the logic from the Java companion backend for real-time playlist synchronization.
 */
export const handleSocketEvents = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected to Sync Network:', socket.id);

    // ── JOIN BLEND ROOM ──
    socket.on('join-room', (roomId) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const numUsers = room ? room.size : 0;

      if (numUsers >= 2) {
        socket.emit('room-full', { roomId, message: "This Blend session is limited to 2 users." });
        return;
      }

      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room: ${roomId} (${numUsers + 1}/2)`);
      
      // Notify others in the room
      socket.to(roomId).emit('user-joined', { socketId: socket.id, count: numUsers + 1 });
    });

    // ── SYNC PLAYBACK STATE ──
    socket.on('sync-playback', (payload) => {
      const { roomId, ...syncData } = payload;
      socket.to(roomId).emit('playback-synced', syncData);
    });

    // ── SEND REACTION ──
    socket.on('send-reaction', (payload) => {
      const { roomId, reaction, user } = payload;
      // Broadcast to everyone in the room!
      io.in(roomId).emit('new-reaction', { reaction, user, timestamp: new Date() });
    });

    // ── SYNC QUEUE UPDATE (ADD/REMOVE) ──
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
