import { useRef, useState, useEffect } from "react";
import { 
  Heart, ChevronLeft, Play, Pause, SkipBack, SkipForward, 
  Shuffle, Repeat, Repeat1, Volume2, VolumeX, Mic2, 
  MessageSquare, Circle, Square, Monitor, Terminal, Zap,
  X, Disc, PowerOff, Database, Cpu, Activity, Layout
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { formatTime, SYNCED_LYRICS } from "../data";
import { Slider } from "./ui/slider";

export function FullscreenPlayerView(props) {
  const { song, songs, isPlaying, onTogglePlay, onBack, onNext, onPrev, progress, currentTime, volume, onVolumeChange, onSeek, themeColor, isLiked, onToggleLike, isAnimating, isShuffle, repeatMode, onToggleShuffle, onToggleRepeat, activeTheme } = props;
  const progressBarRef = useRef(null);
  const vinylRef = useRef(null);
  const [volumeDragging, setVolumeDragging] = useState(false);
  const [lastAngle, setLastAngle] = useState(0);
  const [vinylRotation, setVinylRotation] = useState(0);
  const [showLyrics, setShowLyrics] = useState(false);

  const lyrics = song ? (SYNCED_LYRICS[song.id] || []) : [];
  const currentLyricIndex = lyrics.findLastIndex(l => l.time <= currentTime);

  // Tonearm rotation
  const tonearmAngle = isPlaying || volumeDragging ? 22 + (progress / 100 * 28) : 0;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!volumeDragging) return;
      const rect = vinylRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const currentAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
      let angleDelta = currentAngle - lastAngle;
      if (angleDelta > 180) angleDelta -= 360;
      if (angleDelta < -180) angleDelta += 360;
      const timeDelta = angleDelta / 360 * (song?.duration || 1) * 0.5;
      onSeek(Math.max(0, Math.min(100, progress + (timeDelta / (song?.duration || 1)) * 100)));
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

  const isNeon = activeTheme === 'neon';

  return (
    <div 
      className={`w-full h-full overflow-hidden flex relative font-['Outfit'] select-none rounded-[24px] border shadow-2xl transition-colors duration-500 fullscreen-player ${isNeon ? 'border-[#00ffcc]/20' : 'border-border'}`}
      style={{ 
        background: `radial-gradient(circle at 75% 50%, ${themeColor}20 0%, var(--background) 100%)`
      }}
    >
      {/* SCANLINES ONLY IF NEON */}
      {isNeon && (
        <>
          <div className="absolute inset-0 pointer-events-none z-[100] scanlines-crt opacity-[0.1]" />
          <div className="absolute inset-0 pointer-events-none z-[101] bg-gradient-to-b from-transparent via-[#00ffcc]/[0.012] to-transparent animate-glitch-scan" />
        </>
      )}

      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[800px] h-[800px] bg-black/40 blur-[100px] rounded-full" />
      </div>

      <div className="absolute top-10 left-10 right-10 z-[60] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className={`p-2 rounded-full transition-colors group ${isNeon ? 'hover:bg-[#00ffcc]/10 text-[#00ffcc]/40 hover:text-[#00ffcc]' : 'hover:bg-foreground/5 text-foreground/40'}`}>
            <ChevronLeft size={28} className="transition-colors" />
          </button>
          <button onClick={() => setShowLyrics(!showLyrics)} className={`p-2 rounded-full transition-all ${showLyrics ? 'bg-primary text-background' : isNeon ? 'hover:bg-[#00ffcc]/10 text-[#00ffcc]/40' : 'hover:bg-foreground/5 text-foreground/40'}`}>
            <Mic2 size={20} />
          </button>
        </div>
        <div className={`flex items-center gap-3 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[3px] ${isNeon ? 'bg-[#00ffcc]/5 border-[#00ffcc]/20 text-[#00ffcc]' : 'bg-foreground/5 border-border text-foreground/20'}`}>
           <span className={isNeon ? 'animate-pulse' : ''}>{showLyrics ? "Sing Along" : "Now Playing"}</span>
        </div>
        <div className="w-[88px]" />
      </div>

      <div className="w-[45%] h-full flex flex-col items-center justify-center px-[80px] pt-32 pb-20 z-[55]">
        <AnimatePresence mode="wait">
          {!showLyrics ? (
            <motion.div key="info" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="w-full flex flex-col items-center">
              <div className="relative group mb-12">
                <div className={`absolute inset-0 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${isNeon ? 'bg-[#00ffcc]/20' : 'bg-white/5'}`} />
                <div className={`relative aspect-square w-[340px] md:w-[380px] rounded-[32px] overflow-hidden border shadow-[0_40px_80px_rgba(0,0,0,0.6)] ${isNeon ? 'border-[#00ffcc]/30 p-2 bg-black' : 'border-white/10'}`}>
                  <img src={song?.imageUrl} alt={song?.title} className={`w-full h-full object-cover rounded-[24px] ${isNeon ? 'grayscale-[0.4] contrast-[1.1]' : ''}`} />
                </div>
              </div>
              <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className={`text-[48px] font-black tracking-tighter line-clamp-1 leading-none player-title ${isNeon ? 'text-[#ffff00] glow-amber-text italic' : 'text-foreground'}`}>{song?.title}</h1>
                    <button onClick={onToggleLike} className="mt-2">
                      <Heart size={24} className={`transition-all ${isLiked ? "text-[#FF1E1E] fill-[#FF1E1E]" : isNeon ? "text-[#00ffcc]/20 hover:text-[#00ffcc]" : "text-foreground/20 hover:text-foreground"}`} />
                    </button>
                  </div>
                  <div className="flex items-center gap-6 mb-12">
                    <p className={`text-xl font-medium uppercase tracking-widest player-artist ${isNeon ? 'text-[#00ffcc]/60' : 'text-foreground/40'}`}>{song?.artist}</p>
                    {song?.language && <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-[2px] leading-none ${isNeon ? 'bg-[#00ffcc]/10 border-[#00ffcc]/30 text-[#00ffcc]' : 'bg-foreground/5 border-border text-foreground/40'}`}>{song.language}</span>}
                  </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="lyrics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full h-[60%] flex flex-col overflow-y-auto no-scrollbar scroll-smooth">
              {lyrics.length > 0 ? (
                <div className="flex flex-col gap-8 py-[100px]">
                  {lyrics.map((line, i) => (
                    <motion.p key={i} animate={{ opacity: currentLyricIndex === i ? 1 : 0.2, scale: currentLyricIndex === i ? 1.05 : 1, x: currentLyricIndex === i ? 10 : 0 }} className={`text-[40px] font-black tracking-tighter leading-tight transition-all duration-500 cursor-pointer hover:opacity-100 ${currentLyricIndex === i ? 'text-primary' : isNeon ? 'text-[#00ffcc]' : 'text-foreground'}`} onClick={() => onSeek((line.time / (song?.duration || 1)) * 100)}>{line.text}</motion.p>
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

        <div className="w-full max-w-[440px] mb-12 flex flex-col items-center mt-auto">
           <div 
             ref={progressBarRef}
             className={`w-full h-[6px] rounded-full cursor-pointer relative mb-6 group/progress ${isNeon ? 'bg-[#00ffcc]/10' : 'bg-foreground/10'}`}
             onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); const rect = e.currentTarget.getBoundingClientRect(); onSeek((e.clientX - rect.left) / rect.width * 100); }}
             onPointerMove={(e) => { if (e.buttons === 1) { const rect = e.currentTarget.getBoundingClientRect(); onSeek(Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100))); } }}
           >
             <div className={`absolute inset-y-0 left-0 rounded-full progress-bar-fill ${isNeon ? 'bg-[#ffff00] shadow-[0_0_15px_#ffff00]' : 'bg-primary shadow-[0_0_10px_var(--primary)]'}`} style={{ width: `${progress}%` }} />
           </div>
           <div className={`w-full flex justify-between text-xs font-bold tabular-nums tracking-widest px-1 ${isNeon ? 'text-[#00ffcc]/40' : 'text-foreground/40'}`}>
             <span>{formatTime(currentTime)}</span>
             <span>{formatTime(song?.duration || 0)}</span>
           </div>
        </div>

        <div className="flex items-center gap-10">
           <button onClick={onToggleShuffle} className={`transition-all duration-300 ${isShuffle ? 'text-primary' : isNeon ? 'text-[#00ffcc]/20 hover:text-[#00ffcc]' : 'text-foreground/20 hover:text-foreground'} relative group/shuf`}>
              <Shuffle size={20} className={isShuffle ? "relative z-10" : ""} />
           </button>
           <button onClick={onPrev} className={`${isNeon ? 'text-[#ff0055]' : 'text-foreground/60 hover:text-foreground'} transition-colors active:scale-90`}><SkipBack size={16} className="fill-current" /></button>
           <button onClick={onTogglePlay} className={`w-20 h-20 rounded-full border-2 flex items-center justify-center relative group active:scale-95 transition-all ${isNeon ? 'border-[#00ffcc]/40 shadow-[0_0_20px_rgba(0,255,204,0.2)]' : 'border-border'}`}>
              {isPlaying ? <Pause size={32} className={`fill-current ${isNeon ? 'text-[#00ffcc]' : 'text-foreground'}`} /> : <Play size={32} className={`fill-current ml-1 ${isNeon ? 'text-[#00ffcc]' : 'text-foreground'}`} />}
           </button>
           <button onClick={onNext} className={`${isNeon ? 'text-[#ff0055]' : 'text-foreground/60 hover:text-foreground'} transition-colors active:scale-90`}><SkipForward size={16} className="fill-current" /></button>
           <button onClick={onToggleRepeat} className={`transition-all duration-300 ${repeatMode !== 'none' ? 'text-primary' : isNeon ? 'text-[#00ffcc]/20 hover:text-[#00ffcc]' : 'text-foreground/20 hover:text-foreground'} relative group/rep`}>
              {repeatMode === 'one' ? <Repeat1 size={20} className="relative z-10" /> : <Repeat size={20} className={repeatMode === 'all' ? "relative z-10" : ""} />}
           </button>
        </div>
      </div>

      <div className="flex-1 h-full flex items-center justify-center relative pr-[80px] z-[55]">
        <div ref={vinylRef} onMouseDown={(e) => { e.preventDefault(); setVolumeDragging(true); const rect = vinylRef.current.getBoundingClientRect(); setLastAngle(Math.atan2(e.clientY - (rect.top + rect.height/2), e.clientX - (rect.left + rect.width/2)) * (180/Math.PI)); }} className="relative w-full max-w-[650px] aspect-square rounded-full cursor-grab active:cursor-grabbing z-20 group">
           <motion.div id="fullscreen-vinyl-target" className={`w-full h-full rounded-full relative overflow-hidden transition-opacity duration-300 vinyl-record ${isAnimating ? 'opacity-0' : 'opacity-100'}`} style={{ background: isNeon ? "repeating-radial-gradient(#002222 0px, #000 1px, #1a1a1a 4px)" : "repeating-radial-gradient(#1a1a1a 0px, #000 1px, #1a1a1a 4px)", boxShadow: isNeon ? "0 50px 100px rgba(0,255,204,0.2), inset 0 0 40px rgba(0,255,150,0.05)" : "0 50px 100px rgba(0,0,0,0.8), inset 0 0 40px rgba(255,255,255,0.05)", rotate: vinylRotation, animation: 'spin 5s linear infinite', animationPlayState: isPlaying && !volumeDragging ? 'running' : 'paused' }}>
              <div className={`absolute inset-0 rounded-full opacity-30 ${isNeon ? 'bg-cyan-900/20' : ''}`} style={{ background: "conic-gradient(from 0deg, transparent 0, #333 45deg, transparent 90deg, #333 135deg, transparent 180deg, #333 225deg, transparent 270deg, #333 315deg, transparent 360deg)" }} />
              <div className={`absolute inset-[33%] rounded-full overflow-hidden border-2 shadow-inner vinyl-label ${isNeon ? 'border-[#00ffcc]/50 shadow-[0_0_20px_#00ffcc]' : 'border-black/50'}`}><img src={song?.imageUrl} className={`w-full h-full object-cover ${isNeon ? 'contrast-[1.2]' : 'grayscale-[0.2]'}`} /></div>
              <div className={`absolute w-4 h-4 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border ${isNeon ? 'bg-[#00ffcc] border-[#00ffcc]' : 'bg-[#ccc] border-black/40'}`} />
           </motion.div>
        </div>
        <div className="absolute z-30 pointer-events-none" style={{ top: '8%', right: '12%', width: '400px', height: '500px', transformOrigin: '350px 50px', transform: `rotate(${tonearmAngle}deg)`, transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}>
          <svg className={`absolute inset-0 pointer-events-none drop-shadow-2xl ${isNeon ? 'text-[#00ffcc]' : ''}`} width="400" height="500" viewBox="0 0 400 500">
            <path d="M 350,50 C 350,180 250,220 230,320 C 220,380 230,410 230,430" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
          </svg>
        </div>
        <div className={`absolute bottom-10 right-10 flex items-center gap-6 z-[60] backdrop-blur-xl px-8 py-6 rounded-3xl border shadow-2xl min-w-[280px] ${isNeon ? 'bg-[#00ffcc]/5 border-[#00ffcc]/20' : 'bg-card/80 border-border'}`}>
           <button onClick={() => onVolumeChange(volume === 0 ? 70 : 0)} className={`transition-colors ${isNeon ? 'text-[#00ffcc]' : 'text-foreground/40 hover:text-foreground'}`}>{volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
           <div className="flex-1 flex flex-col gap-2"><Slider value={[volume]} onValueChange={(val) => onVolumeChange(val[0])} max={100} step={1} className="cursor-pointer" /></div>
        </div>
      </div>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .scanlines-crt {
          background: repeating-linear-gradient(
            0deg,
            rgba(0, 255, 204, 0.05) 0px,
            rgba(0, 255, 204, 0.05) 1px,
            transparent 1px,
            transparent 4px
          );
        }
        @keyframes scan-glitch {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-glitch-scan {
          animation: scan-glitch 4s linear infinite;
        }
        .glow-amber-text {
          text-shadow: 0 0 10px #ffff00, 0 0 20px rgba(255,255,0,0.3);
        }
      `}</style>
    </div>
  );
}
