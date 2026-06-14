import { Play, Pause, Sparkles, Heart, Mic2, Disc, Waves, Zap, Flame, Infinity, ChevronRight, Music } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export function MobileHomeView({
  songs,
  currentSong,
  isPlaying,
  onSongSelect,
  onProfileSelect,
  user,
  activeVibe,
  onVibeChange
}) {
  const [vibeToast, setVibeToast] = useState(null);
  
  const featuredSong = songs[0];
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Rise & Shine";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const vibes = [
    { id: 'energy', name: 'Pure Energy', genres: ['Trap', 'Electronic'], icon: <Zap size={13}/>, color: 'from-orange-500/20 to-red-500/20 border-orange-500/30 text-orange-400', activeBg: 'bg-gradient-to-r from-orange-500 to-red-500 text-white' },
    { id: 'flow', name: 'Flow State', genres: ['Chill', 'Relax'], icon: <Waves size={13}/>, color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400', activeBg: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' },
    { id: 'focus', name: 'Deep Focus', genres: ['Ambient', 'Chill'], icon: <Sparkles size={13}/>, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400', activeBg: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' },
    { id: 'midnight', name: 'Midnight', genres: ['Relax', 'Ambient'], icon: <Flame size={13}/>, color: 'from-purple-600/20 to-zinc-950/20 border-purple-500/30 text-purple-400', activeBg: 'bg-gradient-to-r from-purple-600 to-purple-900 text-white' },
    { id: 'infinity', name: 'Infinity', genres: ['Trap', 'Chill', 'Electronic', 'Ambient', 'Relax'], icon: <Infinity size={13}/>, color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400', activeBg: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white' }
  ];

  const getFilteredSongs = () => {
    if (!activeVibe) return songs;
    const currentVibeObj = vibes.find(v => v.id === activeVibe);
    if (!currentVibeObj) return songs;
    const filtered = songs.filter(s => currentVibeObj.genres.includes(s.genre));
    return filtered.length > 0 ? filtered : songs;
  };

  const getVibeGlow = () => {
    switch(activeVibe) {
      case 'energy': return 'bg-orange-500/10 shadow-[0_0_120px_rgba(249,115,22,0.15)]';
      case 'flow': return 'bg-blue-500/10 shadow-[0_0_120px_rgba(59,130,246,0.15)]';
      case 'focus': return 'bg-emerald-500/10 shadow-[0_0_120px_rgba(16,185,129,0.15)]';
      case 'midnight': return 'bg-purple-600/10 shadow-[0_0_120px_rgba(147,51,234,0.15)]';
      case 'infinity': return 'bg-pink-500/10 shadow-[0_0_120px_rgba(236,72,153,0.15)]';
      default: return 'bg-primary/10';
    }
  };

  const handleVibeChange = (vibeId) => {
    if (vibeId === null) {
      if (onVibeChange) onVibeChange(null);
      setVibeToast("Cleared vibe filter");
      return;
    }
    if (onVibeChange) onVibeChange(vibeId);
    const vibe = vibes.find(v => v.id === vibeId);
    setVibeToast(`Resonating: ${vibe?.name}`);
  };

  // Auto-clear toast after 2.5s
  useEffect(() => {
    if (vibeToast) {
      const timer = setTimeout(() => setVibeToast(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [vibeToast]);

  const currentVibeObj = activeVibe ? vibes.find(v => v.id === activeVibe) : null;
  const isWhite = document.body.classList.contains('white');

  return (
    <div className="flex-1 h-full bg-background overflow-y-auto no-scrollbar pb-[180px] pt-14 px-6 transition-colors duration-500 relative select-none">
      
      {/* Dynamic Floating Vibe Toast */}
      <AnimatePresence>
        {vibeToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -20, x: "-50%" }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className={`fixed top-6 left-1/2 z-[3000] px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 backdrop-blur-md transition-colors duration-300
              ${isWhite 
                ? 'bg-white/90 border-black/10 text-black shadow-black/5' 
                : 'bg-black/90 border-white/10 text-white shadow-black/40'
              }`}
          >
            <Sparkles size={12} className="text-primary animate-pulse flex-none" />
            <span>{vibeToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Background Ambience Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40 transition-all duration-1000 [.brutalist_&]:hidden">
        <div className={`absolute top-[-5%] right-[-10%] w-[100%] h-[40vh] blur-[130px] rounded-full transition-all duration-1000 ${getVibeGlow()}`} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[80%] h-[35vh] bg-purple-500/5 blur-[100px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col gap-8"
      >
        {/* Dynamic Header */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <span className="w-3.5 h-[1.5px] bg-primary rounded-full animate-pulse" />
                <span className="text-primary text-[9px] font-black uppercase tracking-[3px] opacity-80">{greeting()}</span>
             </div>
             <h1 className="text-foreground text-[32px] font-black tracking-[-1.5px] leading-none uppercase">
               {user?.username || "Vibe Guest"}
             </h1>
          </div>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={onProfileSelect}
            className="w-[50px] h-[50px] rounded-[20px] bg-foreground/5 border border-border p-1 flex items-center justify-center cursor-pointer active:bg-foreground/10 transition-colors"
          >
             <div className="w-full h-full rounded-[15px] bg-gradient-to-tr from-primary/10 to-purple-500/10 flex items-center justify-center border border-white/5 overflow-hidden">
                <img 
                   src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username || 'Guest'}`} 
                   className="w-[110%] h-[110%] object-cover opacity-80" 
                   alt="pfp"
                />
             </div>
          </motion.div>
        </motion.div>

        {/* Vibes / Filter Capsules */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
           <div className="flex items-center justify-between">
              <h3 className="text-foreground/30 text-[9px] font-black uppercase tracking-[3px]">Filter vibe mode</h3>
              {activeVibe ? (
                 <motion.span 
                   key={activeVibe}
                   initial={{ opacity: 0, x: 5 }}
                   animate={{ opacity: 0.6, x: 0 }}
                   className="text-primary text-[8px] font-black uppercase tracking-widest font-mono"
                 >
                    VIBE MATCH ACTIVE
                 </motion.span>
              ) : (
                 <span className="text-foreground/10 text-[8px] font-black uppercase tracking-widest font-mono">STANDBY</span>
              )}
           </div>
           
           <div className="flex gap-2.5 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleVibeChange(null)}
                className={`flex items-center gap-1.5 px-4 h-9 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 flex-none shadow-sm
                  ${!activeVibe 
                    ? 'bg-primary text-black border-transparent shadow-[0_4px_12px_rgba(255,255,255,0.05)] scale-102' 
                    : 'bg-foreground/[0.02] border-border/30 text-foreground/50 hover:text-foreground'
                  }`}
              >
                <Disc size={13}/>
                <span>All Vibes</span>
              </motion.button>

              {vibes.map((vibe) => {
                const isSelected = activeVibe === vibe.id;
                return (
                  <motion.button
                    key={vibe.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleVibeChange(vibe.id)}
                    className={`flex items-center gap-1.5 px-4 h-9 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all duration-300 flex-none shadow-sm
                      ${isSelected 
                        ? `${vibe.activeBg} border-transparent shadow-[0_4px_12px_rgba(255,255,255,0.05)] scale-102` 
                        : `bg-foreground/[0.02] border-border/30 text-foreground/50 hover:text-foreground`
                      }`}
                  >
                    {vibe.icon}
                    <span>{vibe.name}</span>
                  </motion.button>
                );
              })}
           </div>
        </motion.div>

        {/* 2x3 Quick Play Grid */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <h3 className="text-foreground/30 text-[9px] font-black uppercase tracking-[3px]">Quick play</h3>
          <div className="grid grid-cols-2 gap-3">
            {songs.slice(0, 6).map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div 
                  key={song.id}
                  onClick={() => onSongSelect(song)}
                  className={`flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border transition-all cursor-pointer active:scale-95
                    ${isCurrent 
                      ? 'bg-primary/10 border-primary/20 shadow-[0_4px_12px_rgba(255,255,255,0.04)]' 
                      : 'bg-foreground/[0.01] border-border/20 hover:bg-foreground/[0.03]'
                    }`}
                >
                  <div className="w-[42px] h-[42px] rounded-xl overflow-hidden shadow flex-none border border-white/5 relative">
                    <img src={song.imageUrl} className="w-full h-full object-cover" alt="" />
                    {isCurrent && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex items-end gap-[1px] h-3">
                          <div className="w-[1.5px] bg-primary animate-[equalizer_0.8s_infinite_0.1s]" />
                          <div className="w-[1.5px] bg-primary animate-[equalizer_0.8s_infinite_0.4s]" />
                          <div className="w-[1.5px] bg-primary animate-[equalizer_0.8s_infinite_0.2s]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-black leading-tight truncate uppercase ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                      {song.title}
                    </p>
                    <p className="text-[8px] font-bold opacity-30 tracking-wider truncate uppercase">
                      {song.artist}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Wide Spotlight Release / Vibe Resonance Station */}
        <motion.div variants={itemVariants} className="relative group overflow-visible">
           <div className="absolute -inset-2 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
           <AnimatePresence mode="wait">
             {currentVibeObj ? (
               <motion.div
                 key={`vibe-station-${activeVibe}`}
                 initial={{ opacity: 0, y: 10, scale: 0.98 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 exit={{ opacity: 0, y: -10, scale: 0.98 }}
                 transition={{ duration: 0.4 }}
                 className={`relative aspect-[21/9] w-full rounded-[24px] overflow-hidden border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] bg-gradient-to-r ${currentVibeObj.color.replace('/20', '/80')} cursor-pointer group active:scale-[0.99] transition-all`}
                 onClick={() => {
                   const filtered = getFilteredSongs();
                   if (filtered.length > 0) {
                     const randomSong = filtered[Math.floor(Math.random() * filtered.length)];
                     onSongSelect(randomSong);
                     setVibeToast(`Playing ${currentVibeObj.name} Mix`);
                   }
                 }}
               >
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none">
                   <Disc size={120} className="animate-spin-slow text-white" />
                 </div>

                 <div className="absolute inset-0 bg-black/45 p-5 flex flex-col justify-end gap-1">
                   <div className="flex items-center gap-1.5 mb-0.5">
                      <Waves size={11} className="text-white animate-pulse" />
                      <span className="text-white/60 text-[8px] font-black uppercase tracking-[3px]">Vibe Resonance Station</span>
                   </div>
                   <div className="flex items-center justify-between w-full relative z-10">
                      <div className="min-w-0 pr-4">
                         <h2 className="text-white text-[20px] font-black tracking-tight leading-none uppercase truncate">
                            {currentVibeObj.name} Station
                         </h2>
                         <p className="text-white/60 text-[9px] font-bold tracking-[2px] uppercase mt-0.5">
                            Play random {currentVibeObj.name} session
                         </p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-none animate-bounce-slow">
                         <Play size={13} fill="currentColor" className="ml-0.5" />
                      </div>
                   </div>
                 </div>
               </motion.div>
             ) : (
               <motion.div
                 key="default-spotlight"
                 initial={{ opacity: 0, scale: 0.98 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.98 }}
                 transition={{ duration: 0.4 }}
                 onClick={() => onSongSelect(featuredSong)}
                 className="relative aspect-[21/9] w-full rounded-[24px] overflow-hidden border border-border shadow-[0_15px_35px_rgba(0,0,0,0.5)] cursor-pointer group active:scale-[0.99] transition-all"
               >
                  <img 
                    src={featuredSong?.imageUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"} 
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.55] group-hover:scale-103 transition-all duration-[1200ms]" 
                    alt="" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 flex flex-col justify-end gap-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                         <Sparkles size={11} className="text-primary animate-pulse" />
                         <span className="text-white/40 text-[8px] font-black uppercase tracking-[3px]">Spotlight Choice</span>
                      </div>
                      <div className="flex items-center justify-between w-full">
                         <div className="min-w-0 pr-4">
                            <h2 className="text-white text-[20px] font-black tracking-tight leading-none uppercase truncate max-w-[200px]">
                               {featuredSong?.title || "Sonic Journey"}
                            </h2>
                            <p className="text-white/40 text-[9px] font-bold tracking-[2px] uppercase mt-0.5">
                               {featuredSong?.artist || "Ambient Artists"}
                            </p>
                         </div>
                         <div className="w-9 h-9 rounded-full bg-white text-black flex items-center justify-center shadow-lg transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-none">
                            {currentSong?.id === featuredSong?.id && isPlaying ? (
                               <Pause size={13} fill="currentColor" />
                            ) : (
                               <Play size={13} fill="currentColor" className="ml-0.5" />
                            )}
                         </div>
                      </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>

        {/* Curated Synergy Blends */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
           <h3 className="text-foreground/30 text-[9px] font-black uppercase tracking-[3px]">Curated Mixes</h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
              {[
                { title: "Lofi Synergy", desc: "Relaxing beats for deep focus.", gradient: "from-amber-600/30 to-rose-600/30", tracks: "12 tracks", label: "Mix 1", genre: "Chill" },
                { title: "Neon Pulse", desc: "Late night electronic synth waves.", gradient: "from-fuchsia-600/30 to-cyan-600/30", tracks: "8 tracks", label: "Mix 2", genre: "Electronic" },
                { title: "Eco Ambient", desc: "Organic beats and field stream sounds.", gradient: "from-green-600/30 to-teal-600/30", tracks: "15 tracks", label: "Mix 3", genre: "Ambient" }
              ].map((mix, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    const matchedSongs = songs.filter(s => s.genre === mix.genre);
                    if (matchedSongs.length > 0) {
                      onSongSelect(matchedSongs[0]);
                      setVibeToast(`Playing ${mix.title}`);
                    }
                  }}
                  className="flex flex-col gap-2 w-[140px] flex-none cursor-pointer group active:scale-98 transition-transform"
                >
                  <div className={`relative aspect-square w-full rounded-[24px] overflow-hidden border border-white/5 bg-gradient-to-tr ${mix.gradient} shadow-md p-4 flex flex-col justify-between`}>
                    <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />
                    {/* Vinyl Record peaking out */}
                    <div className="absolute -right-5 -bottom-5 w-24 h-24 rounded-full bg-black/40 opacity-25 border border-white/5 group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform" />
                    
                    <span className="relative z-10 text-[8px] font-black uppercase tracking-[2px] opacity-40">{mix.label}</span>
                    <div className="relative z-10 flex flex-col gap-0.5">
                      <h4 className="text-white text-sm font-black uppercase leading-tight truncate">{mix.title}</h4>
                      <span className="text-white/60 text-[8px] font-bold uppercase tracking-wider">{mix.tracks}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] opacity-40 font-bold leading-snug line-clamp-2 uppercase tracking-wide">{mix.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </motion.div>

        {/* Dynamic Activity Feed / Quick Access */}
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
           <h3 className="text-foreground/30 text-[9px] font-black uppercase tracking-[3px]">Recap / Queue</h3>
           
           <div className="flex flex-col gap-2.5">
              {getFilteredSongs().map((song, i) => {
                const isActiveTrack = currentSong?.id === song.id;
                return (
                  <motion.div 
                     key={song.id} 
                     whileTap={{ scale: 0.98 }}
                     onClick={() => onSongSelect(song)}
                     className={`flex items-center gap-3.5 p-2.5 rounded-2xl border group cursor-pointer transition-all duration-300 ${
                        isActiveTrack 
                          ? 'bg-primary/5 border-primary/20 shadow-sm' 
                          : 'bg-foreground/[0.01] border-border/20 hover:bg-foreground/[0.03]'
                     }`}
                  >
                     {/* Index Rank Number */}
                     <span className={`w-5 text-center text-sm font-black tracking-tighter flex-none font-mono ${isActiveTrack ? 'text-primary' : 'opacity-20'}`}>
                       {(i + 1).toString().padStart(2, '0')}
                     </span>

                     <div className="w-[50px] h-[50px] rounded-xl overflow-hidden shadow flex-none border border-white/5 relative">
                        <img src={song.imageUrl} className="w-full h-full object-cover" alt={song.title} />
                        {isActiveTrack && isPlaying && (
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="flex items-end gap-[1.5px] h-3">
                                 <div className="w-[2px] bg-primary animate-[equalizer_0.8s_infinite_0.1s]" />
                                 <div className="w-[2px] bg-primary animate-[equalizer_0.8s_infinite_0.4s]" />
                                 <div className="w-[2px] bg-primary animate-[equalizer_0.8s_infinite_0.2s]" />
                              </div>
                           </div>
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className={`font-black text-[13px] truncate leading-tight mb-0.5 uppercase ${isActiveTrack ? 'text-primary' : 'text-foreground'}`}>{song.title}</p>
                        <p className="opacity-30 text-[8.5px] font-bold uppercase tracking-[2px] truncate">{song.artist}</p>
                     </div>
                     <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                        isActiveTrack 
                          ? 'bg-primary/20 border-primary/30 text-primary' 
                          : 'opacity-35 group-hover:opacity-100 group-hover:bg-foreground/5 border-border text-foreground'
                     }`}>
                        {isActiveTrack && isPlaying ? (
                           <Pause size={13} className="fill-current" />
                        ) : (
                           <Play size={13} className="fill-current translate-x-0.5" />
                        )}
                     </div>
                  </motion.div>
                );
              })}
           </div>
        </motion.div>

        {/* QoL Lab Shortcuts */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
           <div 
             onClick={() => {
               // Activate flow state vibe as shortcut
               handleVibeChange('flow');
               setVibeToast("Quick-start Flow Session");
             }}
             className="p-6 rounded-[24px] bg-foreground/[0.01] border border-border flex flex-col gap-3 group hover:border-primary/20 transition-all duration-300 cursor-pointer active:scale-[0.98]"
           >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
                 <Mic2 size={16} className="text-primary" />
              </div>
              <div>
                 <h4 className="text-foreground text-[14px] font-black uppercase tracking-tight mb-0.5">AI Digging</h4>
                 <p className="text-foreground/45 text-[10px] uppercase tracking-wide leading-normal">Build custom session blends.</p>
              </div>
           </div>
           
           <div 
             onClick={() => {
               // Activate midnight vibes as shortcut
               handleVibeChange('midnight');
               setVibeToast("Quick-start Midnight Session");
             }}
             className="p-6 rounded-[24px] bg-foreground/[0.01] border border-border flex flex-col gap-3 group hover:border-primary/20 transition-all duration-300 cursor-pointer active:scale-[0.98]"
           >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-none">
                 <Music size={16} className="text-primary" />
              </div>
              <div>
                 <h4 className="text-foreground text-[14px] font-black uppercase tracking-tight mb-0.5">Vaults</h4>
                 <p className="text-foreground/45 text-[10px] uppercase tracking-wide leading-normal">Rediscover top tracks.</p>
              </div>
           </div>
        </motion.div>
      </motion.div>
      
      <style>{`
         @keyframes equalizer {
            0%, 100% { height: 30%; }
            50% { height: 100%; }
         }
      `}</style>
    </div>
  );
}
