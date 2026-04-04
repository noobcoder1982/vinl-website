import { useState, useEffect } from "react";
import { Sparkles, Users, Plus, Share2, Play, AudioLines, Zap, CheckCircle2, ChevronRight, UserPlus, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InviteModal } from "./InviteModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

/* ── REACTION SYSTEM ── */
function ReactionBubbles({ active }) {
  const [bubbles, setBubbles] = useState([]);
  const emojis = ["🔥", "❤️", "🤘", "🙌", "🎹", "✨", "🔊"];

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
      const x = Math.random() * 100;
      setBubbles(prev => [...prev, { id, emoji, x }]);
      setTimeout(() => setBubbles(prev => prev.filter(b => b.id !== id)), 3000);
    }, 800);
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="absolute inset-x-0 bottom-0 top-0 overflow-hidden pointer-events-none z-50">
      <AnimatePresence>
        {bubbles.map(b => (
          <motion.div
            key={b.id}
            initial={{ y: "100%", opacity: 0, scale: 0.5 }}
            animate={{ y: "-100%", opacity: [0, 1, 1, 0], scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute text-4xl"
            style={{ left: `${b.x}%` }}
          >
            {b.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function FloatingAvatars({ members }) {
  return (
    <div className="flex -space-x-3 mb-6">
      {members.map((m, i) => (
        <motion.div 
          key={m.id}
          initial={{ scale: 0, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`w-12 h-12 rounded-full border-4 border-[#0A0A0A] ${m.color} flex items-center justify-center font-black text-white shadow-xl relative group`}
        >
          {m.name.charAt(0)}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
             {m.name}
          </div>
          {m.role === "Host" && <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] border-2 border-[#0A0A0A]">👑</div>}
        </motion.div>
      ))}
    </div>
  );
}

export function BlendView({ user, songs, blendQueue, onUpdateQueue, onSongSelect, activeRoom, onJoinRoom, socket }) {
  const [stage, setStage] = useState(activeRoom ? "room" : "start");
  const [blendSongs, setBlendSongs] = useState([]);
  const [isHosting, setIsHosting] = useState(false);
  const [roomCode, setRoomCode] = useState(activeRoom || "");
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [remoteReactions, setRemoteReactions] = useState(false);

  useEffect(() => {
    if (activeRoom && socket) {
      socket.emit('join-room', activeRoom);
      setStage("room");
      setRoomCode(activeRoom);
      
      setMembers([{ id: user?._id || user?.id, name: user?.username || "You", color: "bg-indigo-500", role: "Host" }]);

      socket.on('user-joined', (data) => {
         setMembers(prev => [...prev.filter(m => m.id !== data.socketId), { id: data.socketId, name: "Teammate", color: "bg-purple-500", role: "Syncing..." }]);
      });

      socket.on('new-reaction', () => {
         setRemoteReactions(prev => !prev);
         setTimeout(() => setRemoteReactions(false), 3000);
      });

      return () => {
        socket.off('user-joined');
        socket.off('new-reaction');
      };
    }
  }, [activeRoom, socket]);

  const sendReaction = (type) => {
     if (socket && activeRoom) {
        setRemoteReactions(true);
        setTimeout(() => setRemoteReactions(false), 3000);
        socket.emit('send-reaction', { roomId: activeRoom, reaction: type, user: user?.username });
     }
  };

  const addToQueue = (song) => {
     const newQueue = [...blendQueue, song];
     onUpdateQueue(newQueue);
  };

  const startBlend = () => {
    setStage("creating");
    setTimeout(() => {
      const randomSongs = [...songs].sort(() => 0.5 - Math.random()).slice(0, 10);
      setBlendSongs(randomSongs);
      setStage("ready");
    }, 4500);
  };

  const hostSession = () => {
    const newRoom = Math.floor(100000 + Math.random() * 900000).toString();
    setIsHosting(true);
    setRoomCode(newRoom);
    onJoinRoom(newRoom);
    setMembers([
      { id: user?._id || user?.id, name: user?.username || "You", color: "bg-indigo-500", role: "Host" }
    ]);
    setStage("room");
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto no-scrollbar relative bg-[#020204]">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-indigo-900/30 via-transparent to-transparent pointer-events-none" />
      
      {stage === "room" && <ReactionBubbles active={remoteReactions} />}
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto w-full flex flex-col gap-10"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
            <Sparkles size={14} className="text-indigo-400" />
            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Experimental Feature</span>
          </div>
          <h1 className="text-white text-[48px] md:text-[64px] font-black tracking-tighter leading-[0.9]">
            AI Blend.
          </h1>
          <p className="text-white/40 text-[15px] md:text-[18px] font-medium max-w-xl">
             Mix your vibe with friends, or host a live session to listen together in one shared workspace.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === "start" && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div onClick={startBlend} className="group relative p-8 rounded-[40px] bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all cursor-pointer overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-[60px] group-hover:bg-indigo-600/20 transition-colors" />
                   <Sparkles size={32} className="text-indigo-400 mb-6 group-hover:scale-110 transition-transform" />
                   <h3 className="text-white text-2xl font-black mb-2">Discovery Blend</h3>
                   <p className="text-white/30 text-sm leading-relaxed mb-8">AI analyzes your library to find hidden gems and new arrivals that match your specific taste profile.</p>
                   <div className="flex items-center gap-2 text-white font-bold text-sm">
                      Create Now <ChevronRight size={16} />
                   </div>
                </div>

                <div onClick={hostSession} className="group relative p-8 rounded-[40px] bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 hover:border-white/20 transition-all cursor-pointer overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px]" />
                   <Users size={32} className="text-white mb-6 group-hover:scale-110 transition-transform" />
                   <h3 className="text-white text-2xl font-black mb-2">Host Session</h3>
                   <p className="text-white/40 text-sm leading-relaxed mb-8">Up to 2 friends can join your room. Listen to the same track, vote on skips, and build a live playlist together.</p>
                   <div className="flex items-center gap-2 text-white font-black text-[12px] uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all">
                      Start Room <AudioLines size={14} className="ml-1" />
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === "creating" && (
            <motion.div key="creating" className="flex flex-col items-center justify-center py-20 gap-8">
              <div className="relative w-48 h-48">
                 <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 rounded-full bg-indigo-600 blur-3xl" />
                 <div className="absolute inset-0 flex items-center justify-center">
                    <AudioLines size={64} className="text-indigo-400" />
                 </div>
              </div>
              <div className="text-center">
                 <h2 className="text-white text-2xl font-black">Building your Synergy...</h2>
                 <p className="text-white/30 text-sm mt-2">Connecting fingerprints across the sync network.</p>
              </div>
            </motion.div>
          )}

          {stage === "ready" && (
            <motion.div key="ready" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-10">
              <div className="p-10 rounded-[48px] bg-gradient-to-br from-indigo-600/30 to-purple-600/30 border border-white/10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden shadow-2xl">
                 <div className="relative w-48 h-48 rounded-[36px] overflow-hidden shadow-2xl flex-none">
                    <div className="absolute inset-0 grid grid-cols-2">
                       {blendSongs.slice(0, 4).map((s, i) => (
                          <img key={i} src={s.imageUrl} className="w-full h-full object-cover" />
                       ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                       <Sparkles size={48} className="text-white" />
                    </div>
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                       <CheckCircle2 size={18} className="text-green-400" />
                       <span className="text-green-400 text-xs font-black uppercase tracking-widest">Synergetics Resolved</span>
                    </div>
                    <h2 className="text-white text-5xl font-black mb-4 tracking-tighter">AI Blend Live.</h2>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                       <button onClick={() => onSongSelect(blendSongs[0])} className="px-8 py-4 bg-white text-black rounded-full font-black flex items-center gap-3">
                          <Play size={20} className="fill-black" /> START MIX
                       </button>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {stage === "room" && (
            <motion.div key="room" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row items-center justify-between p-10 rounded-[48px] bg-white/[0.03] border border-white/10 shadow-3xl gap-10 relative overflow-hidden">
                 <div className="absolute inset-0 bg-indigo-600/5 blur-[100px] pointer-events-none" />
                 
                 <div className="flex flex-col items-center md:items-start relative z-10">
                    <FloatingAvatars members={members} />
                    <h2 className="text-white text-4xl font-black tracking-tighter mb-2">{isHosting ? "Host Active" : "Synergy Session"}</h2>
                    <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Now
                       </span>
                    </div>
                 </div>

                 <div className="flex flex-col items-center md:items-end relative z-10">
                    <p className="text-white/20 text-[10px] font-black uppercase tracking-[4px] mb-4">Room Code</p>
                    <div className="flex gap-2">
                       {roomCode.split("").map((digit, i) => (
                          <div key={i} className="w-12 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                             {digit}
                          </div>
                       ))}
                    </div>
                    <button onClick={() => setShowInvite(true)} className="mt-6 text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       <Share2 size={14} /> Send Invite
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-white font-black uppercase tracking-[5px] text-[11px]">Synergetic Queue ({blendQueue.length})</h3>
                       <div className="flex items-center gap-2">
                          <Users size={14} className="text-white/20" />
                          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{members.length} Listening</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                       {blendQueue.length === 0 ? (
                          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] gap-4">
                             <Plus size={32} className="text-white/10" />
                             <p className="text-white/20 text-xs font-bold uppercase tracking-widest">Queue is empty.</p>
                          </div>
                       ) : (
                          blendQueue.map((song, i) => (
                             <motion.div key={i} whileHover={{ x: 10 }} className="flex items-center gap-6 p-5 rounded-[32px] bg-white/[0.03] border border-white/5 hover:bg-indigo-600/10 transition-all cursor-pointer">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl">
                                   <img src={song.imageUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 truncate">
                                   <h4 className="text-white font-black text-lg truncate uppercase tracking-tight">{song.title}</h4>
                                   <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{song.artist}</p>
                                </div>
                                <button onClick={() => onSongSelect(song)} className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
                                   <Play size={18} className="fill-black ml-0.5" />
                                </button>
                             </motion.div>
                          ))
                       )}

                       <div className="mt-6 border-t border-white/5 pt-6">
                          <p className="text-white/20 text-[10px] font-black uppercase tracking-[4px] mb-4">Add to Session</p>
                          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto no-scrollbar">
                             {songs.slice(0, 10).map((song, i) => (
                                <button key={i} onClick={() => addToQueue(song)} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors text-left group">
                                   <img src={song.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                                   <div className="flex-1 truncate">
                                      <p className="text-white text-xs font-bold truncate">{song.title}</p>
                                      <p className="text-white/30 text-[9px] font-medium uppercase tracking-widest">{song.artist}</p>
                                   </div>
                                   <Plus size={16} className="text-white/10 group-hover:text-indigo-400 transition-colors" />
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col gap-6">
                    <h3 className="text-white font-black uppercase tracking-[5px] text-[11px] px-2">Social Hub</h3>
                    <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col gap-6">
                       <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Tap to React</p>
                          <div className="flex justify-center gap-3">
                             {["🔥", "🤘", "❤️"].map(e => (
                               <button key={e} onClick={() => sendReaction(e)} className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 transition-all text-2xl flex items-center justify-center">
                                 {e}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <button onClick={() => setStage("start")} className="w-fit self-center px-12 py-4 rounded-full border border-white/10 bg-white/5 text-white/40 font-black uppercase tracking-[4px] hover:text-red-500 hover:border-red-500/50 transition-all mt-10">
                Terminate Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} roomCode={roomCode || "000000"} />
    </div>
  );
}
