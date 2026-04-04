import { Play, Pause, SkipForward, SkipBack, Home, Compass, Disc, Radio, User, ChevronUp, Heart, Sparkles, Palette, Menu, X, Users, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";

const NAV_ITEMS = [
  { id: "home",     label: "Home",     Icon: Home },
  { id: "discover", label: "Discovery", Icon: Compass },
  { id: "albums",   label: "Vault",   Icon: Disc },
  { id: "blend",    label: "Synergy",  Icon: Users },
  { id: "themes",   label: "Canvas",   Icon: Palette },
];

/* ────────────────────────────────────────────
   BOTTOM PLAYER BAR
   Slim persistent bar at the bottom of the screen.
   Tap the song artwork/title to expand to fullscreen.
──────────────────────────────────────────── */
/* ────────────────────────────────────────────
   NIAGARA DOCK (Player)
   High-performance, thumb-accessible player dock.
   Sit at the top right or bottom depending on flow.
   ──────────────────────────────────────────── */
function MobilePlayerBar({ song, isPlaying, onTogglePlay, onNext, onPrev, progress, onOpenFullscreen, themeColor }) {
  if (!song) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[360px] flex items-center justify-between bg-black text-white p-2.5 pl-3 pr-5 rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 active:scale-[0.98] transition-all"
    >
      {/* Liquid Spinning Record */}
      <div 
        onClick={onOpenFullscreen}
        className="flex items-center gap-4 group"
      >
        <div className="relative w-14 h-14">
          {/* Outer Progress Glow */}
          <svg className="absolute inset-0 -rotate-90 w-full h-full p-0.5">
            <circle cx="28" cy="28" r="25" fill="none" stroke="white" strokeWidth="1" strokeDasharray="157" strokeDashoffset={157 - (157 * progress) / 100} strokeLinecap="round" className="transition-all duration-300 opacity-60" />
            <circle cx="28" cy="28" r="25" fill="none" stroke="white" strokeWidth="1" className="opacity-5" />
          </svg>
          
          <div className={`w-10 h-10 rounded-full overflow-hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/20 shadow-2xl ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <img src={song.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-0.5">
           <span className="text-[12px] font-black uppercase tracking-tight truncate max-w-[120px]">{song.title}</span>
           <span className="text-[9px] font-bold text-white/30 uppercase tracking-[3px] truncate max-w-[100px]">{song.artist}</span>
        </div>
      </div>

      {/* Control Set */}
      <div className="flex items-center gap-3">
         <button onClick={onPrev} className="text-white/20 hover:text-white transition-colors"><SkipBack size={16} fill="currentColor" /></button>
         <button 
           onClick={(e) => { e.stopPropagation(); onTogglePlay(); }}
           className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-90 transition-transform"
         >
           {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
         </button>
         <button onClick={onNext} className="text-white/20 hover:text-white transition-colors"><SkipForward size={16} fill="currentColor" /></button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   NIAGARA GESTURE SIDEBAR (Strict Right)
   Press and slide vertically to scroll through pages.
   Release on an item to navigate.
   ──────────────────────────────────────────── */
function MobileNav({ activeNav, onNavChange }) {
  const [isGesturing, setIsGesturing] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);
  const itemsRef = useRef([]);

  const handlePointerMove = (e) => {
    if (!isGesturing) return;
    const y = e.clientY;
    
    // Find closest item
    let closestIdx = 0;
    let minDist = Infinity;
    
    itemsRef.current.forEach((el, idx) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const dist = Math.abs(y - centerY);
      if (dist < minDist) {
        minDist = dist;
        closestIdx = idx;
      }
    });

    if (closestIdx !== hoverIdx) {
      setHoverIdx(closestIdx);
    }
  };

  const handlePointerUp = () => {
    if (isGesturing && hoverIdx !== null) {
      onNavChange(NAV_ITEMS[hoverIdx].id);
    }
    setIsGesturing(false);
    setHoverIdx(null);
  };

  return (
    <div 
      className="fixed right-0 top-1/2 -translate-y-1/2 w-12 z-[5000] flex flex-col items-center justify-center pointer-events-auto touch-none select-none py-10"
      onPointerDown={(e) => {
        setIsGesturing(true);
        handlePointerMove(e);
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Immersive Full-Window Glass Overlay during Gesture */}
      <AnimatePresence>
        {isGesturing && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/40 z-[-1] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col gap-8 items-end pr-4">
        {NAV_ITEMS.map(({ id, label, Icon }, i) => {
          const isHovered = hoverIdx === i;
          const isActive = activeNav === id;
          
          return (
            <motion.div
              key={id}
              ref={el => itemsRef.current[i] = el}
              animate={{ 
                scale: isHovered ? 2.2 : 1,
                x: isHovered ? -15 : 0,
                opacity: isGesturing ? (isHovered ? 1 : 0.15) : (isActive ? 1 : 0.25),
                filter: isGesturing && !isHovered ? "blur(2px)" : "blur(0px)"
              }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="flex items-center gap-4 relative"
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: -10 }}
                    exit={{ opacity: 0, x: 5 }}
                    className="absolute right-10 text-[7px] font-black uppercase tracking-[4px] whitespace-nowrap text-white drop-shadow-[0_2px_10px_rgba(0,0,0,1)]"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/40'}`}>
                <Icon size={16} strokeWidth={isActive || isHovered ? 3 : 1.5} />
              </div>

              {isActive && !isGesturing && (
                 <motion.div 
                   layoutId="active-nav-indicator"
                   className="absolute -right-5 w-1 h-8 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]" 
                 />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Vertical Rail Line */}
      <div className="absolute right-2 top-1/4 bottom-1/4 w-[1px] bg-white/5 pointer-events-none" />
    </div>
  );
}

export { MobilePlayerBar, MobileNav };
