import { useRef, useState, useEffect } from "react";
import { Heart, ChevronLeft, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX, Mic2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatTime, SYNCED_LYRICS } from "../data";
import { Slider } from "./ui/slider";

export function FullscreenPlayerView({
  song,
  isPlaying,
  onTogglePlay,
  onBack,
  onNext,
  onPrev,
  progress,
  currentTime,
  volume,
  onVolumeChange,
  onSeek,
  themeColor,
  isDark,
  isLiked,
  onToggleLike,
  isAnimating,
  isShuffle,
  repeatMode,
  onToggleShuffle,
  onToggleRepeat
}) {
  const progressBarRef = useRef(null);
  const vinylRef = useRef(null);
  const [volumeDragging, setVolumeDragging] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);
  const [vinylRotation, setVinylRotation] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  const lyrics = song ? (SYNCED_LYRICS[song.id] || []) : [];
  const currentLyricIndex = lyrics.findLastIndex(l => l.time <= currentTime);

  // Tonearm rotation: 0deg when at rest (paused), 22-50deg when playing based on progress
  const tonearmAngle = isPlaying || volumeDragging
    ? 22 + (progress / 100 * 28) 
    : 0;

  // Calculate angle from mouse position relative to vinyl center
  const getAngleFromEvent = (e) => {
    if (!vinylRef.current) return 0;
    const rect = vinylRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  const handleVinylMouseDown = (e) => {
    e.preventDefault();
    setVolumeDragging(true);
    const angle = getAngleFromEvent(e);
    setLastAngle(angle);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!volumeDragging) return;
      const currentAngle = getAngleFromEvent(e);
      let angleDelta = currentAngle - lastAngle;

      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;

      // Adjust scrubbing speed/sensitivity
      const timeDelta = angleDelta / 360 * (song?.duration || 1) * 0.5;
      const progressDelta = (timeDelta / (song?.duration || 1)) * 100;
      const newProgress = Math.max(0, Math.min(100, progress + progressDelta));

      onSeek(newProgress);
      setLastAngle(currentAngle);
      setVinylRotation((prev) => prev + angleDelta);
    };

    const handleMouseUp = () => setVolumeDragging(false);

    if (volumeDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [volumeDragging, lastAngle, progress, onSeek, song?.duration]);

  return (
    <div 
      className="w-full h-full overflow-hidden flex relative font-['Outfit'] select-none rounded-[24px] border border-border shadow-2xl transition-colors duration-500"
      style={{ 
        background: `radial-gradient(circle at 75% 50%, ${themeColor}20 0%, var(--background) 100%)`
      }}
    >
      {/* Immersive background glow */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] bg-black/40 blur-[100px] rounded-full" />
      </div>

      {/* Top Header Controls */}
      <div className="absolute top-10 left-10 right-10 z-[60] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-foreground/5 rounded-full transition-colors group"
          >
            <ChevronLeft size={28} className="text-foreground/40 group-hover:text-foreground transition-colors" />
          </button>
          
          <button 
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 rounded-full transition-all ${showLyrics ? 'bg-primary text-background' : 'hover:bg-foreground/5 text-foreground/40'}`}
          >
            <Mic2 size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 px-5 py-2 rounded-full bg-foreground/5 border border-border text-foreground/20 text-[10px] font-black uppercase tracking-[3px]">
           <span>{showLyrics ? "Sing Along" : "Now Playing"}</span>
        </div>
        
        <div className="w-[88px]" /> {/* Spacer for symmetry */}
      </div>

      {/* Left Column: Info & Controls */}
      <div className="w-[45%] h-full flex flex-col items-center justify-center px-[80px] pt-32 pb-20 z-[55]">
        <AnimatePresence mode="wait">
          {!showLyrics ? (
            <motion.div 
              key="info"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full flex flex-col items-center"
            >
              <div className="relative group mb-12">
                <div className="absolute inset-0 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative aspect-square w-[340px] md:w-[380px] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                  <img src={song?.imageUrl} alt={song?.title} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-foreground text-[48px] font-black tracking-tighter line-clamp-1 leading-none">{song?.title}</h1>
                    <button onClick={onToggleLike} className="mt-2">
                      <Heart 
                        size={24} 
                        className={`transition-all ${isLiked ? "text-[#FF1E1E] fill-[#FF1E1E]" : "text-foreground/20 hover:text-foreground"}`} 
                      />
                    </button>
                  </div>
                  <div className="flex items-center gap-6 mb-12">
                    <p className="text-foreground/40 text-xl font-medium uppercase tracking-widest">{song?.artist}</p>
                    {song?.language && (
                      <span className="px-3 py-1 rounded-full bg-foreground/5 border border-border text-foreground/40 text-[10px] font-black uppercase tracking-[2px] leading-none">
                        {song.language}
                      </span>
                    )}
                  </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="lyrics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-[60%] flex flex-col overflow-y-auto no-scrollbar scroll-smooth"
            >
              {lyrics.length > 0 ? (
                <div className="flex flex-col gap-8 py-[100px]">
                  {lyrics.map((line, i) => (
                    <motion.p
                      key={i}
                      animate={{ 
                        opacity: currentLyricIndex === i ? 1 : 0.2,
                        scale: currentLyricIndex === i ? 1.05 : 1,
                        x: currentLyricIndex === i ? 10 : 0
                      }}
                      className={`text-[40px] font-black tracking-tighter leading-tight transition-all duration-500 cursor-pointer hover:opacity-100 ${
                        currentLyricIndex === i ? 'text-primary' : 'text-foreground'
                      }`}
                      onClick={() => onSeek((line.time / (song?.duration || 1)) * 100)}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                   <Mic2 size={48} className="mb-4" />
                   <p className="text-xl font-black uppercase tracking-widest">Lyrics not available</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Section */}
        <div className="w-full max-w-[440px] mb-12 flex flex-col items-center mt-auto">
           <div 
            ref={progressBarRef}
            className="w-full h-[6px] bg-foreground/10 rounded-full cursor-pointer relative mb-6 group/progress"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              const rect = e.currentTarget.getBoundingClientRect();
              onSeek((e.clientX - rect.left) / rect.width * 100);
            }}
            onPointerMove={(e) => {
              if (e.buttons === 1) {
                const rect = e.currentTarget.getBoundingClientRect();
                onSeek(Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100)));
              }
            }}
           >
             <div className="absolute inset-y-0 left-0 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" style={{ width: `${progress}%` }} />
             <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-2xl scale-0 group-hover/progress:scale-100 transition-transform" style={{ left: `${progress}%`, marginLeft: '-8px' }} />
           </div>
           <div className="w-full flex justify-between text-foreground/40 text-xs font-bold tabular-nums tracking-widest px-1">
             <span>{formatTime(currentTime)}</span>
             <span>{formatTime(song?.duration || 0)}</span>
           </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-10">
           <button 
             onClick={onToggleShuffle}
             className={`transition-all duration-300 ${isShuffle ? 'text-primary' : 'text-foreground/20 hover:text-foreground'} relative group/shuf`}
           >
              {isShuffle && <div className="absolute inset-0 blur-md bg-primary/20 rounded-full" />}
              <Shuffle size={20} className={isShuffle ? "relative z-10" : ""} />
           </button>
           
           <button onClick={onPrev} className="text-foreground/60 hover:text-foreground transition-colors active:scale-90"><SkipBack size={24} className="fill-current" /></button>
           
           <button 
             onClick={onTogglePlay}
             className="w-20 h-20 rounded-full border-2 border-border flex items-center justify-center relative group active:scale-95 transition-all"
           >
              <div className="absolute inset-0 rounded-full border border-border scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 rounded-full bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              {isPlaying ? <Pause size={32} className="text-foreground fill-foreground" /> : <Play size={32} className="text-foreground fill-foreground ml-1" />}
           </button>

           <button onClick={onNext} className="text-foreground/60 hover:text-foreground transition-colors active:scale-90"><SkipForward size={24} className="fill-current" /></button>
           
           <button 
             onClick={onToggleRepeat}
             className={`transition-all duration-300 ${repeatMode !== 'none' ? 'text-primary' : 'text-foreground/20 hover:text-foreground'} relative group/rep`}
           >
              {repeatMode !== 'none' && <div className="absolute inset-0 blur-md bg-primary/20 rounded-full" />}
              {repeatMode === 'one' ? <Repeat1 size={20} className="relative z-10" /> : <Repeat size={20} className={repeatMode === 'all' ? "relative z-10" : ""} />}
           </button>
        </div>
      </div>

      {/* Right Column: Turntable */}
      <div className="flex-1 h-full flex items-center justify-center relative pr-[80px] z-[55]">
        {/* Large Vinyl Record */}
        <div 
          ref={vinylRef}
          onMouseDown={handleVinylMouseDown}
          className="relative w-full max-w-[650px] aspect-square rounded-full cursor-grab active:cursor-grabbing z-20 group"
        >
           <motion.div 
            id="fullscreen-vinyl-target"
            className={`w-full h-full rounded-full relative overflow-hidden transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
            style={{ 
              background: "repeating-radial-gradient(#1a1a1a 0px, #000 1px, #1a1a1a 4px)",
              boxShadow: "0 50px 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,255,255,0.05)",
              rotate: vinylRotation,
              animation: 'spin 5s linear infinite',
              animationPlayState: isPlaying && !volumeDragging ? 'running' : 'paused'
            }}
           >
              {/* Grooves / Reflections */}
              <div className="absolute inset-0 rounded-full opacity-30" style={{ background: "conic-gradient(from 0deg, transparent 0, #333 45deg, transparent 90deg, #333 135deg, transparent 180deg, #333 225deg, transparent 270deg, #333 315deg, transparent 360deg)" }} />
              
              {/* Label */}
              <div className="absolute inset-[33%] rounded-full overflow-hidden border-2 border-black/50 shadow-inner">
                <img src={song?.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 border-[20px] border-black/10 rounded-full" />
              </div>

              {/* Center hole */}
              <div className="absolute w-4 h-4 bg-[#ccc] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-black/40" />
           </motion.div>

           {/* Atmospheric Light pulse around vinyl */}
           <motion.div 
              animate={isPlaying ? { opacity: [0.02, 0.08, 0.02] } : { opacity: 0 }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-10 rounded-full blur-[80px] -z-10"
              style={{ backgroundColor: themeColor }}
           />
        </div>

        {/* Realistic Metallic Tonearm */}
        <div 
          className="absolute z-30 pointer-events-none"
          style={{ 
            top: '8%', right: '12%', 
            width: '400px', height: '500px',
            transformOrigin: '350px 50px',
            transform: `rotate(${tonearmAngle}deg)`,
            transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)'
          }}
        >
          {/* Base / Pivot Assembly */}
          <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-tr from-[#111] via-[#444] to-[#222] border border-white/10 shadow-huge flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ddd] via-[#666] to-[#eee] shadow-inner" />
            <div className="absolute -top-6 -right-2 w-8 h-20 bg-gradient-to-r from-[#555] via-[#aaa] to-[#444] rounded-sm shadow-xl" />
          </div>

          {/* S-Shape Arm Tube */}
          <svg className="absolute inset-0 pointer-events-none drop-shadow-2xl" width="400" height="500" viewBox="0 0 400 500">
            <defs>
              <linearGradient id="armChrome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#444" />
                <stop offset="20%" stopColor="#bbb" />
                <stop offset="50%" stopColor="#fff" />
                <stop offset="80%" stopColor="#bbb" />
                <stop offset="100%" stopColor="#333" />
              </linearGradient>
            </defs>
            <path 
              d="M 350,50 C 350,180 250,220 230,320 C 220,380 230,410 230,430" 
              fill="none" 
              stroke="url(#armChrome)" 
              strokeWidth="14" 
              strokeLinecap="round" 
            />
            {/* Headshell */}
            <g transform="translate(208, 420) rotate(15, 22, 10)">
              <rect x="0" y="0" width="45" height="70" rx="8" fill="url(#armChrome)" />
              <rect x="18" y="70" width="8" height="24" rx="2" fill="#222" />
              <circle cx="22" cy="94" r="3" fill="#666" />
            </g>
          </svg>
        </div>

        {/* Premium Volume Slider bottom right */}
        <div className="absolute bottom-10 right-10 flex items-center gap-6 z-[60] bg-card/80 backdrop-blur-xl px-8 py-6 rounded-3xl border border-border shadow-2xl min-w-[280px]">
           <button onClick={() => onVolumeChange(volume === 0 ? 70 : 0)} className="text-foreground/40 hover:text-foreground transition-colors">
             {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
           <div className="flex-1 flex flex-col gap-2">
             <Slider 
               value={[volume]} 
               onValueChange={(val) => onVolumeChange(val[0])} 
               max={100} 
               step={1}
               className="cursor-pointer"
             />
             <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-black uppercase tracking-[3px] text-foreground/20">Volume</span>
                <span className="text-[9px] font-bold text-foreground/40 tabular-nums">{Math.round(volume)}%</span>
             </div>
           </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .shadow-huge { box-shadow: 0 10px 40px rgba(0,0,0,0.9); }
      `}</style>
    </div>
  );
}
