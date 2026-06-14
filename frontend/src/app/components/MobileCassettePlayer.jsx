import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Heart, SkipBack, SkipForward, Play, Pause, Shuffle, Repeat, ListMusic, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MobilePlaylistSheet } from "./MobilePlaylistSheet";

/* ── SPINDLE COMPONENT (Realistic Tape Spool Winding Physics) ── */
function Spindle({ isPlaying, progress, isLeft }) {
  // Spool diameter dynamics: base hub size is 16px, maximum tape thickness is 14px.
  // Left spool shrinks as track progresses, right spool grows.
  const baseRadius = 16;
  const maxTapeWidth = 14;
  const tapeRadius = isLeft
    ? baseRadius + (1 - progress / 100) * maxTapeWidth
    : baseRadius + (progress / 100) * maxTapeWidth;

  return (
    <div className="relative w-[76px] h-[76px] flex items-center justify-center flex-none">
      {/* Wound magnetic tape layers (animated background lines) */}
      <div 
        className="absolute rounded-full bg-[#211b15] border border-black/60 shadow-md flex items-center justify-center transition-all duration-300"
        style={{ 
          width: `${tapeRadius * 2}px`, 
          height: `${tapeRadius * 2}px`,
          backgroundImage: "repeating-radial-gradient(circle, #2d2319 0px, #18120c 1.5px, #2d2319 3px)"
        }}
      />
      
      {/* Central golden/amber cog hub */}
      <div 
        className="w-9 h-9 rounded-full bg-[#111] border-2 border-[#E5A632] flex items-center justify-center relative shadow-[inset_0_3px_6px_rgba(0,0,0,0.9)] z-10"
        style={isPlaying ? {
          animation: "spin 5s linear infinite",
          willChange: "transform"
        } : {}}
      >
        {/* Hub spindle teeth */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div 
            key={deg} 
            className="absolute w-[2px] h-[6px] bg-[#E5A632] rounded-full"
            style={{ transform: `rotate(${deg}deg) translateY(-5px)` }}
          />
        ))}
        {/* Center hole */}
        <div className="w-3.5 h-3.5 rounded-full bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] flex items-center justify-center z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

/* ── RETRO HORIZONTAL CASSETTE SHELL ── */
function RetroCassette({ song, isPlaying, progress }) {
  return (
    <div className="relative w-[92%] max-w-[310px] aspect-[1.58] bg-[#101014]/95 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_1px_2px_rgba(255,255,255,0.06)] border border-white/[0.08] flex flex-col justify-between p-3 select-none overflow-hidden transform-gpu">
      {/* Theme highlight color sheen */}
      <div 
        className="absolute inset-0 opacity-[0.12] mix-blend-color-dodge transition-colors duration-1000 pointer-events-none"
        style={{ backgroundColor: song?.color || '#E5A632' }}
      />
      
      {/* Retro noise grain */}
      <div className="absolute inset-0 bg-noise opacity-5 pointer-events-none" />

      {/* Cassette Top Header */}
      <div className="flex justify-between items-center z-10 px-1.5">
        <span className="text-white/30 text-[9px] font-black tracking-[3px] uppercase italic">VINL. PRO-SERIES</span>
        <span className="text-white/40 font-bold text-[9px] tracking-widest uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">SIDE A</span>
      </div>

      {/* Clear Acrylic Central Chamber */}
      <div className="relative h-[65%] w-full bg-[#070709]/80 rounded-xl border border-white/5 shadow-[inset_0_10px_20px_rgba(0,0,0,0.95)] flex items-center justify-center z-10 overflow-hidden">
        {/* Spool guide rollers */}
        <div className="absolute left-3 w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-zinc-700 shadow-inner" />
        
        {/* Horizontal running tape line at the bottom */}
        <div className="absolute bottom-[28%] left-[25%] right-[25%] h-[2px] bg-[#1a130e] opacity-90" />

        {/* Spindles */}
        <div className="flex gap-6 items-center">
          <Spindle isPlaying={isPlaying} progress={progress} isLeft={true} />
          
          {/* Viewport markers */}
          <div className="flex flex-col items-center justify-center gap-1.5 opacity-30 z-20">
            <div className="w-1.5 h-[1px] bg-white" />
            <div className="w-3 h-[1px] bg-white" />
            <div className="w-1.5 h-[1px] bg-white" />
          </div>
          
          <Spindle isPlaying={isPlaying} progress={progress} isLeft={false} />
        </div>
      </div>

      {/* Cassette Metadata Footer */}
      <div className="flex justify-between items-end z-10 px-1.5 pb-0.5">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-white text-[11px] font-black tracking-tight leading-none uppercase truncate max-w-[140px]">{song?.title || "RAW SOURCE"}</span>
          <span className="text-white/30 text-[8px] font-black tracking-[1.5px] uppercase mt-0.5 truncate max-w-[120px]">{song?.artist || "AUDIO ARCHITECT"}</span>
        </div>
        <div className="text-right flex-none">
          <span className="text-[#E5A632] font-black text-[8px] tracking-wider uppercase opacity-85">CHROME / EQ 120µs</span>
        </div>
      </div>

      {/* Mechanical structural corner screws */}
      <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-white/10 flex items-center justify-center border border-white/5"><div className="w-[0.5px] h-full bg-white/20 rotate-45" /></div>
      <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/10 flex items-center justify-center border border-white/5"><div className="w-[0.5px] h-full bg-white/20 -rotate-45" /></div>
      <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-white/10 flex items-center justify-center border border-white/5"><div className="w-[0.5px] h-full bg-white/20 -rotate-45" /></div>
      <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white/10 flex items-center justify-center border border-white/5"><div className="w-[0.5px] h-full bg-white/20 rotate-45" /></div>
    </div>
  );
}

/* ── LED DUAL-CHANNEL PEAK LEVEL METER ── */
function PeakMeter({ isPlaying }) {
  const [levels, setLevels] = useState([2, 2]);

  useEffect(() => {
    if (!isPlaying) {
      setLevels([1, 1]);
      return;
    }
    const interval = setInterval(() => {
      setLevels([
        Math.floor(Math.random() * 8) + 1,
        Math.floor(Math.random() * 8) + 1
      ]);
    }, 110);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="flex flex-col gap-1 w-32 mt-5 opacity-90 border border-white/5 bg-black/60 rounded-lg p-2 shadow-inner">
      <div className="flex justify-between text-[7px] text-white/25 font-bold uppercase tracking-widest px-0.5 mb-1">
        <span>L CH</span>
        <span>R CH</span>
      </div>
      {[0, 1].map((row) => (
        <div key={row} className="flex gap-0.5 justify-between w-full h-1 bg-black/50 rounded overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => {
            const active = i < levels[row];
            let color = "bg-zinc-800";
            if (active) {
              if (i < 5) color = "bg-[#4ade80] shadow-[0_0_5px_#4ade80]";
              else if (i < 7) color = "bg-[#facc15] shadow-[0_0_5px_#facc15]";
              else color = "bg-[#ef4444] shadow-[0_0_5px_#ef4444]";
            }
            return <div key={i} className={`flex-1 h-full transition-all duration-75 ${color}`} />;
          })}
        </div>
      ))}
    </div>
  );
}

/* ── DETAILED CASSETTE DECK FULLSCREEN VIEW ── */
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
      dragElastic={0.25}
      onDragEnd={(e, { offset, velocity }) => {
        if (offset.y > 100 || velocity.y > 400) {
          onBack();
        }
      }}
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", damping: 32, stiffness: 380, mass: 0.8 }}
      className="fixed inset-0 z-[2000] flex flex-col bg-[#020202] transition-colors duration-500 overflow-hidden select-none touch-none"
    >
      {/* Background Deck Texture */}
      <div className="absolute inset-0 bg-[#060608]">
        <div 
          className="absolute inset-0 opacity-[0.25]"
          style={{ 
            backgroundImage: `radial-gradient(circle at 50% 50%, #17171e 0%, transparent 1.5px)`,
            backgroundSize: '20px 20px' 
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-black" />
      </div>

      {/* Drag handle header */}
      <div className="relative z-50 flex flex-col items-center pt-5 pb-1 flex-none">
        <div className="w-12 h-1 bg-white/20 rounded-full mb-4 shadow-[0_0_6px_rgba(255,255,255,0.15)]" />
        <span className="text-white/40 text-[9px] font-black uppercase tracking-[5px] italic">VINL. SYNERGY DECK</span>
      </div>

      {/* Central Pocket Panel */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 min-h-0">
        <div className="relative w-full max-w-[340px] aspect-[4/5] max-h-[65vh] bg-gradient-to-b from-[#0b0b0e] to-[#010102] rounded-[48px] overflow-hidden shadow-[0_45px_100px_rgba(0,0,0,1),inset_0_1px_8px_rgba(255,255,255,0.03)] border border-white/5 flex flex-col items-center justify-center p-4">
          <div className="absolute top-0 left-0 w-full h-[45%] bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none z-50" />
          
          <RetroCassette song={song} isPlaying={isPlaying} progress={progress} />
          
          <PeakMeter isPlaying={isPlaying} />
        </div>
        
        {/* Meta Display */}
        <div className="flex flex-col items-center text-center gap-1.5 mt-5 mb-1 flex-none">
          <h2 className="text-white text-[28px] font-black tracking-tight leading-none uppercase italic truncate max-w-[85vw] drop-shadow-md">{song?.title || "RAW TAPE"}</h2>
          <p className="text-white/30 text-[11px] font-black uppercase tracking-[5px] leading-none">{song?.artist || "AUDIO ARCHITECT"}</p>
        </div>
      </div>

      {/* Control Console */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-[400px] mx-auto px-8 gap-5 pb-8 flex-none">
        
        {/* Buttons Grid */}
        <div className="w-full grid grid-cols-3 items-center">
          <div className="flex justify-start">
            <button 
              onClick={onToggleShuffle} 
              className={`w-11 h-11 flex items-center justify-center transition-all active:scale-90 rounded-full border border-transparent active:border-white/5 active:bg-white/[0.02] ${isShuffle ? 'text-white' : 'text-white/20'}`}
            >
              <Shuffle size={18} className={isShuffle ? "drop-shadow-glow" : ""} />
            </button>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center gap-1.5 p-1 bg-white/[0.02] rounded-full border border-white/5 shadow-inner">
              <motion.button 
                whileTap={{ scale: 0.94 }} 
                onClick={onPrev} 
                className="w-12 h-11 bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl active:bg-white/10 transition-all"
              >
                <SkipBack size={16} className="fill-current" />
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.94 }} 
                onClick={onTogglePlay} 
                className="w-16 h-13 bg-white text-black flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all"
              >
                {isPlaying ? <Pause size={24} className="fill-current" /> : <Play size={24} className="fill-current ml-1" />}
              </motion.button>
              
              <motion.button 
                whileTap={{ scale: 0.94 }} 
                onClick={onNext} 
                className="w-12 h-11 bg-white/5 border border-white/10 text-white flex items-center justify-center rounded-2xl active:bg-white/10 transition-all"
              >
                <SkipForward size={16} className="fill-current" />
              </motion.button>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              onClick={onToggleRepeat} 
              className={`w-11 h-11 flex items-center justify-center transition-all active:scale-90 rounded-full border border-transparent active:border-white/5 active:bg-white/[0.02] ${repeatMode !== 'none' ? 'text-white' : 'text-white/20'}`}
            >
              <Repeat size={18} className={repeatMode !== 'none' ? "drop-shadow-glow" : ""} />
            </button>
          </div>
        </div>

        {/* Scrubbing Track rail */}
        <div className="w-full flex flex-col gap-2.5">
          <div 
            ref={progressBarRef} 
            onPointerDown={(e) => { setIsDragging(true); handlePointerMove(e); e.target.setPointerCapture(e.pointerId); }}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => { setIsDragging(false); e.target.releasePointerCapture(e.pointerId); }}
            className="relative h-2 bg-white/5 rounded-full shadow-inner border border-white/5 cursor-pointer touch-none"
          >
            <div 
              className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_10px_white] transition-all" 
              style={{ width: `${Math.min(progress, 100)}%` }} 
            />
            <motion.div 
              animate={isDragging ? { scale: 1.4 } : { scale: 1 }}
              className="absolute top-[-8px] bottom-[-8px] w-1.5 bg-[#E5A632] shadow-[0_0_12px_#E5A632] z-20 rounded-full -translate-x-1/2" 
              style={{ left: `${Math.min(progress, 100)}%` }} 
            />
          </div>

          <div className="flex justify-between text-[10px] font-black tabular-nums text-white/30 tracking-widest px-0.5">
            <span>{formatTime(Math.min(elapsed, totalSecs))}</span>
            <span>{formatTime(totalSecs)}</span>
          </div>
        </div>

        {/* Utility button Rack */}
        <div className="w-full flex justify-between px-6">
          <button onClick={onToggleLike} className="p-2.5 active:scale-130 transition-all text-white/20 hover:text-red-500">
            <Heart size={20} className={isLiked ? "text-red-500 fill-current" : ""} />
          </button>
          <button onClick={() => setIsPlaylistOpen(true)} className="p-2.5 active:scale-130 transition-all text-white/20 hover:text-white">
            <ListMusic size={20} />
          </button>
          <button onClick={onBack} className="p-2.5 active:scale-130 transition-all text-white/20 hover:text-white">
            <X size={20} />
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
