import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Heart, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, ListMusic, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MobilePlaylistSheet } from "./MobilePlaylistSheet";

/* ──────────────────────────────────────────── 
    ULTRA-RESPONSIVE CLEAR-SERIES CASSETTE
   ──────────────────────────────────────────── */
function CassetteReel({ isPlaying, speed = 1 }) {
  const rotation = isPlaying ? 360 : -360;
  const duration = isPlaying ? 4 / speed : 12;

  return (
    <div className="relative w-[clamp(44px,11vw,56px)] h-[clamp(44px,11vw,56px)] flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border-[3px] border-black/90 bg-[#111] shadow-[inset_0_4px_10px_rgba(0,0,0,1)]" />
      <motion.div 
        animate={{ rotate: rotation }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="w-[72%] h-[72%] aspect-square rounded-full border-[clamp(3px,1vw,5px)] border-[#E5A632] flex items-center justify-center relative"
      >
        <div className="w-[4px] h-[4px] bg-white rounded-full z-20 shadow-glow" />
        {[0, 120, 240].map((deg) => (
          <div 
            key={deg} 
            className="absolute w-[3px] h-[8px] bg-[#E5A632] rounded-full"
            style={{ transform: `rotate(${deg}deg) translateY(-6px)` }}
          />
        ))}
      </motion.div>
    </div>
  );
}

function RetroCassette({ song, isPlaying, progress }) {
  return (
    <motion.div 
      animate={isPlaying ? { scale: [1, 1.002, 1] } : {}}
      transition={{ duration: 0.15, repeat: Infinity }}
      className="relative w-[clamp(170px,45vw,220px)] h-[clamp(280px,75vw,360px)] bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex flex-col items-center overflow-hidden border border-white/20 box-border transform-gpu"
    >
       <div 
         className="absolute inset-0 opacity-40 transition-colors duration-2000"
         style={{ backgroundColor: song?.color || '#981D26' }}
       />
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

       {/* Side Info */}
       <div className="absolute left-[clamp(8px,2vw,14px)] top-6 bottom-6 flex flex-col items-center justify-between z-10 w-[clamp(24px,6vw,32px)]">
          <span className="text-white/40 font-black text-[clamp(14px,4vw,18px)] uppercase tracking-[-1px] italic leading-none origin-center rotate-180" style={{ writingMode: 'vertical-rl' }}>VINL. PRO-SERIES</span>
          
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-8">
             <div className="w-[clamp(24px,5vw,30px)] h-[clamp(24px,5vw,30px)] rounded-full overflow-hidden border border-white/20 shadow-glow">
                <img src={song?.imageUrl} className="w-full h-full object-cover" />
             </div>
             <span 
                className="text-white font-black text-[clamp(8px,2vw,10px)] uppercase tracking-[3px] origin-center rotate-180 truncate h-20" 
                style={{ writingMode: 'vertical-rl' }}
             >
                {song?.title || "RAW SOURCE"}
             </span>
          </div>
       </div>

       {/* Signal Strip */}
       <div className="absolute right-0 top-0 bottom-0 w-[clamp(35px,10vw,50px)] bg-[#E03C30]/5 backdrop-blur-md flex flex-col items-center justify-center py-10 z-10 border-l border-white/5">
          <span className="text-[#E03C30] font-black text-[clamp(8px,2vw,10px)] uppercase tracking-[6px] origin-center rotate-180 drop-shadow-glow" style={{ writingMode: 'vertical-rl' }}>DIGITAL SIGNAL</span>
       </div>

       {/* Center Reel Window */}
       <div className="absolute left-[clamp(40px,12vw,55px)] right-[clamp(40px,12vw,55px)] top-[40px] bottom-[40px] bg-black/70 rounded-[clamp(30px,8vw,48px)] border-2 border-white/5 overflow-hidden flex flex-col items-center justify-between py-[clamp(15%,5vh,20%)] shadow-[inset_0_20px_40px_rgba(0,0,0,0.8)] z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/5 opacity-50" />
          <CassetteReel isPlaying={isPlaying} />
          <div className="h-6 w-2 bg-white/10 rounded-full animate-pulse" />
          <CassetteReel isPlaying={isPlaying} />
       </div>
    </motion.div>
  );
}

export function MobileCassettePlayer({
  song, isPlaying, onTogglePlay, onBack, onNext, onPrev,
  progress, currentTime, onSeek, themeColor, isLiked, onToggleLike,
  isShuffle, repeatMode, onToggleShuffle, onToggleRepeat, songs = []
}) {
  const progressBarRef = useRef(null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalSecs = song?.duration || 0;
  const elapsed = (progress / 100) * totalSecs;

  const handlePointerMove = (e) => {
     if (!isDragging || !progressBarRef.current) return;
     const rect = progressBarRef.current.getBoundingClientRect();
     const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
     const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
     onSeek(pct);
  };

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 100 || velocity.y > 500) {
          onBack();
        }
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 35, stiffness: 400, mass: 0.8 }}
      className="fixed inset-0 z-[200] flex flex-col bg-[#020202] transition-colors duration-500 overflow-hidden select-none touch-none"
    >
      {/* Dynamic Shell Texture */}
      <div className="absolute inset-0 bg-[#050505]">
         <div 
           className="absolute inset-0 opacity-40"
           style={{ 
             backgroundImage: `radial-gradient(circle at 50% 50%, #111 0%, transparent 1.5px)`,
             backgroundSize: '24px 24px' 
           }} 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black" />
      </div>

      {/* FIXED TOP HEADER */}
      <div className="relative z-50 flex flex-col items-center pt-6 pb-2 flex-none">
         <div className="w-16 h-1 bg-white/20 rounded-full mb-6 shadow-glow" />
         <div className="flex flex-col items-center opacity-60">
            <span className="text-white text-[10px] font-black uppercase tracking-[6px] italic">VINL. HIGH-FIDELITY</span>
         </div>
      </div>

      {/* CENTRAL SYNERGY CORE - Responsive Centering */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 min-h-0">
         <div className="relative w-full max-w-[360px] aspect-[4/5] max-h-[70vh] bg-gradient-to-b from-[#0e0e0e] to-[#000] rounded-[64px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,1),inset_0_2px_10px_rgba(255,255,255,0.02)] border border-white/5 flex flex-col items-center justify-center p-4 mb-4 md:mb-8">
            <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-white/[0.03] via-transparent to-transparent pointer-events-none z-50" />
            <RetroCassette song={song} isPlaying={isPlaying} progress={progress} />
         </div>
         
         <div className="flex flex-col items-center text-center gap-2 mb-2">
            <h2 className="text-white text-[clamp(24px,7vw,36px)] font-black tracking-tighter leading-none uppercase italic drop-shadow-lg truncate max-w-[90vw]">{song?.title || "RAW SOURCE"}</h2>
            <p className="text-white/30 text-[clamp(10px,3vw,13px)] font-black uppercase tracking-[6px] leading-none">{song?.artist || "AUDIO ARCHITECT"}</p>
         </div>
      </div>

      {/* MECHANICAL COMMAND CENTER - Tall Aspect Ratio Optimized */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[420px] mx-auto px-8 gap-6 md:gap-10 pb-8 md:pb-16 flex-none">
        
        {/* Precision Central Grid */}
        <div className="w-full grid grid-cols-3 items-center">
           <div className="flex justify-start">
              <button 
                onClick={onToggleShuffle} 
                className={`w-12 h-12 flex items-center justify-center transition-all active:scale-90 ${isShuffle ? 'text-white' : 'text-white/20'}`}
              >
                 <Shuffle size={20} className={isShuffle ? "drop-shadow-glow" : ""} />
              </button>
           </div>

           <div className="flex justify-center">
              <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] rounded-[32px] border border-white/5 shadow-inner">
                 <motion.button 
                   whileTap={{ scale: 0.92 }} 
                   onClick={onPrev} 
                   className="w-[clamp(48px,12vw,56px)] h-[clamp(440x,11vw,50px)] bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl active:bg-white/10 transition-all"
                 >
                    <SkipBack size={18} className="fill-current" />
                 </motion.button>
                 
                 <motion.button 
                   whileTap={{ scale: 0.92 }} 
                   onClick={onTogglePlay} 
                   className="w-[clamp(64px,16vw,76px)] h-[clamp(54px,13vw,62px)] bg-white text-black flex items-center justify-center rounded-[32px] shadow-glow transition-all"
                 >
                    {isPlaying ? <Pause size={28} className="fill-current" /> : <Play size={28} className="fill-current ml-1" />}
                 </motion.button>
                 
                 <motion.button 
                   whileTap={{ scale: 0.92 }} 
                   onClick={onNext} 
                   className="w-[clamp(48px,12vw,56px)] h-[clamp(440x,11vw,50px)] bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl active:bg-white/10 transition-all"
                 >
                    <SkipForward size={18} className="fill-current" />
                 </motion.button>
              </div>
           </div>

           <div className="flex justify-end">
              <button 
                onClick={onToggleRepeat} 
                className={`w-12 h-12 flex items-center justify-center transition-all active:scale-90 ${repeatMode !== 'none' ? 'text-white' : 'text-white/20'}`}
              >
                 <Repeat size={20} className={repeatMode !== 'none' ? "drop-shadow-glow" : ""} />
              </button>
           </div>
        </div>

        {/* DRAGGABLE KINETIC RAIL */}
        <div className="w-full flex flex-col gap-4">
           {/* Draggable Rail */}
           <div 
             ref={progressBarRef} 
             onPointerDown={(e) => { setIsDragging(true); handlePointerMove(e); e.target.setPointerCapture(e.pointerId); }}
             onPointerMove={handlePointerMove}
             onPointerUp={(e) => { setIsDragging(false); e.target.releasePointerCapture(e.pointerId); }}
             className="relative h-[clamp(6px,1.5vw,10px)] bg-white/5 rounded-full shadow-inner border border-white/5 cursor-pointer touch-none"
           >
              <div 
                className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_15px_white] transition-all" 
                style={{ width: `${Math.min(progress, 100)}%` }} 
              />
              <motion.div 
                animate={isDragging ? { scale: 1.5 } : { scale: 1 }}
                className="absolute top-[-10px] bottom-[-10px] w-1.5 bg-[#E03C30] shadow-[0_0_20px_#E03C30] z-20 rounded-full -translate-x-1/2" 
                style={{ left: `${Math.min(progress, 100)}%` }} 
              />
           </div>

           <div className="flex justify-between text-[11px] font-black tabular-nums text-white/40 tracking-[4px]">
              <span>{formatTime(Math.min(elapsed, totalSecs))}</span>
              <span>{formatTime(totalSecs)}</span>
           </div>
        </div>

        {/* UTILITY RACK */}
        <div className="w-full flex justify-between px-8">
           <button onClick={onToggleLike} className="p-3 active:scale-150 transition-all text-white/20 hover:text-red-500">
              <Heart size={24} className={isLiked ? "text-red-600 fill-shadow-glow fill-current" : ""} />
           </button>
           <button onClick={() => setIsPlaylistOpen(true)} className="p-3 active:scale-150 transition-all text-white/20 hover:text-white">
              <ListMusic size={24} />
           </button>
           <button onClick={onBack} className="p-3 active:scale-150 transition-all text-white/20 hover:text-white">
              <X size={24} />
           </button>
        </div>
      </div>

      <MobilePlaylistSheet 
        isOpen={isPlaylistOpen} 
        onClose={() => setIsPlaylistOpen(false)} 
        queue={songs.slice(0, 5)}
        onSongSelect={(s) => { onSongSelect(s); setIsPlaylistOpen(false); }}
        songs={songs}
      />
    </motion.div>
  );
}
