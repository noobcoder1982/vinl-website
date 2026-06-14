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

  const radius = 21;
  const strokeCirc = 2 * Math.PI * radius;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onOpenFullscreen}
      className="fixed bottom-[92px] left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[360px] flex items-center justify-between mobile-player-capsule text-foreground p-2 pl-3 pr-4 rounded-[32px] border cursor-pointer active:scale-[0.98] transition-all"
    >
      {/* Liquid Spinning Record */}
      <div 
        className="flex items-center gap-3.5 group min-w-0"
      >
        <div className="relative w-12 h-12 flex-none">
          {/* Outer Progress Glow */}
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 48 48" 
            className="absolute inset-0 -rotate-90 pointer-events-none z-10"
          >
            <circle 
              cx="24" 
              cy="24" 
              r={radius} 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              className="opacity-[0.06] text-foreground" 
            />
            <circle 
              cx="24" 
              cy="24" 
              r={radius} 
              fill="none" 
              stroke={themeColor || "var(--theme-accent, #ff0055)"} 
              strokeWidth="2" 
              strokeDasharray={strokeCirc} 
              strokeDashoffset={strokeCirc - (strokeCirc * progress) / 100} 
              strokeLinecap="round" 
              className="transition-all duration-300"
              style={{
                filter: `drop-shadow(0 0 2.5px ${themeColor || "var(--theme-accent, #ff0055)"}80)`
              }}
            />
          </svg>
          
          {/* Mini Vinyl Record */}
          <div 
            className={`absolute w-10 h-10 rounded-full overflow-hidden top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-black/45 shadow-lg select-none pointer-events-none transition-transform duration-500
              ${isPlaying ? 'animate-spin-slow' : ''}
            `}
            style={{
              background: "repeating-radial-gradient(#151515 0px, #020202 1px, #151515 3px, #0c0c0c 4px)",
              willChange: "transform"
            }}
          >
            {/* Album Cover label */}
            <div className="absolute inset-[28%] rounded-full overflow-hidden border border-black/30 bg-zinc-800">
              <img src={song.imageUrl} className="w-full h-full object-cover select-none pointer-events-none" alt="" />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            
            {/* Center hole spindle pin */}
            <div className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-zinc-400 to-zinc-200 border border-black/40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]" />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-0.5 truncate">
           <span className="text-[12px] font-black uppercase tracking-tight truncate max-w-[110px]">{song.title}</span>
           <span className="text-[9px] font-bold opacity-40 uppercase tracking-[2px] truncate max-w-[90px]">{song.artist}</span>
        </div>
      </div>

      {/* Control Set */}
      <div className="flex items-center gap-3 flex-none" onClick={(e) => e.stopPropagation()}>
         <button onClick={onPrev} className="opacity-40 hover:opacity-100 transition-opacity p-1.5"><SkipBack size={14} fill="currentColor" /></button>
         <button 
           onClick={onTogglePlay}
           className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center shadow-lg active:scale-90 transition-transform"
         >
           {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
         </button>
         <button onClick={onNext} className="opacity-40 hover:opacity-100 transition-opacity p-1.5"><SkipForward size={14} fill="currentColor" /></button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   NIAGARA FLOATING TAB DOCK (Mobile Bottom Capsule)
   Glassmorphic bar with spring active bubbles and micro-animations.
   ──────────────────────────────────────────── */
function MobileNav({ activeNav, onNavChange }) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[4000] w-[90%] max-w-[360px] h-16 rounded-[32px] mobile-nav-capsule flex items-center justify-around px-2 border">
      {NAV_ITEMS.map(({ id, label, Icon }, i) => {
        const isActive = activeNav === id;
        return (
          <button
            key={id}
            onClick={() => onNavChange(id)}
            className="relative flex flex-col items-center justify-center w-12 h-12 rounded-full focus:outline-none transition-all duration-300"
          >
            {/* Active Glass Pill Background */}
            {isActive && (
              <motion.div
                layoutId="activePillBubble"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute inset-0 bg-foreground/10 rounded-full border border-foreground/5 z-0"
              />
            )}

            {/* Icon Wrapper with Micro-animations */}
            <motion.div
              animate={
                isActive
                  ? id === "home"
                    ? { y: [0, -5, 0] }
                    : id === "discover"
                    ? { rotate: [0, 45, -45, 0] }
                    : id === "albums"
                    ? { rotate: 360 }
                    : id === "blend"
                    ? { scale: [1, 1.25, 0.95, 1.1, 1] }
                    : id === "themes"
                    ? { rotate: [0, -12, 12, -6, 6, 0] }
                    : {}
                  : {}
              }
              transition={
                id === "albums" && isActive
                  ? { duration: 4, repeat: Infinity, ease: "linear" }
                  : { duration: 0.6, ease: "easeInOut" }
              }
              className={`relative z-10 transition-colors duration-300 ${
                isActive ? "text-primary scale-110" : "opacity-40"
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
            </motion.div>

            {/* Active Dot Indicator */}
            {isActive && (
              <motion.div
                layoutId="activeDot"
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_var(--primary)] z-10"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

export { MobilePlayerBar, MobileNav };
