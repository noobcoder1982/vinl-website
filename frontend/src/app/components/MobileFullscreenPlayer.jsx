import { useEffect, useRef, useState } from "react";
import { 
  ChevronDown, Heart, SkipBack, SkipForward, Play, Pause, 
  Shuffle, Repeat, Repeat1, ListMusic, X, Mic2, Volume2, VolumeX 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { MobilePlaylistSheet } from "./MobilePlaylistSheet";
import { SYNCED_LYRICS } from "../data";

export function MobileFullscreenPlayer({
  song, isPlaying, onTogglePlay, onBack, onNext, onPrev,
  progress, currentTime, onSeek, themeColor, onToggleLike,
  isShuffle, repeatMode, onToggleShuffle, onToggleRepeat, songs = [],
  onSongSelect, activeTheme, likedSongs
}) {
  const progressBarRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const settleTimeoutRef = useRef(null);
  const playTimeoutRef = useRef(null);

  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [volume, setVolume] = useState(70);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [slideDirection, setSlideDirection] = useState("right");
  const [displayedSong, setDisplayedSong] = useState(song);
  const [isDiscSettled, setIsDiscSettled] = useState(true);
  const [isStylusDown, setIsStylusDown] = useState(isPlaying);

  // Sync displayedSong when song changes externally
  useEffect(() => {
    setDisplayedSong(song);
    setIsDiscSettled(true);
    setIsStylusDown(isPlaying);
  }, [song, isPlaying]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
      if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
    };
  }, []);

  const getNextSong = () => {
    if (!songs.length || !displayedSong) return null;
    if (isShuffle) {
      const otherSongs = songs.filter(s => s.id !== displayedSong.id);
      return otherSongs.length > 0 ? otherSongs[Math.floor(Math.random() * otherSongs.length)] : songs[0];
    } else {
      const idx = songs.findIndex((s) => s.id === displayedSong.id);
      return songs[(idx + 1) % songs.length];
    }
  };

  const getPrevSong = () => {
    if (!songs.length || !displayedSong) return null;
    if (isShuffle) {
      const otherSongs = songs.filter(s => s.id !== displayedSong.id);
      return otherSongs.length > 0 ? otherSongs[Math.floor(Math.random() * otherSongs.length)] : songs[0];
    } else {
      const idx = songs.findIndex((s) => s.id === displayedSong.id);
      return songs[(idx - 1 + songs.length) % songs.length];
    }
  };

  const handleNext = () => {
    if (!songs.length) return;
    const nextSong = getNextSong();
    if (!nextSong) return;

    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);

    setSlideDirection("right");
    setDisplayedSong(nextSong);
    setIsDiscSettled(false);
    setIsStylusDown(false); // Lift stylus immediately
    
    // 1. Disc settles at 550ms
    settleTimeoutRef.current = setTimeout(() => {
      setIsDiscSettled(true);
    }, 550);

    // 2. Stylus drops and playback starts at 950ms
    playTimeoutRef.current = setTimeout(() => {
      setIsStylusDown(true);
      if (onNext) onNext();
    }, 950);
  };

  const handlePrev = () => {
    if (!songs.length) return;
    const prevSong = getPrevSong();
    if (!prevSong) return;

    if (settleTimeoutRef.current) clearTimeout(settleTimeoutRef.current);
    if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);

    setSlideDirection("left");
    setDisplayedSong(prevSong);
    setIsDiscSettled(false);
    setIsStylusDown(false); // Lift stylus immediately
    
    // 1. Disc settles at 550ms
    settleTimeoutRef.current = setTimeout(() => {
      setIsDiscSettled(true);
    }, 550);

    // 2. Stylus drops and playback starts at 950ms
    playTimeoutRef.current = setTimeout(() => {
      setIsStylusDown(true);
      if (onPrev) onPrev();
    }, 950);
  };

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const isSongChanging = displayedSong?.id !== song?.id;
  const displayProgress = isSongChanging ? 0 : progress;
  const displayCurrentTime = isSongChanging ? 0 : currentTime;
  const displayIsPlaying = isSongChanging ? false : isPlaying;

  const totalSecs = displayedSong?.duration || 0;
  const elapsed = (displayProgress / 100) * totalSecs;

  const lyrics = displayedSong ? (SYNCED_LYRICS[displayedSong.id] || []) : [];
  const currentLyricIndex = lyrics.findLastIndex(l => l.time <= displayCurrentTime);

  // Auto scroll active lyric line
  useEffect(() => {
    if (showLyrics && scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(".active-lyric");
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [currentLyricIndex, showLyrics]);

  const handlePointerMove = (e) => {
    if (!isDragging || !progressBarRef.current || isSongChanging) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onSeek(pct);
  };

  const isNeon = activeTheme === 'neon';
  const isEco = activeTheme === 'eco';
  const isBrutalist = activeTheme === 'brutalist';
  const isWhite = activeTheme === 'white';

  const getTonearmRotation = () => {
    if (!isDiscSettled) return -25;
    return 0 + (displayProgress / 100) * 15;
  };

  const displayIsLiked = likedSongs?.includes(displayedSong?.id);

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
      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      className={`fixed inset-0 z-[2000] flex flex-col justify-between overflow-hidden select-none touch-none font-['Outfit'] transition-[background,background-color,color,border-color] duration-500
        ${isWhite ? 'bg-white text-black' : 'bg-black text-white'}
      `}
      style={{
        background: isWhite
          ? `radial-gradient(circle at top, ${themeColor}15 0%, #ffffff 100%)`
          : `radial-gradient(circle at top, ${themeColor}30 0%, #08080c 100%)`,
        willChange: "transform"
      }}
    >
      {/* Background visualizer ambient glow */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[120%] aspect-square rounded-full opacity-40 animate-pulse-slow"
          style={{ 
            background: `radial-gradient(circle, ${themeColor} 0%, transparent 70%)` 
          }}
        />
        {isNeon && (
          <>
            <div className="absolute inset-0 bg-cyber-grid opacity-[0.06] pointer-events-none z-[10]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.03] via-transparent to-pink-500/[0.03] pointer-events-none z-[11]" />
          </>
        )}
      </div>

      {/* HEADER BAR */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4 flex-none">
        <button 
          onClick={onBack} 
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90
            ${isWhite 
              ? 'bg-black/5 text-black hover:bg-black/10' 
              : 'bg-white/5 text-white hover:bg-white/10'
            }`}
        >
          <ChevronDown size={22} strokeWidth={2.5} />
        </button>

        <div className="flex flex-col items-center">
          <span className={`text-[9px] font-black uppercase tracking-[4px] opacity-40 ${isNeon ? 'text-primary' : ''}`}>
            {showLyrics ? "Sing Along" : "Now Playing"}
          </span>
          {displayedSong?.album && (
            <span className="text-[10px] font-bold opacity-30 mt-0.5 max-w-[150px] truncate uppercase tracking-widest">
              {displayedSong.album}
            </span>
          )}
        </div>

        <button 
          onClick={() => setShowLyrics(!showLyrics)} 
          className={`w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90
            ${showLyrics 
              ? (isWhite ? 'bg-black text-white' : 'bg-white text-black shadow-lg') 
              : (isWhite ? 'bg-black/5 text-black hover:bg-black/10' : 'bg-white/5 text-white hover:bg-white/10')
            }`}
        >
          <Mic2 size={18} strokeWidth={2.5} />
        </button>
      </div>

      {/* MAIN VISUAL WORKSPACE */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 min-h-0">
        <AnimatePresence mode="popLayout">
          {!showLyrics ? (
            <motion.div 
              key="turntable-view"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex flex-col items-center justify-center"
            >
              {/* Physical Turntable Deck (Static Platter and Tonearm) */}
              <div className="relative flex items-center justify-center w-[min(70vw,32vh,280px)] h-[min(70vw,32vh,280px)] mb-8 group mobile-player-artwork-wrap">
                {/* Platter (Static Deck Background Plate) */}
                <div 
                  className={`absolute w-[104%] h-[104%] rounded-full border shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_4px_12px_rgba(0,0,0,0.7)]
                    ${isWhite ? 'bg-zinc-100 border-zinc-300' : 'bg-[#121216] border-zinc-800'}
                  `}
                  style={{
                    left: "-2%",
                    top: "-2%"
                  }}
                >
                  {/* Brushed metal pattern concentric circles */}
                  <div className={`absolute inset-0 rounded-full border-4 ${isWhite ? 'border-zinc-300/40' : 'border-zinc-800/30'}`} />
                  <div className="absolute inset-[3%] rounded-full border border-dashed opacity-10" />
                  <div className="absolute inset-[8%] rounded-full border border-solid opacity-[0.03]" />
                  <div className="absolute inset-[15%] rounded-full border border-dashed opacity-10" />
                </div>

                {/* Sliding Vinyl Record Wrapper */}
                <div className="absolute inset-0 overflow-visible flex items-center justify-center pointer-events-none z-10">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      key={`vinyl-${displayedSong?.id}`}
                      initial={{ 
                        opacity: 0, 
                        x: slideDirection === "right" ? "120%" : "-120%",
                        rotate: slideDirection === "right" ? 45 : -45
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0,
                        rotate: 0
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: slideDirection === "right" ? "-120%" : "120%",
                        rotate: slideDirection === "right" ? -45 : 45
                      }}
                      transition={{ type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.55 }}
                      className="w-full h-full relative flex items-center justify-center"
                    >
                      {/* Dynamic Ambient Record Glow (moves with the record) */}
                      <div 
                        className="absolute inset-0 rounded-full opacity-40"
                        style={{ background: `radial-gradient(circle, ${themeColor} 0%, transparent 75%)` }}
                      />

                      {/* Vinyl Record */}
                      <motion.div 
                        className={`w-full h-full rounded-full relative overflow-hidden flex items-center justify-center border shadow-[0_15px_40px_rgba(0,0,0,0.5)]
                          ${isWhite ? 'border-black/5' : 'border-white/5'}
                        `}
                        style={{
                          background: "repeating-radial-gradient(#151515 0px, #020202 1px, #151515 3px, #0c0c0c 4px)",
                          willChange: "transform"
                        }}
                        animate={displayIsPlaying && isDiscSettled ? { rotate: 360 } : {}}
                        transition={displayIsPlaying && isDiscSettled ? { duration: 8, repeat: Infinity, ease: "linear" } : {}}
                      >
                        {/* Conic reflections */}
                        <div className="absolute inset-0 rounded-full opacity-25" style={{ background: "conic-gradient(from 0deg, transparent 0, #333 45deg, transparent 90deg, #333 135deg, transparent 180deg, #333 225deg, transparent 270deg, #333 315deg, transparent 360deg)" }} />

                        {/* Album label (Cover) */}
                        <div className={`absolute inset-[32%] rounded-full overflow-hidden border shadow-inner bg-zinc-800
                          ${isWhite ? 'border-black/20' : 'border-black/40'}
                        `}>
                          <img 
                            src={displayedSong?.imageUrl} 
                            className="w-full h-full object-cover grayscale-[0.08]" 
                            alt="" 
                          />
                          <div className="absolute inset-0 bg-black/5" />
                        </div>

                        {/* Center Hole Cutout (Hollow look) */}
                        <div className={`absolute w-7 h-7 rounded-full border shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-20
                          ${isWhite ? 'bg-[#eee] border-black/20' : 'bg-[#18181b] border-white/20'}
                        `} />
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Center Spindle Pin (Static, aligns / pops up when record settles) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  <motion.div
                    animate={isDiscSettled ? { scale: 1, y: 0, opacity: 1 } : { scale: 0.75, y: -4, opacity: 0.8 }}
                    transition={{ type: "spring", stiffness: 350, damping: 14 }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center border shadow-[0_2px_4px_rgba(0,0,0,0.4)]
                      ${isWhite ? 'bg-[#eee] border-black/10' : 'bg-[#1f1f24] border-white/10'}
                    `}
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-tr from-zinc-500 via-zinc-300 to-zinc-100 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8)] border border-black/30 flex items-center justify-center`}>
                      <div className="w-0.5 h-0.5 rounded-full bg-black/40" />
                    </div>
                  </motion.div>
                </div>

                {/* Physical Tonearm (Skeuomorphic Tracking, Static pivot, Animates over record) */}
                <motion.div 
                  className="absolute z-40 pointer-events-none"
                  style={{
                    top: '-15%',
                    right: '-10%',
                    width: '120px',
                    height: '180px',
                    transformOrigin: '100px 20px',
                    willChange: 'transform'
                  }}
                  animate={{
                    rotate: getTonearmRotation(),
                    scale: isStylusDown ? 1.0 : 1.08,
                    y: isStylusDown ? 0 : -6,
                    filter: isStylusDown
                      ? "drop-shadow(3px 4px 5px rgba(0,0,0,0.45))"
                      : "drop-shadow(12px 18px 24px rgba(0,0,0,0.55))"
                  }}
                  transition={{
                    rotate: { type: "tween", ease: [0.25, 1, 0.5, 1], duration: 0.8 },
                    scale: { type: "spring", stiffness: 200, damping: 18 },
                    y: { type: "spring", stiffness: 200, damping: 18 },
                    filter: { duration: 0.4 }
                  }}
                >
                  <svg width="120" height="180" viewBox="0 0 120 180" className="absolute inset-0 pointer-events-none">
                    <defs>
                      <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f1f5f9" />
                        <stop offset="40%" stopColor="#cbd5e1" />
                        <stop offset="70%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#475569" />
                      </linearGradient>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#a16207" />
                      </linearGradient>
                    </defs>

                    {/* The metal arm tube */}
                    <path 
                      d="M 100,20 C 100,60 80,100 70,120 C 65,130 50,140 40,150" 
                      fill="none" 
                      stroke="url(#metalGradient)" 
                      strokeWidth="4.5" 
                      strokeLinecap="round" 
                    />

                    {/* Finger lift arm hook */}
                    <path
                      d="M 32,146 C 30,140 25,138 22,140"
                      fill="none"
                      stroke="#475569"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    {/* Headshell / Cartridge */}
                    <path 
                      d="M 40,150 L 35,158 L 27,154 L 32,146 Z" 
                      fill="#1e293b" 
                      stroke="#475569" 
                      strokeWidth="1" 
                    />

                    {/* Stylus holder block */}
                    <path
                      d="M 31,156 L 27,154 L 28,151 L 32,152 Z"
                      fill={themeColor || "url(#goldGradient)"}
                    />

                    {/* Stylus needle pin */}
                    <line 
                      x1="28" 
                      y1="154" 
                      x2="24" 
                      y2="161" 
                      stroke="#94a3b8" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                    />

                    {/* Red stylus micro dot */}
                    <circle cx="24" cy="161" r="0.75" fill="#ef4444" />

                    {/* Pivot base assembly */}
                    <circle cx="100" cy="20" r="12" fill="#334155" stroke="#1e293b" strokeWidth="1.5" />
                    <circle cx="100" cy="20" r="8" fill="#475569" />
                    <circle cx="100" cy="20" r="4" fill="#0f172a" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="lyrics-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              ref={scrollContainerRef}
              className="w-full h-[320px] overflow-y-auto no-scrollbar scroll-smooth px-2 flex flex-col gap-6 py-20"
            >
              {lyrics.length > 0 ? (
                lyrics.map((line, i) => {
                  const isActive = currentLyricIndex === i;
                  return (
                    <motion.p 
                      key={i} 
                      onClick={() => onSeek((line.time / totalSecs) * 100)}
                      className={`text-2xl font-black tracking-tight leading-snug cursor-pointer transition-all duration-300 origin-left
                        ${isActive 
                          ? 'active-lyric scale-[1.03]' 
                          : 'opacity-25 hover:opacity-60'
                        }
                      `}
                      style={{ 
                        color: isActive ? (isWhite ? '#000000' : themeColor || '#FFFFFF') : undefined,
                        textShadow: isActive && !isWhite ? `0 0 15px ${themeColor}40` : 'none'
                      }}
                    >
                      {line.text}
                    </motion.p>
                  );
                })
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-30 gap-3">
                  <Mic2 size={36} />
                  <p className="text-sm font-black uppercase tracking-widest">Lyrics not synced</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SONG INFORMATION */}
        <div className="w-full flex items-center justify-between mt-6 max-w-[340px] mobile-player-info-wrap">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className={`text-2xl font-black tracking-tight leading-none uppercase truncate
              ${isBrutalist ? 'italic font-serif' : ''}
              ${isNeon ? 'text-[#ff0055] [text-shadow:0_0_8px_rgba(255,0,85,0.45)] font-mono italic' : ''}
            `}>
              {displayedSong?.title || "Unknown Track"}
            </h2>
            <p className={`text-xs font-bold opacity-30 mt-1.5 uppercase tracking-[3px] truncate
              ${isNeon ? 'text-cyan-400 opacity-80 [text-shadow:0_0_5px_rgba(0,240,255,0.35)]' : ''}
            `}>
              {displayedSong?.artist || "Unknown Artist"}
            </p>
          </div>
          <button 
            onClick={() => onToggleLike && onToggleLike(displayedSong?.id)} 
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-120 flex-none
              ${displayIsLiked 
                ? 'text-[#FF1E1E]' 
                : (isWhite ? 'text-black/20 hover:text-black/60' : 'text-white/20 hover:text-white/60')
              }`}
          >
            <Heart size={22} className={displayIsLiked ? "fill-current" : ""} />
          </button>
        </div>
      </div>

      {/* CONTROLS CONSOLE */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-[400px] mx-auto px-8 gap-6 pb-12 flex-none mobile-player-controls-wrap">
        
        {/* Progress Slider */}
        <div className="w-full flex flex-col gap-2">
          <div 
            ref={progressBarRef} 
            onPointerDown={(e) => { 
              if (isSongChanging) return;
              setIsDragging(true); 
              handlePointerMove(e); 
              e.target.setPointerCapture(e.pointerId); 
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => { setIsDragging(false); e.target.releasePointerCapture(e.pointerId); }}
            className={`relative h-[6px] rounded-full cursor-pointer touch-none flex items-center
              ${isWhite ? 'bg-black/5' : 'bg-white/10'}
            `}
          >
            <div 
              className={`absolute inset-y-0 left-0 rounded-full transition-all`} 
              style={{ 
                width: `${Math.min(displayProgress, 100)}%`,
                backgroundColor: isNeon ? '#ff0055' : (themeColor || (isWhite ? '#000' : '#fff')),
                boxShadow: isNeon ? '0 0 10px #ff0055' : (!isWhite ? `0 0 10px ${themeColor}60` : 'none')
              }} 
            />
            <motion.div 
              animate={isDragging ? { scale: 1.4 } : { scale: 1 }}
              className="absolute w-3 h-3 rounded-full shadow-lg z-20 -translate-x-1/2 cursor-grab active:cursor-grabbing" 
              style={{ 
                left: `${Math.min(displayProgress, 100)}%`,
                backgroundColor: isNeon ? '#00f0ff' : (isWhite ? '#000' : '#fff')
              }} 
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold font-mono opacity-35 tracking-wider px-0.5">
            <span>{formatTime(Math.min(elapsed, totalSecs))}</span>
            <span>{formatTime(totalSecs)}</span>
          </div>
        </div>

        {/* Playback Controls Grid */}
        <div className="w-full flex items-center justify-between px-2">
          {/* Shuffle Toggle */}
          <button 
            onClick={onToggleShuffle} 
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95
              ${isShuffle 
                ? (isWhite ? 'text-black font-black' : 'text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]') 
                : (isWhite ? 'text-black/20 hover:text-black/60' : 'text-white/20 hover:text-white/60')
              }`}
          >
            <Shuffle size={18} strokeWidth={isShuffle ? 2.5 : 2} />
          </button>

          {/* Controls cluster */}
          <div className="flex items-center gap-5">
            {/* Prev Button */}
            <button 
              onClick={handlePrev} 
              className={`w-12 h-12 flex items-center justify-center rounded-full active:scale-90 transition-all
                ${isWhite ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}
              `}
            >
              <SkipBack size={18} className="fill-current" />
            </button>

            {/* Play/Pause Button */}
            <button 
              onClick={onTogglePlay} 
              className={`w-18 h-18 rounded-full flex items-center justify-center active:scale-95 shadow-xl transition-all
                ${isWhite 
                  ? 'bg-black text-white hover:bg-black/90' 
                  : 'bg-white text-black hover:bg-white/90 shadow-[0_8px_24px_rgba(255,255,255,0.15)]'
                }`}
            >
              {isPlaying ? (
                <Pause size={24} className="fill-current" />
              ) : (
                <Play size={24} className="fill-current ml-1" />
              )}
            </button>

            {/* Next Button */}
            <button 
              onClick={handleNext} 
              className={`w-12 h-12 flex items-center justify-center rounded-full active:scale-90 transition-all
                ${isWhite ? 'bg-black/5 hover:bg-black/10 text-black' : 'bg-white/5 hover:bg-white/10 text-white'}
              `}
            >
              <SkipForward size={18} className="fill-current" />
            </button>
          </div>

          {/* Repeat Toggle */}
          <button 
            onClick={onToggleRepeat} 
            className={`w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95
              ${repeatMode !== 'none'
                ? (isWhite ? 'text-black font-black' : 'text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]') 
                : (isWhite ? 'text-black/20 hover:text-black/60' : 'text-white/20 hover:text-white/60')
              }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 size={18} strokeWidth={2.5} />
            ) : (
              <Repeat size={18} strokeWidth={repeatMode === 'all' ? 2.5 : 2} />
            )}
          </button>
        </div>

        {/* BOTTOM UTILITY ROW */}
        <div className="w-full flex items-center justify-between px-6 pt-2 border-t border-white/[0.04]">
          <div className="relative">
            <button 
              onClick={() => setShowVolumeSlider(!showVolumeSlider)} 
              className={`p-2 transition-colors active:scale-110
                ${isWhite ? 'text-black/30 hover:text-black' : 'text-white/30 hover:text-white'}
              `}
            >
              {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>

            <AnimatePresence>
              {showVolumeSlider && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-3 rounded-2xl shadow-xl flex flex-col items-center gap-2 w-32 border
                    ${isWhite ? 'bg-white border-black/5' : 'bg-[#121214] border-white/5'}
                  `}
                >
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full accent-primary h-1 bg-white/10 rounded-lg outline-none cursor-pointer"
                  />
                  <span className="text-[9px] font-bold font-mono opacity-50">{volume}%</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => setIsPlaylistOpen(true)} 
            className={`p-2 transition-colors active:scale-110
              ${isWhite ? 'text-black/30 hover:text-black' : 'text-white/30 hover:text-white'}
            `}
            title="Queue"
          >
            <ListMusic size={18} />
          </button>

          <button 
            onClick={onBack} 
            className={`p-2 transition-colors active:scale-110
              ${isWhite ? 'text-black/30 hover:text-black' : 'text-white/30 hover:text-white'}
            `}
            title="Minimize"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <MobilePlaylistSheet 
        isOpen={isPlaylistOpen} 
        onClose={() => setIsPlaylistOpen(false)} 
        queue={songs}
        onSongSelect={(s) => {
          if (onSongSelect) onSongSelect(s);
          setIsPlaylistOpen(false);
        }}
        songs={songs}
      />

      <style>{`
        @media (max-height: 740px) {
          .mobile-player-artwork-wrap {
            margin-bottom: 16px !important;
          }
          .mobile-player-info-wrap {
            margin-top: 12px !important;
          }
          .mobile-player-controls-wrap {
            gap: 16px !important;
            padding-bottom: 24px !important;
          }
        }
        @media (max-height: 660px) {
          .mobile-player-artwork-wrap {
            margin-bottom: 10px !important;
          }
          .mobile-player-info-wrap {
            margin-top: 6px !important;
          }
          .mobile-player-controls-wrap {
            gap: 10px !important;
            padding-bottom: 16px !important;
          }
        }
      `}</style>
    </motion.div>
  );
}
