import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Bookmark, Volume2, Headphones, Music, Play, Pause, AlertCircle } from "lucide-react";
import WaveSurfer from 'wavesurfer.js';

/* ── REEL ONE (REEL) COMPONENT - Mechanical ── */
function Reel({ isPlaying, reverse = false }) {
  const rotation = useRef(0);
  const rafRef = useRef(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const spin = () => {
      rotation.current += reverse ? -0.8 : 0.8;
      setAngle(rotation.current);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isPlaying, reverse]);

  return (
    <div className="relative aspect-square h-[85%] max-h-[300px] flex items-center justify-center flex-none pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
       {/* Industrial Chassis Edge */}
       <div className="absolute inset-0 rounded-full border border-white/[0.05]" />
       <div className="absolute inset-[-1px] rounded-full overflow-hidden opacity-30">
          {[...Array(120)].map((_, i) => (
             <div 
               key={i} 
               className="absolute top-0 left-1/2 w-px h-full bg-white" 
               style={{ transform: `rotate(${i * 3}deg)` }}
             />
          ))}
       </div>

       {/* Reel Guts */}
       <motion.div 
         className="w-[96%] h-[96%] rounded-full relative flex items-center justify-center overflow-hidden transform-gpu bg-[#080808]"
         style={{ rotate: angle }}
       >
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-[#0a0a0a] to-[#111]" />
          
          {/* Pro-Reel Cutouts */}
          {[0, 120, 240].map((deg) => (
             <div key={deg} className="absolute inset-0" style={{ transform: `rotate(${deg}deg)` }}>
                <div 
                   className="absolute left-[15%] right-[15%] top-[8%] h-[38%] bg-[#121212] border border-white/[0.03]"
                   style={{ clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)' }}
                />
                <div 
                   className="absolute left-[18%] right-[18%] top-[12%] h-[28%] bg-[#1a1a1a]"
                   style={{ clipPath: 'polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)' }}
                />
             </div>
          ))}

          {/* Center Hub Architecture */}
          <div className="absolute inset-[32%] rounded-full border border-white/5 bg-black shadow-2xl flex items-center justify-center">
             <div className="w-[10%] h-[120%] bg-white/[0.02] absolute rotate-0" />
             <div className="w-[10%] h-[120%] bg-white/[0.02] absolute rotate-120" />
             <div className="w-[10%] h-[120%] bg-white/[0.02] absolute rotate-240" />
          </div>
       </motion.div>
       
       <div className="absolute w-8 h-8 bg-[#111] rounded-full border border-black z-20 shadow-2xl" />
    </div>
  );
}

/* ── REEL ONE (STUDIO SYNC) PLAYER ── */
export function MobileStudioSync({
  song, isPlaying, onTogglePlay, onBack, onNext, onPrev,
  progress, currentTime, onSeek, isLiked, onToggleLike, audioElement
}) {
  const containerRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  const pxPerSec = 120; // High-Fidelity Cinematic Zoom Factor
  
  // Track drag state
  const isDraggingRef = useRef(false);
  const wasPlayingRef = useRef(false);
  const lastXRef = useRef(0);

  // Safety: If no song, don't crash

  if (!song) {
    return (
      <div className="fixed inset-0 z-[400] bg-black flex flex-col items-center justify-center p-10 text-center">
         <AlertCircle size={48} className="text-white/20 mb-4" />
         <h2 className="text-white font-black uppercase tracking-widest italic">Signal Lost</h2>
         <button onClick={onBack} className="mt-8 px-6 py-2 bg-white text-black font-black rounded-full text-xs uppercase italic">Return to Base</button>
      </div>
    );
  }

  // Initialize WaveSurfer
  useEffect(() => {
    let ws = null;
    
    const initWS = async () => {
      if (!containerRef.current) return;
      
      try {
        ws = WaveSurfer.create({
          container: containerRef.current,
          media: audioElement, 
          waveColor: '#f2f2f2', 
          progressColor: '#000000',
          cursorColor: 'transparent',
          height: 140,
          barWidth: 0, // STRICT SOLID BLOCK DESIGN
          interact: false,
          hideScrollbar: true,
          autoCenter: true, 
          minPxPerSec: 120, // High-fidelity zoom
          normalize: true,
          dragToSeek: false, 
        });

        ws.on('ready', () => setIsReady(true));
        ws.on('error', (err) => setError(err.message));

        waveSurferRef.current = ws;
      } catch (e) {
        setError(e.message);
      }
    };

    const timer = setTimeout(initWS, 100);

    return () => {
      clearTimeout(timer);
      if (ws) ws.destroy();
    };
  }, [audioElement, song?.audioUrl]);

  // HAPTIC-SCRUB PROTOCOL: Pause immediately on touch
  const handlePointerDown = (e) => {
     isDraggingRef.current = true;
     lastXRef.current = e.clientX || (e.touches && e.touches[0].clientX);
     
     if (audioElement && !audioElement.paused) {
        wasPlayingRef.current = true;
        audioElement.pause();
     } else {
        wasPlayingRef.current = false;
     }
  };

  // KINETIC PANNING ENGINE: Waveform slides under fixed center
  const handlePointerMove = (e) => {
     if (!isDraggingRef.current || !waveSurferRef.current || !audioElement) return;
     
     const currentX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
     if (currentX == null) return;

     const deltaX = currentX - lastXRef.current;
     lastXRef.current = currentX;
     
     const duration = audioElement.duration || waveSurferRef.current.getDuration() || 1;
     
     // 1:1 Pixel-to-Second Mapping
     const currentTimeWS = waveSurferRef.current.getCurrentTime();
     const newTime = currentTimeWS - (deltaX / pxPerSec);
     const safeTime = Math.max(0, Math.min(newTime, duration));
     
     // Update playback engine directly
     audioElement.currentTime = safeTime;
     waveSurferRef.current.seekTo(safeTime / duration);
  };

  // Resume on release
  const handlePointerUp = () => {
     if (!isDraggingRef.current) return;
     isDraggingRef.current = false;
     
     if (wasPlayingRef.current && audioElement && audioElement.paused) {
        audioElement.play().catch(e => console.log('Playback resume error:', e));
     }
  };

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex flex-col bg-black overflow-hidden select-none touch-none"
    >
      {/* Top Header */}
      <div className="relative z-50 flex items-center justify-between px-6 pt-12 md:px-10 md:pt-16 flex-none">
         <div className="flex flex-col">
            <h1 className="text-white text-3xl md:text-4xl font-black italic tracking-tighter leading-none">Mix</h1>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <span className="text-white/40 text-[8px] md:text-[9px] font-black uppercase tracking-[3px] md:tracking-[4px] italic leading-none">Studio Signal</span>
            </div>
         </div>
         <button onClick={onBack} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 active:scale-95 transition-all">
            <ChevronDown size={28} strokeWidth={3} />
         </button>
      </div>

      {/* Amber Signal Hub (Strict Reference Style) */}
      <div className="relative z-50 flex justify-center mt-4">
         <div className="w-14 h-14 rounded-full bg-black/40 border border-white/10 flex items-center justify-center shadow-2xl">
            <div className="flex items-end gap-[1.5px] h-4">
               {[1,2,3,4,5].map(i => (
                  <motion.div 
                    key={i} 
                    animate={isPlaying ? { height: [3, 12, 3] } : { height: 3 }}
                    transition={{ duration: 0.5 + i*0.1, repeat: Infinity }}
                    className="w-1 bg-[#d4a017] rounded-full shadow-[0_0_8px_rgba(212,160,23,0.5)]" 
                  />
               ))}
            </div>
         </div>
      </div>

      {/* Calculated Space Container - Ensures Reels fit phone viewports perfectly */}
      <div className="flex-1 flex flex-col items-center justify-center relative min-h-0 overflow-hidden select-none pointer-events-none">
         <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="w-px h-full bg-white/[0.1] -translate-x-24" />
            <div className="w-px h-full bg-white/[0.1] translate-x-24" />
         </div>

         <div className="flex items-center justify-center w-full h-full max-h-[400px]">
            <div className="flex items-center justify-center -space-x-[12vw] w-full h-full">
               <Reel isPlaying={isPlaying} reverse={false} />
               <Reel isPlaying={isPlaying} reverse={true} />
            </div>
         </div>
         
         <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-80 scale-125">
            {/* Bold Industrial Sharp Needle */}
            <div className="relative w-10 h-10 flex flex-col items-center">
               <div className="absolute bottom-0 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[24px] border-b-black" />
               <div className="absolute bottom-[2px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[20px] border-b-[#111]" />
            </div>
            <div className="w-px h-16 bg-white/20 mt-4 shadow-[0_0_10px_white]" />
         </div>
      </div>

      {/* "SNOW-WHITE" CHASSIS CARD (Strict Goal Reference) */}
      <div className="w-full flex justify-center pb-8 flex-none">
         <motion.div 
           initial={{ y: 250 }}
           animate={{ y: 0 }}
           className="w-[94vw] max-w-[420px] p-6 pt-10 rounded-[56px] bg-white shadow-4xl flex flex-col gap-8 relative z-50 overflow-hidden"
         >
            {/* Header: Exact Title/Artist Framing */}
            <div className="grid grid-cols-3 items-center px-2">
               <div className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center">
                  <Music size={22} className="opacity-20" />
               </div>
               <div className="flex flex-col items-center text-center">
                  <h2 className="text-black text-[22px] font-bold tracking-tight leading-none truncate w-full">{song.title}</h2>
                  <p className="text-black/30 text-[10px] font-medium mt-1 truncate w-full uppercase tracking-widest">{song.artist}</p>
               </div>
               <div className="flex justify-end">
                  <button onClick={onToggleLike} className="w-14 h-14 rounded-full bg-black/5 flex items-center justify-center text-black/30">
                     <Bookmark size={20} className={isLiked ? "fill-current text-black" : ""} />
                  </button>
               </div>
            </div>

            {/* WAVEFLOW: SOLID BLOCK SILHOUETTE DESIGN */}
            <div 
              className="relative w-full h-[160px] bg-[#f8f8f8] rounded-[40px] overflow-hidden shadow-inner cursor-pointer touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
               {/* High-Resolution Grid Lines */}
               <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(to right, #000 1px, transparent 1px)', backgroundSize: '10px 100%' }} 
               />
               
               {/* WaveSurfer rendering container */}
               <div ref={containerRef} className="w-full h-full pointer-events-none" />
               
               {/* STATIONARY NEEDLE (Bold High-Contract) */}
               <div className="absolute left-1/2 top-4 bottom-4 w-px bg-black z-20 -translate-x-1/2 pointer-events-none flex flex-col items-center justify-between">
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black" />
                  <div className="flex-1 w-[1.5px] bg-black" />
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-black" />
               </div>
            </div>

            {/* MINIMAL FOOTER: Status | AirPods | Controls */}
            <div className="flex items-center justify-between px-2 pb-2">
               <div className="w-12 h-12 flex items-center justify-center opacity-30">
                  <Volume2 size={20} />
               </div>

               <div className="flex items-center gap-4">
                  <button onClick={onPrev} className="p-2 opacity-40 active:opacity-100 transition-opacity"><Play size={18} className="rotate-180 fill-current" /></button>
                  <button 
                    onClick={onTogglePlay} 
                    className="w-[72px] h-[72px] rounded-full bg-black text-white flex items-center justify-center shadow-2xl active:scale-95 transition-all"
                  >
                     {isPlaying ? <Pause size={30} className="fill-current" /> : <Play size={30} className="fill-current ml-1" />}
                  </button>
                  <button onClick={onNext} className="p-2 opacity-40 active:opacity-100 transition-opacity"><Play size={18} className="fill-current" /></button>
               </div>

               <div className="flex flex-col items-end opacity-40 gap-1 pr-2">
                  <span className="text-black font-bold text-[10px] tabular-nums tracking-tighter">{formatTime(currentTime)}</span>
                  <div className="flex items-center gap-1">
                     <Headphones size={12} strokeWidth={3} />
                     <span className="text-black text-[7px] font-black uppercase tracking-widest italic">airpods</span>
                  </div>
               </div>
            </div>
         </motion.div>
      </div>

    </motion.div>
  );
}

/* ── STUDIO-SYNC PLAYER BAR ── */
export function MobileStudioBar({ song, isPlaying, onTogglePlay, onOpenFullscreen }) {
  if (!song) return null;
  return (
    <div 
      onClick={onOpenFullscreen}
      className="h-[84px] w-full bg-black border-t border-white/5 flex items-center px-6 relative cursor-pointer"
    >
       <div className="absolute left-0 top-0 bottom-0 w-2 bg-white" />
       <div className="flex-1 min-w-0 pr-4">
          <h3 className="text-white font-black text-lg leading-none truncate uppercase tracking-tighter italic">{song.title}</h3>
          <div className="flex items-center gap-2 mt-2">
             <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
             <p className="text-white/40 font-black text-[9px] uppercase tracking-widest italic">Live Mix Active</p>
          </div>
       </div>
       <button 
         onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
         className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
       >
          {isPlaying ? <Pause size={22} className="fill-current" /> : <Play size={22} className="fill-current ml-1" />}
       </button>
    </div>
  );
}
