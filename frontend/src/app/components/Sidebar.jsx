import { useRef } from "react";
import { Heart, Trash2, Search, ListMusic, Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, Repeat1, Home, Compass, Radio, Disc, Sparkles, ChevronLeft, ChevronRight, User, LogOut, Volume2, VolumeX, Palette, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PLAYLISTS } from "../data";

export function Sidebar({ activeNav, onNavChange, onBack, onForward, canGoBack, canGoForward, activePlaylist, onPlaylistSelect, song, isPlaying, onTogglePlay, onNext, onPrev, progress, onSeek, isFullScreen, onOpenFullscreen, themeColor, isDark, likedSongs, onToggleLike, user, onLogout, isShuffle, repeatMode, onToggleShuffle, onToggleRepeat, volume, onVolumeChange, inboxCount = 0, hasNewPost = false }) {
  const progressBarRef = useRef(null);
  const isLiked = likedSongs?.includes(song?.id);

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

  return (
    <div
      className="relative flex-none w-[213px] h-full overflow-hidden rounded-[16px] m-[15px] mr-0 border border-border bg-sidebar"
      >
      
      {/* Top Header Controls */}
      <div className="absolute top-[20px] left-[16px] flex items-center gap-[8px]">
        <button 
          className={`w-[32px] h-[32px] rounded-full bg-foreground/5 flex items-center justify-center border border-border transition-opacity ${canGoBack ? 'opacity-80 hover:opacity-100 hover:bg-foreground/10' : 'opacity-20 cursor-default'}`} 
          onClick={() => canGoBack && onBack()}
        >
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <button 
          className={`w-[32px] h-[32px] rounded-full bg-foreground/5 flex items-center justify-center border border-border transition-opacity ${canGoForward ? 'opacity-80 hover:opacity-100 hover:bg-foreground/10' : 'opacity-20 cursor-default'}`} 
          onClick={() => canGoForward && onForward()}
        >
          <ChevronRight size={18} className="text-foreground" />
        </button>
      </div>

      <div className="absolute top-[20px] right-[16px] flex items-center gap-[10px]">
        {/* Navigation spacer */}
      </div>

      {/* Search Bar with Shared Layout Animation */}
      <AnimatePresence>
        {activeNav !== "discover" && (
          <motion.div 
            layoutId="sidebar-search"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-[75px] left-[14px] right-[14px] h-[44px] bg-foreground/[0.03] border border-foreground/[0.08] rounded-full flex items-center px-[16px] gap-[10px] focus-within:bg-foreground/[0.06] focus-within:border-foreground/20 transition-all group"
          >
            <Search size={16} className="text-foreground/30 group-focus-within:text-foreground/60 transition-colors" />
            <input type="text" placeholder="Search..." className="bg-transparent text-foreground text-[13.5px] outline-none flex-1 placeholder-foreground/20 font-medium" />
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="absolute top-[180px] left-[12px] right-[12px] flex flex-col gap-[4px]">
        {[
          { name: "home", icon: Home },
          { name: "discover", icon: Compass },
          { name: "radio", icon: Radio },
          { name: "albums", icon: Disc },
          { name: "blend", icon: Sparkles },
          { name: "inbox", icon: Mail, badge: true },
          { name: "themes", icon: Palette }
        ].map((item) => (
          <button
            key={item.name}
            onClick={() => onNavChange(item.name)}
            className={`px-[12px] py-[10px] rounded-[12px] text-left capitalize flex items-center gap-[12px] relative ${activeNav === item.name ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:text-foreground"}`}
            style={{ fontSize: "18px" }}>
            
            <motion.div
               animate={item.name === 'inbox' && hasNewPost ? {
                  scale: [1, 1.25, 0.8, 1],
                  rotate: [0, -10, 5, 0],
                  filter: ["blur(0px)", "blur(2px)", "blur(0px)"]
               } : {}}
               transition={{ duration: 0.6, ease: "anticipate" }}
            >
               <item.icon size={22} className={activeNav === item.name ? "opacity-100" : "opacity-40"} />
            </motion.div>

            {item.name}
            {item.name === 'inbox' && inboxCount > 0 && (
               <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-black text-white shadow-lg border-2 border-[#111]"
               >
                  {inboxCount}
               </motion.div>
            )}
          </button>
        ))}

        <div className="mt-4 mb-2 px-3">
          <p className="text-[10px] font-black text-foreground/20 uppercase tracking-[2px]">Your Library</p>
        </div>

        <button
          onClick={() => onNavChange("liked")}
          className={`px-[12px] py-[10px] rounded-[12px] text-left capitalize flex items-center gap-[12px] ${activeNav === "liked" ? "bg-foreground/10 text-foreground" : "text-foreground/50 hover:text-foreground"}`}
          style={{ fontSize: "18px" }}>
          <Heart size={21} className={activeNav === "liked" ? "text-red-500 fill-red-500" : "opacity-40"} />
          Liked
        </button>

      </nav>

      {/* Mini Player */}
      {song && (
        <div 
          className="absolute bottom-[20px] left-[13px] right-[13px] rounded-[24px] p-[10px] flex flex-col items-center shadow-2xl border border-border glass transition-colors duration-500" 
          style={{ 
            backgroundColor: `var(--card)`, 
            backdropFilter: 'blur(32px)',
          }}
        >
          <div className="w-full aspect-square bg-foreground/5 rounded-[20px] flex items-center justify-center p-[8px] mb-[12px] shadow-sm cursor-pointer relative group border border-border" onClick={onOpenFullscreen}>
            <div 
               id="mini-vinyl-source"
               className={`w-[96%] aspect-square rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden transition-opacity ${isFullScreen ? 'opacity-0' : 'opacity-100'}`}
            >
              <div className="absolute inset-0 rounded-full bg-[#111] border-2 border-black/50" />
              <div 
                className="w-full h-full relative" 
                style={{ animation: isPlaying ? 'spin 5s linear infinite' : 'none' }}
              >
                 <div className="absolute inset-[10%] rounded-full border border-white/5" />
                 <div className="absolute inset-[30%] rounded-full bg-white overflow-hidden border border-black/20">
                    <img src={song?.imageUrl} className="w-full h-full object-cover" />
                 </div>
              </div>
              <div className="absolute z-20 w-[6%] aspect-square rounded-full bg-[#f0f0f0] shadow-inner top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            {!isFullScreen && (
                <button onClick={(e) => { e.stopPropagation(); onToggleLike(song.id); }} className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center border border-white/20 text-foreground hover:bg-black/40 transition-colors">
                  <Heart size={16} className={isLiked ? "text-red-500 fill-red-500" : ""} />
                </button>
            )}
          </div>
          <p className="text-[14px] font-black mb-[4px] text-center w-full truncate px-[4px] text-foreground tracking-tight">{song?.title}</p>
          {song?.language && (
            <div className="flex justify-center mb-[8px]">
              <span className="px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-foreground/40 text-[8px] font-black uppercase tracking-widest leading-none">
                {song.language}
              </span>
            </div>
          )}
          <div className="flex items-center gap-[12px] mb-[14px]">
            <button 
              onClick={onToggleShuffle} 
              className={`transition-colors ${isShuffle ? 'text-foreground' : 'text-foreground/20 hover:text-foreground'}`}
            >
              <Shuffle size={14} className={isShuffle ? "drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : ""} />
            </button>

            <button onClick={onPrev} className="text-foreground/60 hover:text-foreground transition-all active:scale-90"><SkipBack size={16} className="fill-current" /></button>
            
            <button 
              onClick={onTogglePlay} 
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center bg-white text-black hover:scale-105 active:scale-90 transition-all shadow-lg group relative"
            >
              {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current ml-0.5" />}
            </button>

            <button onClick={onNext} className="text-foreground/60 hover:text-foreground transition-all active:scale-90"><SkipForward size={16} className="fill-current" /></button>

            <button 
              onClick={onToggleRepeat} 
              className={`transition-colors ${repeatMode !== 'none' ? 'text-foreground' : 'text-foreground/20 hover:text-foreground'}`}
            >
               {repeatMode === 'one' ? <Repeat1 size={14} className="drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" /> : <Repeat size={14} className={repeatMode === 'all' ? "drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]" : ""} />}
            </button>
          </div>
          <div ref={progressBarRef} className="w-[85%] h-[3.5px] rounded-full relative cursor-pointer bg-foreground/10 overflow-hidden mb-4" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}>
            <div className="absolute top-0 left-0 h-full rounded-full bg-white shadow-[0_0_8px_white]" style={{ width: `${progress}%` }} />
          </div>

          {/* Sidebar Volume Control */}
          <div className="w-[85%] flex items-center gap-2 group/vol">
            <button onClick={() => onVolumeChange(volume === 0 ? 70 : 0)} className="text-foreground/40 hover:text-foreground transition-colors">
              {volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <div 
              className="flex-1 h-[3px] bg-foreground/10 rounded-full cursor-pointer relative"
              onPointerDown={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const v = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                onVolumeChange(v);
              }}
            >
              <div 
                className="absolute inset-y-0 left-0 rounded-full bg-white/40 group-hover/vol:bg-white transition-colors" 
                style={{ width: `${volume}%` }} 
              />
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

    </div>
  );
}