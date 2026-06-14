import { useRef, useState } from "react";
import { 
  Heart, Trash2, Search, ListMusic, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Repeat1, Home, Compass, Radio, Disc, Sparkles, ChevronLeft, ChevronRight, User, 
  LogOut, Volume2, VolumeX, Palette, Mail, Terminal, Zap, ChevronsLeft, ChevronsRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PLAYLISTS } from "../data";

export function Sidebar({ 
  activeNav, onNavChange, onBack, onForward, canGoBack, canGoForward, 
  activePlaylist, onPlaylistSelect, song, isPlaying, onTogglePlay, 
  onNext, onPrev, progress, onSeek, isFullScreen, onOpenFullscreen, 
  themeColor, isDark, likedSongs, onToggleLike, user, onLogout, 
  isShuffle, repeatMode, onToggleShuffle, onToggleRepeat, 
  volume, onVolumeChange, inboxCount = 0, hasNewPost = false 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const progressBarRef = useRef(null);
  const isLiked = likedSongs?.includes(song?.id);
  const isNeon = document.body.classList.contains('neon');

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSeek(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  const handlePointerMove = (e) => {
    if (e.buttons === 1 && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      onSeek(Math.max(0, Math.min(100, (x / rect.width) * 100)));
    }
  };

  const navItems = [
    { name: "home", icon: Home },
    { name: "discover", icon: Compass },
    { name: "radio", icon: Radio },
    { name: "albums", icon: Disc },
    { name: "blend", icon: Sparkles },
    { name: "inbox", icon: Mail, badge: true },
    { name: "themes", icon: Palette }
  ];

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 76 : 213 }}
      transition={{ type: "spring", stiffness: 400, damping: 35 }}
      className="relative flex-none h-[calc(100%-30px)] overflow-hidden rounded-[24px] m-[15px] mr-0 border border-border bg-sidebar shadow-xl z-[100]"
    >
      
      {/* ── COLLAPSE BUTTON OVERLAY ── */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`absolute top-[20px] right-[10px] w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center border border-border hover:bg-foreground/10 transition-all z-[110]
          ${isCollapsed ? 'left-[22px]' : ''}
        `}
      >
        {isCollapsed ? <ChevronsRight size={14} className="text-foreground" /> : <ChevronsLeft size={14} className="text-foreground" />}
      </button>

      {/* Top Header Controls (Back/Forward) */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[20px] left-[16px] flex items-center gap-[8px]"
          >
            <button className={`w-[32px] h-[32px] rounded-full bg-foreground/5 flex items-center justify-center border border-border transition-opacity ${canGoBack ? 'opacity-80 hover:opacity-100' : 'opacity-20 cursor-default'}`} onClick={() => canGoBack && onBack()}><ChevronLeft size={18} className="text-foreground" /></button>
            <button className={`w-[32px] h-[32px] rounded-full bg-foreground/5 flex items-center justify-center border border-border transition-opacity ${canGoForward ? 'opacity-80 hover:opacity-100' : 'opacity-20 cursor-default'}`} onClick={() => canGoForward && onForward()}><ChevronRight size={18} className="text-foreground" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH HUB */}
      <AnimatePresence>
        {!isCollapsed && activeNav !== "discover" && (
          <motion.div layoutId="sidebar-search" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-[68px] left-[12px] right-[12px] h-[40px] bg-foreground/[0.04] border border-border/60 rounded-lg flex items-center px-[12px] gap-[10px] focus-within:bg-foreground/[0.07] focus-within:border-primary/30 transition-all group overflow-hidden">
            <Search size={14} className="text-foreground/20 group-focus-within:text-primary transition-colors" />
            <input type="text" placeholder="CMD_SEARCH..." className="bg-transparent text-foreground text-[10px] font-black uppercase tracking-[3px] outline-none flex-1 placeholder-foreground/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className={`absolute left-[12px] right-[12px] flex flex-col gap-[2px] transition-all duration-300 ${isCollapsed ? 'top-[68px]' : 'top-[132px]'}`}>
        {navItems.map((item) => (
          <button 
            key={item.name} 
            onClick={() => onNavChange(item.name)} 
            className={`px-[12px] h-[40px] rounded-[14px] text-left capitalize flex items-center gap-[12px] relative transition-all group/nav ${activeNav === item.name ? "bg-foreground/5 text-foreground shadow-sm" : "text-foreground/40 hover:text-foreground hover:bg-foreground/[0.02]"}`}
          >
            <item.icon size={22} className={activeNav === item.name ? "opacity-100" : "opacity-40"} />
            {!isCollapsed && (
              <span className="text-[14px] font-medium tracking-tight whitespace-nowrap">{item.name}</span>
            )}
            
            {/* Inbox Badge */}
            {item.badge && inboxCount > 0 && (
               <div className={`absolute rounded-full bg-primary text-primary-foreground text-[9px] font-black flex items-center justify-center border border-background shadow-lg ${isCollapsed ? 'top-1 right-1 w-4 h-4' : 'top-2 right-4 w-5 h-5'}`}>
                  {inboxCount}
               </div>
            )}

            {/* Tooltip for collapsed mode */}
            {isCollapsed && (
               <div className="absolute left-[64px] bg-foreground text-background text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover/nav:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest z-[200]">
                  {item.name}
               </div>
            )}
          </button>
        ))}
      </nav>

      {/* MINI PLAYER (Neon or Glass) */}
      {song && (
        <AnimatePresence>
          <motion.div 
            layout
            className={`absolute bottom-[16px] left-[13px] right-[13px] rounded-[24px] flex flex-col items-center shadow-2xl border transition-all duration-500 mini-player cursor-pointer
              ${isCollapsed ? 'p-[8px] h-[58px] justify-center' : 'p-[10px]'}
              ${isNeon 
                ? 'bg-[#05050d]/90 border-cyan-500/20 shadow-[0_10px_30px_rgba(0,240,255,0.15)] text-white' 
                : 'bg-card border-border text-foreground'
              }
            `} 
            style={{ backdropFilter: 'blur(32px)' }}
            onClick={onOpenFullscreen}
          >
            {/* Mini Vinyl Container */}
            <div className={`w-full aspect-square bg-foreground/5 rounded-[20px] flex items-center justify-center p-[8px] shadow-sm relative group border transition-all 
              ${isCollapsed ? 'hidden' : 'mb-[12px]'}
              ${isNeon ? 'border-cyan-500/10 bg-cyan-950/5' : 'border-border'}
            `}>
               <div id="mini-vinyl-source" className={`w-[96%] aspect-square rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden transition-opacity vinyl-record ${isFullScreen ? 'opacity-0' : 'opacity-100'}`}>
                  {/* Vinyl Record Body */}
                  <div className={`absolute inset-0 rounded-full border-2 
                    ${isNeon ? 'bg-[#0d0d12] border-cyan-500/30 shadow-[0_0_15px_rgba(0,240,255,0.2)]' : 'bg-[#111] border-black/50'}
                  `}
                    style={{
                      background: "repeating-radial-gradient(#151515 0px, #020202 1px, #151515 3px, #0c0c0c 4px)"
                    }}
                  />
                  <div className="w-full h-full relative" style={{ animation: isPlaying ? 'spin 5s linear infinite' : 'none' }}>
                     {/* Label Cover */}
                     <div className={`absolute inset-[30%] rounded-full overflow-hidden border bg-zinc-800
                       ${isNeon ? 'border-fuchsia-500/40 shadow-[0_0_10px_rgba(255,0,85,0.4)]' : 'border-black/20'}
                     `}>
                       <img src={song?.imageUrl} className="w-full h-full object-cover select-none pointer-events-none" alt="" />
                     </div>
                  </div>
                  {/* Spindle Pin */}
                  <div className={`absolute w-3 h-3 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] border
                    ${isNeon ? 'bg-cyan-400 border-cyan-400' : 'bg-[#ccc] border-black/40'}
                  `} />
               </div>
            </div>

            {!isCollapsed ? (
              <>
                <p className={`text-[13px] font-black mb-[4px] text-center w-full truncate px-[4px] tracking-tight uppercase
                  ${isNeon ? 'text-[#ff0055] [text-shadow:0_0_8px_rgba(255,0,85,0.4)] font-mono italic' : 'text-foreground'}
                `}>
                  {song?.title}
                </p>
                <p className={`text-[9px] font-bold text-center w-full truncate px-[4px] uppercase tracking-widest mb-3.5
                  ${isNeon ? 'text-cyan-400 opacity-80 [text-shadow:0_0_5px_rgba(0,240,255,0.3)]' : 'opacity-40 text-foreground'}
                `}>
                  {song?.artist}
                </p>
                
                <div className="flex items-center gap-[12px] mb-[14px]">
                   <button 
                     onClick={(e) => { e.stopPropagation(); onPrev(); }} 
                     className={`transition-all active:scale-90
                       ${isNeon ? 'text-cyan-400 hover:text-cyan-300' : 'text-foreground/60 hover:text-foreground'}
                     `}
                   >
                     <SkipBack size={16} className="fill-current" />
                   </button>
                   
                   <button 
                     onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} 
                     className={`w-[38px] h-[38px] rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg
                       ${isNeon 
                         ? 'bg-[#ff0055] text-white hover:bg-[#ff0055]/90 shadow-[0_0_15px_rgba(255,0,85,0.4)]' 
                         : 'bg-white text-black'
                       }
                     `}
                   >
                     {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}
                   </button>
                   
                   <button 
                     onClick={(e) => { e.stopPropagation(); onNext(); }} 
                     className={`transition-all active:scale-90
                       ${isNeon ? 'text-cyan-400 hover:text-cyan-300' : 'text-foreground/60 hover:text-foreground'}
                     `}
                   >
                     <SkipForward size={16} className="fill-current" />
                   </button>
                </div>
                
                {/* Progress Seek Bar */}
                <div 
                  ref={progressBarRef} 
                  className={`w-[85%] h-[3.5px] rounded-full relative cursor-pointer overflow-hidden mb-4
                    ${isNeon ? 'bg-cyan-950/40' : 'bg-foreground/10'}
                  `} 
                  onPointerDown={handlePointerDown} 
                  onPointerMove={handlePointerMove}
                >
                  <div 
                    className={`absolute top-0 left-0 h-full rounded-full transition-all
                      ${isNeon ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]' : 'bg-white shadow-[0_0_8px_white]'}
                    `} 
                    style={{ width: `${progress}%` }} 
                  />
                </div>
              </>
            ) : (
               <div className={`w-10 h-10 rounded-full border flex items-center justify-center relative overflow-hidden transition-all
                 ${isNeon ? 'border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.3)] animate-spin-slow' : ''}
               `}>
                  <img src={song?.imageUrl} className={`w-full h-full object-cover rounded-full ${isPlaying && !isNeon ? 'animate-spin-slow' : ''}`} alt="" />
                  <div className="absolute inset-0 bg-black/10" />
               </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}