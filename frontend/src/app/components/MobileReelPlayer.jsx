import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Heart, MessageSquare, Headphones, Play, Pause } from "lucide-react";

/* ── REEL COMPONENT ── */
function Reel({ isPlaying, progress, reverse = false }) {
  const rotation = useRef(0);
  const rafRef = useRef(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const spin = () => {
      rotation.current += reverse ? -2 : 2;
      setAngle(rotation.current);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, reverse]);

  return (
    <div className="relative w-[140px] h-[140px] rounded-full bg-[#e8e3d9] shadow-inner flex items-center justify-center overflow-hidden border border-black/5">
      <motion.div 
        className="absolute inset-[15%] rounded-full bg-[#0a0a0a]"
        style={{ rotate: angle }}
      >
        {/* Reel Cutouts */}
        {[0, 120, 240].map((deg) => (
          <div 
             key={deg} 
             className="absolute w-[40%] h-[30%] bg-[#e8e3d9] top-[-5%] left-[30%]"
             style={{ transformOrigin: "50% 180%", transform: `rotate(${deg}deg)`, borderRadius: '10px' }}
          />
        ))}
        {/* Center Hub */}
        <div className="absolute inset-[35%] bg-[#e8e3d9] rounded-full shadow-lg border-2 border-[#0a0a0a] flex items-center justify-center">
            <div className="w-[40%] h-[40%] bg-[#0a0a0a] rounded-full" />
        </div>
      </motion.div>
      {/* Tape Fill Ring (Static) */}
      <div 
         className="absolute inset-0 rounded-full border-[15px] border-[#0a0a0a] opacity-80" 
         style={{ clipPath: reverse ? 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' : 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' }}
      />
    </div>
  );
}

/* ── DIAL COMPONENT ── */
function Dial({ isPlaying, onClick }) {
  const rotation = useRef(0);
  const rafRef = useRef(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const spin = () => {
      rotation.current += 1;
      setAngle(rotation.current);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  return (
    <div onClick={onClick} className="w-[160px] h-[160px] bg-[#c3bcaf] rounded-[30px] flex items-center justify-center shadow-inner cursor-pointer active:scale-95 transition-transform">
      <motion.div 
         className="w-[140px] h-[140px] bg-[#0a0a0a] rounded-full shadow-2xl relative flex items-center justify-center"
         style={{ rotate: angle }}
      >
         <div className="absolute top-4 w-1.5 h-6 bg-white/80 rounded-full" />
         <div className="w-[40px] h-[40px] rounded-full bg-[#d6ccbd] border-4 border-black box-content" />
      </motion.div>
    </div>
  );
}

/* ── FULLSCREEN F4 TAPE PLAYER ── */
export function MobileReelPlayer({
  song, isPlaying, onTogglePlay, onBack, onNext, onPrev,
  progress, currentTime, onSeek, isLiked, onToggleLike
}) {
  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalSecs = song?.duration || 0;
  const elapsed = (progress / 100) * totalSecs;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 26, stiffness: 300 }}
      className="fixed inset-0 z-[200] flex flex-col pt-12 pb-8 px-6"
      style={{ backgroundColor: "#d6ccbd", color: "#000" }} // Warm beige background
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[64px] font-black tracking-tighter leading-none text-[#0a0a0a]">F4</h1>
        <button onClick={onBack} className="p-2 active:scale-90">
          <ChevronDown size={32} color="#0a0a0a" strokeWidth={3} />
        </button>
      </div>

      {/* Spools */}
      <div className="flex justify-between items-center px-2 mb-10">
         <Reel isPlaying={isPlaying} progress={progress} reverse={false} />
         <Reel isPlaying={isPlaying} progress={progress} reverse={true} />
      </div>

      {/* Metadata */}
      <div className="text-center mb-8 relative px-10">
         <button className="absolute left-0 top-1">
           <MessageSquare size={24} color="#0a0a0a" strokeWidth={2.5} />
         </button>
         <h2 className="text-xl font-black text-[#0a0a0a] tracking-tight truncate">{song?.title || "Unknown Tape"}</h2>
         <p className="text-sm font-bold text-[#0a0a0a]/40 mt-1">{song?.artist || "Analog Signal"}</p>
         <button onClick={onToggleLike} className="absolute right-0 top-1">
           <Heart size={24} className={isLiked ? "fill-[#0a0a0a] text-[#0a0a0a]" : "text-[#0a0a0a]"} strokeWidth={2.5} />
         </button>
      </div>

      {/* Abstract Waveform & Scrubber */}
      <div className="w-full h-32 relative mb-4">
         {/* Fake Waveform Lines */}
         <div className="absolute inset-0 flex items-center justify-between px-2 opacity-10">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="w-[2px] bg-black rounded-full" style={{ height: `${Math.max(20, Math.random() * 100)}%` }} />
            ))}
         </div>
         {/* Vertical Playhead Cursor */}
         <div className="absolute top-0 bottom-0 w-[1px] bg-black left-1/2 -translate-x-1/2">
            <div className="absolute top-1/2 -translate-y-1/2 -left-[6px] w-[6px] h-10 bg-black rounded-l-md" />
            <div className="absolute top-1/2 -translate-y-1/2 -left-[8px] w-full h-[1px] bg-black scale-x-150" />
         </div>
      </div>

      {/* Time & Device Info */}
      <div className="flex justify-between items-center px-2 mb-auto font-black text-[13px] text-[#0a0a0a]">
         <span>{formatTime(elapsed)}</span>
         <div className="flex items-center gap-2 opacity-30">
            <Headphones size={16} />
            <span className="uppercase tracking-widest text-[10px]">airpods</span>
         </div>
         <span>{formatTime(totalSecs)}</span>
      </div>

      {/* Bottom Interface (Dials) */}
      <div className="flex justify-between items-center mt-6">
         <Dial isPlaying={isPlaying} onClick={onPrev} />
         <Dial isPlaying={isPlaying} onClick={onTogglePlay} />
      </div>

      {/* Tap Overlay for Playback */}
      <div className="absolute bottom-[200px] left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 hover:opacity-10 pointer-events-none transition-opacity">
         Tap dials to Play / Skip
      </div>

    </motion.div>
  );
}

/* ── F4 MOBILE PLAYER BAR ── */
export function MobileReelBar({ song, isPlaying, onTogglePlay, onOpenFullscreen }) {
  return (
    <div 
      onClick={onOpenFullscreen}
      className="h-[80px] w-full bg-[#d6ccbd] border-t-4 border-[#0a0a0a] flex items-center px-4 relative cursor-pointer"
    >
       <div className="absolute left-0 top-0 bottom-0 w-12 bg-[#0a0a0a] flex flex-col justify-between py-2 items-center">
          <div className="w-1 h-3 bg-white/20 rounded-full" />
          <div className="w-1 h-3 bg-white/20 rounded-full" />
          <div className="w-1 h-3 bg-white/20 rounded-full" />
       </div>
       
       <div className="ml-16 flex-1 min-w-0 pr-4">
          <h3 className="text-[#0a0a0a] font-black text-lg leading-tight truncate uppercase tracking-tighter">{song?.title || "F4 ANALOG"}</h3>
          <p className="text-[#0a0a0a]/50 font-bold text-[10px] uppercase tracking-widest">Deck 1 Active</p>
       </div>

       <button 
         onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
         className="w-12 h-12 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center bg-transparent active:scale-90"
       >
          {isPlaying ? <Pause size={20} fill="#0a0a0a" color="#0a0a0a" /> : <Play size={20} fill="#0a0a0a" color="#0a0a0a" className="ml-1" />}
       </button>
    </div>
  );
}
