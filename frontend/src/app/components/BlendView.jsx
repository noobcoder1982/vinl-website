import { useState, useEffect } from "react";
import { Sparkles, Users, Plus, Share2, Play, AudioLines, Zap, CheckCircle2, ChevronRight, UserPlus, Mail, Eye, EyeOff, RefreshCw, Smartphone, Monitor, ChevronLeft, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { InviteModal } from "./InviteModal";
import { inviteService } from "../services/inviteService";

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

function FloatingAvatars({ members, onSelect }) {
  return (
    <div className="flex -space-x-3 mb-6">
      {members.map((m, i) => (
        <motion.div 
          key={m.id}
          initial={{ scale: 0, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          onClick={() => onSelect(m)}
          className={`w-12 h-12 rounded-full border-4 border-background ${m.color} flex items-center justify-center font-black text-white shadow-xl relative group cursor-pointer hover:z-20 hover:scale-110 transition-all`}
        >
          {m.name.charAt(0)}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
             {m.name}
          </div>
          {m.role === "Host" && <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-[10px] border-2 border-background">👑</div>}
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
  const [inputCode, setInputCode] = useState(["", "", "", "", "", ""]);
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [members, setMembers] = useState([]);
  const [showInvite, setShowInvite] = useState(false);
  const [remoteReactions, setRemoteReactions] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [invitedUsers, setInvitedUsers] = useState([]); // Track who we've invited this session

  useEffect(() => {
    if (activeRoom && socket) {
      socket.emit('join-room', activeRoom);
      setStage("room");
      setRoomCode(activeRoom);
      
      setMembers([{ id: user?._id || user?.id, username: user?.username, name: user?.username || "You", color: "bg-indigo-500", role: "Host" }]);

      socket.on('user-joined', (data) => {
         setMembers(prev => [...prev.filter(m => m.id !== data.socketId), { id: data.socketId, username: data.username, name: data.username || "Teammate", color: "bg-purple-500", role: "Syncing..." }]);
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

  const handleFollowRequest = async (targetUser) => {
     if (!targetUser.username) return;
     const res = await inviteService.sendInvite(targetUser.username, null, 'follow');
     if (res.success) {
        setInvitedUsers(prev => [...prev, targetUser.username]);
        setTimeout(() => setSelectedUser(null), 1500);
     }
  };

  const addToQueue = (song) => {
     const newQueue = [...blendQueue, song];
     onUpdateQueue(newQueue);
  };

  const generateCode = () => {
     const code = Math.floor(100000 + Math.random() * 900000).toString();
     setInputCode(code.split(""));
  };

  const handleCodeInput = (index, value) => {
    if (value.length > 1) value = value[0];
    const newCode = [...inputCode];
    newCode[index] = value;
    setInputCode(newCode);
    
    // Auto focus next input
    if (value !== "" && index < 5) {
       document.getElementById(`code-input-${index + 1}`).focus();
    }
  };

  const joinSession = () => {
     const code = inputCode.join("");
     if (code.length === 6) {
        onJoinRoom(code);
     }
  };

  const hostSession = () => {
    const newRoom = Math.floor(100000 + Math.random() * 900000).toString();
    setIsHosting(true);
    setRoomCode(newRoom);
    onJoinRoom(newRoom);
    setMembers([
      { id: user?._id || user?.id, username: user?.username, name: user?.username || "You", color: "bg-indigo-500", role: "Host" }
    ]);
    setStage("room");
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto no-scrollbar relative bg-background transition-colors duration-500">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
      
      {stage === "room" && <ReactionBubbles active={remoteReactions} />}
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-4xl mx-auto w-full flex flex-col gap-10"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit">
            <Sparkles size={14} className="text-primary" />
            <span className="text-primary text-[10px] font-black uppercase tracking-widest">Synergy Protocol v2</span>
          </div>
          <h1 className="text-foreground text-[48px] md:text-[64px] font-black tracking-tighter leading-[0.9]">
            Blend Room.
          </h1>
          <p className="text-foreground/40 text-[15px] md:text-[18px] font-medium max-w-xl">
             Connect your listening stream with friends to build the ultimate collaborative workspace.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === "start" && (
            <motion.div 
              key="start"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Host Card */}
                <div className="p-8 rounded-[48px] bg-primary/5 border border-border flex flex-col gap-8 relative overflow-hidden group brutalist:rounded-lg">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] group-hover:bg-primary/20 transition-all theme-spotlight" />
                   <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-xl brutalist:rounded-lg">
                      <Zap size={24} />
                   </div>
                   <div>
                      <h3 className="text-foreground text-2xl font-black mb-2 uppercase tracking-tighter italic">Spawn Room</h3>
                      <p className="text-foreground/40 text-sm leading-relaxed">Instantly generate a 6-digit synchronization code and start a live collaborative session.</p>
                   </div>
                   <button onClick={hostSession} className="mt-4 w-full py-5 bg-foreground text-background rounded-[24px] font-black text-xs uppercase tracking-[3px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl brutalist:rounded-lg">
                      Generate Code & Start
                   </button>
                </div>

                {/* Join Card */}
                <div className="p-8 rounded-[48px] bg-card border border-border flex flex-col gap-8 relative overflow-hidden group brutalist:rounded-lg">
                   <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-foreground/5 border border-border flex items-center justify-center text-foreground/40 group-hover:text-foreground transition-colors brutalist:rounded-lg">
                         <Monitor size={24} />
                      </div>
                      <button onClick={() => setIsCodeVisible(!isCodeVisible)} className="text-foreground/20 hover:text-foreground transition-colors p-2">
                         {isCodeVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                   </div>
                   <div>
                      <h3 className="text-foreground text-2xl font-black mb-4 uppercase tracking-tighter italic">Sync Interface</h3>
                      <div className="flex gap-2 mb-2">
                         {inputCode.map((digit, i) => (
                            <input 
                               key={i}
                               id={`code-input-${i}`}
                               type={isCodeVisible ? "text" : "password"}
                               value={digit}
                               onChange={(e) => handleCodeInput(i, e.target.value)}
                               className="w-full h-14 rounded-xl bg-background border border-border text-center text-xl font-black text-foreground focus:bg-muted focus:border-primary outline-none transition-all placeholder-foreground/5 brutalist:rounded-lg"
                               placeholder="·"
                            />
                         ))}
                      </div>
                      <div className="flex justify-between items-center px-1">
                         <p className="text-[9px] font-black text-foreground/20 uppercase tracking-widest">Enter 6-digit sync code</p>
                         <button onClick={generateCode} className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 hover:text-foreground transition-colors">
                            <RefreshCw size={10} /> Randomize
                         </button>
                      </div>
                   </div>
                   <button onClick={joinSession} className="mt-2 w-full py-5 bg-muted border border-border text-foreground rounded-[24px] font-black text-xs uppercase tracking-[3px] hover:bg-foreground hover:text-background transition-all active:scale-95 brutalist:rounded-lg">
                      Join Stream
                   </button>
                </div>
              </div>
              
              <div className="p-8 rounded-[40px] border border-border bg-card flex items-center justify-between brutalist:rounded-lg shadow-sm">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center brutalist:rounded-lg">
                       <Sparkles size={24} className="text-primary" />
                    </div>
                    <div>
                       <h4 className="text-foreground font-black uppercase tracking-tight italic">AI Synergy Discovery</h4>
                       <p className="text-foreground/20 text-xs mt-1">Cross-reference your library with global trends to find matches.</p>
                    </div>
                 </div>
                 <button className="px-6 py-3 rounded-2xl bg-muted text-foreground/40 font-black text-[10px] uppercase tracking-widest border border-border hover:text-foreground hover:border-foreground/20 transition-all brutalist:rounded-lg">
                    Explore Now
                 </button>
              </div>
            </motion.div>
          )}

          {stage === "room" && (
            <motion.div key="room" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-8 relative">
              
              {/* User Selection Popover */}
              <AnimatePresence>
                {selectedUser && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.9, y: 10 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.9, y: 10 }}
                     className="absolute top-20 left-10 z-[60] p-6 rounded-[32px] bg-card text-foreground shadow-2xl flex flex-col gap-4 border border-border brutalist:rounded-lg"
                   >
                      <div className="flex items-center gap-4">
                         <div className={`w-12 h-12 rounded-full ${selectedUser.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                            {selectedUser.name.charAt(0)}
                         </div>
                         <div>
                            <h4 className="font-black text-lg uppercase tracking-tight italic">@{selectedUser.username || "teammate"}</h4>
                            <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest">{selectedUser.role}</p>
                         </div>
                         <button onClick={() => setSelectedUser(null)} className="ml-2 p-2 hover:bg-foreground/5 rounded-full"><X size={16} /></button>
                      </div>
                      
                      {selectedUser.username !== user?.username && (
                         <button 
                           onClick={() => handleFollowRequest(selectedUser)}
                           disabled={invitedUsers.includes(selectedUser.username)}
                           className={`w-full py-3 rounded-2xl font-black text-[10px] uppercase tracking-[2px] transition-all flex items-center justify-center gap-2 ${invitedUsers.includes(selectedUser.username) ? 'bg-green-500 text-white' : 'bg-foreground text-background hover:bg-primary'} brutalist:rounded-lg`}
                         >
                            {invitedUsers.includes(selectedUser.username) ? <Check size={14} /> : <UserPlus size={14} />}
                            {invitedUsers.includes(selectedUser.username) ? 'Invited' : 'Follow User'}
                         </button>
                      )}
                   </motion.div>
                )}
              </AnimatePresence>

              <div className="flex flex-col md:flex-row items-center justify-between p-10 rounded-[48px] bg-card border border-border shadow-3xl gap-10 relative overflow-hidden brutalist:rounded-lg">
                 <div className="absolute inset-0 bg-primary/5 blur-[100px] pointer-events-none theme-spotlight" />
                 
                 <div className="flex flex-col items-center md:items-start relative z-10">
                    <FloatingAvatars members={members} onSelect={setSelectedUser} />
                    <h2 className="text-foreground text-4xl font-black tracking-tighter mb-2 italic">{isHosting ? "Host Active" : "Synergy Session"}</h2>
                    <div className="flex items-center gap-3">
                       <span className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live Now
                       </span>
                    </div>
                 </div>

                 <div className="flex flex-col items-center md:items-end relative z-10">
                    <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[4px] mb-4">Room Code</p>
                    <div className="flex gap-2">
                       {roomCode.split("").map((digit, i) => (
                          <motion.div 
                             key={i} 
                             initial={{ scale: 0.8 }}
                             animate={{ scale: 1 }}
                             className="w-12 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center text-foreground text-2xl font-black shadow-lg brutalist:rounded-lg"
                          >
                             {digit}
                          </motion.div>
                       ))}
                    </div>
                    <button onClick={() => setShowInvite(true)} className="mt-6 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:text-foreground transition-colors">
                       <Share2 size={14} /> Share Invite Link
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-4">
                       <h3 className="text-foreground font-black uppercase tracking-[5px] text-[11px]">Synergetic Queue ({blendQueue.length})</h3>
                       <div className="flex items-center gap-2">
                          <Users size={14} className="text-foreground/20" />
                          <span className="text-foreground/20 text-[10px] font-black uppercase tracking-widest">{members.length} Listening</span>
                       </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                       {blendQueue.length === 0 ? (
                          <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[32px] gap-4 brutalist:rounded-lg">
                             <Plus size={32} className="text-foreground/10" />
                             <p className="text-foreground/20 text-xs font-bold uppercase tracking-widest">Queue is empty. Mix it up!</p>
                          </div>
                       ) : (
                          blendQueue.map((song, i) => (
                             <motion.div 
                               key={i} 
                               whileHover={{ x: 10 }} 
                               className="group flex items-center gap-6 p-5 rounded-[32px] bg-card border border-border/50 hover:bg-muted transition-all cursor-pointer relative brutalist:rounded-lg"
                             >
                                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl brutalist:rounded-lg border border-border">
                                   <img src={song.imageUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 truncate">
                                   <h4 className="text-foreground font-black text-lg truncate uppercase tracking-tight italic">{song.title}</h4>
                                   <p className="text-foreground/20 text-[10px] font-bold uppercase tracking-widest">{song.artist}</p>
                                </div>
                                <button onClick={() => onSongSelect(song)} className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center shadow-xl active:scale-90 transition-all brutalist:rounded-lg">
                                   <Play size={18} className="fill-current ml-0.5" />
                                </button>
                             </motion.div>
                          ))
                       )}

                       <div className="mt-6 border-t border-border pt-6">
                          <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[4px] mb-4">Master Selection</p>
                          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto no-scrollbar">
                             {songs.slice(0, 50).map((song, i) => (
                                <button key={i} onClick={() => addToQueue(song)} className="flex items-center gap-4 p-4 rounded-[28px] hover:bg-muted transition-colors text-left group brutalist:rounded-lg">
                                   <img src={song.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-lg border border-border" />
                                   <div className="flex-1 truncate">
                                      <p className="text-foreground text-sm font-bold truncate">{song.title}</p>
                                      <p className="text-foreground/30 text-[9px] font-medium uppercase tracking-widest">{song.artist}</p>
                                   </div>
                                   <Plus size={18} className="text-foreground/10 group-hover:text-primary transition-colors" />
                                </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex flex-col gap-6">
                    <h3 className="text-foreground font-black uppercase tracking-[5px] text-[11px] px-2">Live Hub</h3>
                    <div className="flex-1 bg-card border border-border rounded-[40px] p-6 flex flex-col gap-6 brutalist:rounded-lg shadow-sm">
                       <div className="flex flex-col gap-4">
                          <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest">Connected Streams</p>
                          {members.map(m => (
                             <div key={m.id} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full ${m.color} flex items-center justify-center text-[10px] font-black text-white`}>{m.name.charAt(0)}</div>
                                <span className="text-foreground/60 text-xs font-bold truncate">{m.name}</span>
                             </div>
                          ))}
                       </div>
                       
                       <div className="mt-auto pt-6 border-t border-border space-y-4">
                          <p className="text-[10px] font-black text-foreground/20 uppercase tracking-widest text-center">Tap to React</p>
                          <div className="flex justify-center gap-3">
                             {["🔥", "🤘", "❤️", "⚡"].map(e => (
                               <button 
                                 key={e} 
                                 onClick={() => sendReaction(e)} 
                                 className="w-12 h-12 rounded-2xl bg-muted hover:bg-foreground hover:text-background transition-all text-2xl flex items-center justify-center hover:scale-110 active:scale-95 brutalist:rounded-lg"
                               >
                                 {e}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => setStage("start")} 
                className="w-fit self-center px-12 py-4 rounded-full border border-border bg-card text-foreground/40 font-black uppercase tracking-[4px] hover:text-destructive hover:border-destructive/50 transition-all mt-10 active:scale-95 flex items-center gap-2 brutalist:rounded-lg"
              >
                <ChevronLeft size={16} /> Leave Synergy
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <InviteModal isOpen={showInvite} onClose={() => setShowInvite(false)} roomCode={roomCode || "000000"} />
    </div>
  );
}
