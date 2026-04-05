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
          {isNeon ? (
            <motion.div 
              layout
              className={`absolute bottom-[16px] left-[12px] right-[12px] rounded-[24px] p-4 flex flex-col bg-[#020204] border-2 border-[#00ffcc]/20 overflow-hidden group/mini mini-player cursor-pointer
                ${isCollapsed ? 'h-[56px] items-center justify-center p-0' : ''}
              `}
              onClick={onOpenFullscreen}
            >
              {!isCollapsed ? (
                <>
                  <header className="flex items-center justify-between mb-3 border-b border-[#00ffcc]/10 pb-2">
                     <span className="text-[8px] font-black text-[#ffff00] tracking-[3px]">UPLINK_STABLE</span>
                     <Terminal size={10} className="text-[#00ffcc]" />
                  </header>
                  <div className="h-10 w-full flex items-end gap-[3px] mb-3">
                     {Array.from({ length: 12 }).map((_, i) => (
                       <motion.div key={i} animate={isPlaying ? { height: [`${20 + Math.random()*80}%`, `${20 + Math.random()*80}%`] } : { height: '20%' }} transition={{ duration: 0.3, repeat: isPlaying ? Infinity : 0 }} className="flex-1 bg-[#00ffcc] shadow-[0_0_8px_#00ffcc]" />
                     ))}
                  </div>
                  <p className="text-[11px] font-black text-[#ffff00] truncate uppercase tracking-tighter mb-1 font-mono italic">{song.title.replace(/\s/g, '_')}</p>
                  <p className="text-[9px] font-mono text-[#00ffcc]/40 uppercase tracking-widest mb-4">{song.artist.replace(/\s/g, '_')}</p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                     <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-[#ff0055] hover:scale-110 active:scale-95 transition-all"><SkipBack size={16} /></button>
                     <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="w-10 h-10 bg-[#ffff00] text-black flex items-center justify-center rounded-lg shadow-lg hover:scale-105 active:scale-90 transition-all">{isPlaying ? <Pause size={18} className="fill-current" /> : <Play size={18} className="fill-current ml-0.5" />}</button>
                     <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-[#ff0055] hover:scale-110 active:scale-95 transition-all"><SkipForward size={16} /></button>
                  </div>
                  <div ref={progressBarRef} className="w-full h-1 bg-[#ffff00]/10 cursor-pointer overflow-hidden relative" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}><div className="h-full bg-[#ffff00] shadow-[0_0_10px_#ffff00]" style={{ width: `${progress}%` }} /></div>
                </>
              ) : (
                <Terminal size={24} className="text-[#00ffcc] animate-pulse" />
              )}
            </motion.div>
          ) : (
            <motion.div 
              layout
              className={`absolute bottom-[16px] left-[13px] right-[13px] rounded-[24px] flex flex-col items-center shadow-2xl border border-border transition-all duration-500 mini-player cursor-pointer
                ${isCollapsed ? 'p-[8px] h-[58px] justify-center' : 'p-[10px]'}
              `} 
              style={{ backgroundColor: `var(--card)`, backdropFilter: 'blur(32px)' }}
              onClick={onOpenFullscreen}
            >
              <div className={`w-full aspect-square bg-foreground/5 rounded-[20px] flex items-center justify-center p-[8px] shadow-sm relative group border border-border transition-all ${isCollapsed ? 'hidden' : 'mb-[12px]'}`}>
                 <div id="mini-vinyl-source" className={`w-[96%] aspect-square rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden transition-opacity vinyl-record ${isFullScreen ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="absolute inset-0 rounded-full bg-[#111] border-2 border-black/50" />
                    <div className="w-full h-full relative" style={{ animation: isPlaying ? 'spin 5s linear infinite' : 'none' }}>
                       <div className="absolute inset-[30%] rounded-full bg-white overflow-hidden border border-black/20"><img src={song?.imageUrl} className="w-full h-full object-cover" /></div>
                    </div>
                 </div>
              </div>
              {!isCollapsed ? (
                <>
                  <p className="text-[14px] font-black mb-[4px] text-center w-full truncate px-[4px] text-foreground tracking-tight">{song?.title}</p>
                  <div className="flex items-center gap-[12px] mb-[14px]">
                     <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-foreground/60 hover:text-foreground transition-all"><SkipBack size={16} className="fill-current" /></button>
                     <button onClick={(e) => { e.stopPropagation(); onTogglePlay(); }} className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-white text-black hover:scale-105 transition-all shadow-lg">{isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}</button>
                     <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-foreground/60 hover:text-foreground transition-all"><SkipForward size={16} className="fill-current" /></button>
                  </div>
                  <div ref={progressBarRef} className="w-[85%] h-[3.5px] rounded-full relative cursor-pointer bg-foreground/10 overflow-hidden mb-4" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}><div className="absolute top-0 left-0 h-full rounded-full bg-white shadow-[0_0_8px_white]" style={{ width: `${progress}%` }} /></div>
                </>
              ) : (
                 <div className="w-10 h-10 rounded-full border-2 border-foreground/10 flex items-center justify-center relative overflow-hidden">
                    <img src={song?.imageUrl} className={`w-full h-full object-cover ${isPlaying ? 'animate-spin-slow' : ''}`} />
                    <div className="absolute inset-0 bg-black/20" />
                 </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
      <style>{`
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}