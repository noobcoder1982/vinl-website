import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Heart, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, ListMusic } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SYNCED_LYRICS } from "../data";

/* ──────────────────────────────────────────── 
    AUTHENTIC RETRO CASSETTE LOGIC 
   ──────────────────────────────────────────── */
function CassetteReel({ isPlaying, speed = 1 }) {
  // Logic: Spin forward when playing, slow backward rotation when paused to look "active"
  const rotation = isPlaying ? 360 : -360;
  const duration = isPlaying ? 4 / speed : 12;

  return (
    <div className="relative w-[54px] h-[54px] flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-2 border-black/80 bg-[#111] shadow-inner" />
      <motion.div 
        animate={{ rotate: rotation }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="w-[70%] h-[70%] rounded-full border-[3px] border-[#E5A632] flex items-center justify-center relative"
      >
        {[0, 90, 180, 270].map((deg) => (
          <div 
            key={deg} 
            className="absolute w-[2px] h-[10px] bg-[#E5A632]"
            style={{ transform: `rotate(${deg}deg) translateY(-8px)` }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function RetroCassette({ song, isPlaying, progress }) {
  return (
    <div className="relative w-[190px] h-[340px] bg-[#CFCFCF] rounded-lg shadow-2xl flex flex-col items-center overflow-hidden border-2 border-white/40">
       {/* Adaptive Shell Color */}
       <div 
         className="absolute inset-0 opacity-40 mix-blend-overlay transition-colors duration-1000"
         style={{ backgroundColor: song?.color || '#981D26' }}
       />

       {/* Label Section - Title & ID */}
       <div className="absolute left-[12px] top-4 bottom-4 flex flex-col items-center justify-between py-10 z-10 w-[35px]">
          <span className="text-black font-black text-[20px] uppercase tracking-tighter leading-none origin-center rotate-180" style={{ writingMode: 'vertical-rl' }}>ROCK II</span>
          
          {/* Printed Song Title (Smaller for long names) */}
          <div className="flex flex-col items-center gap-2 mt-4 flex-1">
             <span 
                className="text-black/60 font-bold text-[9px] uppercase tracking-[1px] origin-center rotate-180 truncate h-32" 
                style={{ writingMode: 'vertical-rl' }}
             >
                {song?.title || "Untitled Track"}
             </span>
          </div>

          {/* Micro Song Cover Insert */}
          <div className="w-[30px] h-[30px] rounded-sm overflow-hidden border border-black/20 shadow-sm mb-4">
             <img src={song?.imageUrl} className="w-full h-full object-cover" />
          </div>
       </div>

       {/* Orange Stripe (Right Side) */}
       <div className="absolute right-0 top-0 bottom-0 w-[55px] bg-[#E03C30] flex flex-col items-center justify-center py-10 gap-[2px] z-10">
          <div className="absolute left-1.5 top-0 bottom-0 w-[3px] bg-white/40" />
          <div className="absolute left-4 top-0 bottom-0 w-[4px] bg-white/20" />
          
          <span className="text-white/60 font-black text-[10px] uppercase tracking-[5px] origin-center rotate-180" style={{ writingMode: 'vertical-rl' }}>PLAYLIST</span>
       </div>

       {/* Centered Transparent Tape Window Cutout */}
       <div className="absolute left-[55px] right-[55px] top-[40px] bottom-[40px] bg-[#0A0A0A] rounded-[40px] border-4 border-black/40 overflow-hidden flex flex-col items-center justify-between py-10 shadow-[inset_0_10px_20px_rgba(0,0,0,1)] z-10">
          <CassetteReel isPlaying={isPlaying} />
          <CassetteReel isPlaying={isPlaying} />
       </div>
    </div>
  );
}

function DynamicWaveform({ isPlaying }) {
  return (
    <div className="flex items-center justify-center gap-1 h-12 w-full max-w-[200px] mt-6 px-10">
      {[...Array(16)].map((_, i) => (
        <motion.div
           key={i}
           animate={{ 
             height: isPlaying ? [10, 24, 12, 32, 10][(i % 5)] : 4 
           }}
           transition={{ 
             duration: 0.6, 
             repeat: Infinity, 
             delay: i * 0.05,
             ease: "easeInOut"
           }}
           className="w-1.5 rounded-full bg-white/40"
        />
      ))}
    </div>
  );
}

export function MobileCassettePlayer({
  song, isPlaying, onTogglePlay, onBack, onNext, onPrev,
  progress, currentTime, onSeek, themeColor, isLiked, onToggleLike,
  isShuffle, repeatMode, onToggleShuffle, onToggleRepeat
}) {
  const progressBarRef = useRef(null);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalSecs = song?.duration || 0;
  const elapsed = (progress / 100) * totalSecs;

  const handleSeekClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    onSeek(pct);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.4}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 150 || velocity.y > 500) {
          onBack();
        }
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 45, stiffness: 500, mass: 1 }}
      className="fixed inset-0 z-[200] flex flex-col bg-[#888] transition-all duration-500 overflow-hidden select-none touch-none"
    >
      {/* Brushed Titanium Shell Background */}
      <div className="absolute inset-0 bg-[#888] overflow-hidden grayscale">
         <div 
           className="absolute inset-0 opacity-40 mix-blend-multiply"
           style={{ 
             backgroundImage: `repeating-linear-gradient(90deg, transparent 0px, transparent 1px, #000 2px, transparent 3px)`,
             backgroundSize: '4px 100%' 
           }} 
         />
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-20" />
      </div>

      {/* Top Dismiss Handle */}
      <div className="relative z-50 flex flex-col items-center pt-5 pb-5">
         <div className="w-12 h-1.5 bg-white/30 rounded-full mb-8 shadow-sm" />
         
         <div className="flex flex-col items-center">
            <span className="text-white/20 text-[9px] font-black uppercase tracking-[4px]">Playing from</span>
            <span className="text-white text-[11px] font-bold uppercase tracking-tight">Cloud Vault</span>
         </div>
      </div>

      {/* Central Tape Deck area */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10 px-4">
         <div className="relative w-[300px] h-[460px] bg-black/80 rounded-[40px] overflow-hidden shadow-[inset_0_30px_80px_rgba(0,0,0,1),0_4px_12px_rgba(255,255,255,0.1)] border-4 border-white/10 flex flex-col items-center justify-center box-border p-1">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-white/10 z-50 pointer-events-none" />
            <div className="absolute top-0 bottom-0 left-[15%] w-px bg-white/10 z-50 pointer-events-none" />
            
            <RetroCassette song={song} isPlaying={isPlaying} progress={progress} />
            <DynamicWaveform isPlaying={isPlaying} />
         </div>
      </div>

      {/* Tactile Metal Controls Row */}
      <div className="relative z-20 flex flex-col items-center gap-10 pb-12 w-full max-w-[400px] mx-auto px-6">
        <div className="w-full flex items-center justify-between px-4 mb-4">
           <button onClick={onToggleShuffle} className={`p-4 transition-all ${isShuffle ? 'text-white' : 'text-white/20'}`}>
              <Shuffle size={18} />
           </button>

           <div className="flex gap-1.5 p-1.5 bg-black/40 rounded-xl shadow-inner border border-white/5">
              <button onClick={onPrev} className="w-14 h-12 bg-gradient-to-b from-[#eee] to-[#aaa] rounded-lg flex items-center justify-center shadow-lg active:translate-y-0.5 active:shadow-inner transition-all border border-black/10">
                 <SkipBack size={18} className="text-black/80" fill="currentColor" />
              </button>
              <button onClick={onTogglePlay} className="w-14 h-12 bg-gradient-to-b from-[#eee] to-[#aaa] rounded-lg flex items-center justify-center shadow-lg active:translate-y-0.5 active:shadow-inner transition-all border border-black/10">
                 {isPlaying ? <Pause size={18} className="text-black/80" fill="currentColor" /> : <Play size={18} className="text-black/80 ml-0.5" fill="currentColor" />}
              </button>
              <button onClick={onNext} className="w-14 h-12 bg-gradient-to-b from-[#eee] to-[#aaa] rounded-lg flex items-center justify-center shadow-lg active:translate-y-0.5 active:shadow-inner transition-all border border-black/10">
                 <SkipForward size={18} className="text-black/80" fill="currentColor" />
              </button>
           </div>

           <button onClick={onToggleRepeat} className={`p-4 transition-all ${repeatMode !== 'none' ? 'text-white' : 'text-white/20'}`}>
              <Repeat size={18} />
           </button>
        </div>

        {/* Metallics & Seekbar */}
        <div className="flex flex-col items-center text-center gap-1.5">
           <h2 className="text-white text-2xl font-black tracking-tight">{song?.title || "Wonderboy"}</h2>
           <p className="text-white/40 text-[13px] font-bold uppercase tracking-widest">{song?.artist || "Tenacious D"}</p>
           <div className="w-24 h-0.5 bg-white/20 mt-2" />
        </div>

        <div className="w-full flex flex-col gap-5 px-4 mt-4">
           <div className="flex justify-between items-end opacity-20 h-4">
              {[0,1,2,3,4,5,6,7,8,9].map(i => (
                <div key={i} className="flex flex-col items-center gap-1">
                   <span className="text-[8px] font-black">{i}</span>
                   <div className="w-[1px] h-3 bg-white" />
                </div>
              ))}
           </div>

           <div ref={progressBarRef} onClick={handleSeekClick} className="relative h-2 bg-black/60 rounded-full shadow-inner overflow-hidden border border-white/5">
              <motion.div className="absolute inset-y-0 left-0 bg-white/30" style={{ width: `${progress}%` }} />
              <motion.div className="absolute top-[-4px] bottom-[-4px] w-1.5 bg-orange-600 shadow-[0_0_10px_#ea580c] z-10" style={{ left: `${progress}%` }} />
           </div>

           <div className="flex justify-between text-[11px] font-black tabular-nums text-white/40">
              <span>{formatTime(elapsed)}</span>
              <span>{formatTime(totalSecs)}</span>
           </div>
        </div>

        {/* Utility row */}
        <div className="w-full flex justify-between px-8 mt-4 mb-4">
           <button onClick={onToggleLike} className="active:scale-125 transition-transform">
              <Heart size={22} className={isLiked ? "text-red-600 fill-red-600" : "text-white/20"} />
           </button>
           <button className="active:scale-125 transition-transform text-white/20">
              <ListMusic size={22} />
           </button>
        </div>
        <div className="pb-8" />
      </div>
    </motion.div>
  );
}
