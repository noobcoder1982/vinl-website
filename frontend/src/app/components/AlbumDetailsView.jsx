import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Clock, ChevronLeft, MoreHorizontal, Share2, Heart, Music2, Disc } from "lucide-react";

export function AlbumDetailsView({ album, songs, currentSong, isPlaying, onSongSelect, onBack, themeColor, likedSongs = [], onToggleLike }) {
  // Filter songs for this specific album
  const albumSongs = songs.filter(s => s.album === album.name || s.album === album.title);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-full flex flex-col bg-background rounded-[16px] overflow-hidden relative"
    >
      {/* Dynamic Background Backdrop */}
      <div 
        className="absolute inset-0 opacity-40 blur-[120px] pointer-events-none"
        style={{ background: `radial-gradient(circle at 20% 30%, ${themeColor || '#1f1f1f'} 0%, transparent 100%)` }}
      />

      {/* Header / Back Button */}
      <div className="relative z-20 p-8 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-card/5 border border-border flex items-center justify-center hover:bg-card/10 transition-all active:scale-90"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="relative z-10 flex-1 overflow-y-auto custom-scrollbar">
        {/* Album Hero Section */}
        <div className="flex flex-col md:flex-row items-end gap-8 px-10 pb-10 pt-4">
          <motion.div 
            layoutId={`album-cover-${album.id}`}
            className="w-full max-w-[280px] aspect-square rounded-[24px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)] border border-border"
          >
            <img src={album.imageUrl} className="w-full h-full object-cover" alt={album.name} />
          </motion.div>
          
          <div className="flex flex-col gap-4 flex-1">
            <span className="text-foreground/40 text-[12px] font-black uppercase tracking-[4px]">Album</span>
            <h1 className="text-foreground text-[72px] font-black tracking-tighter leading-[0.85] mb-2">{album.name}</h1>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-card/10 flex items-center justify-center border border-border">
                <Music2 size={14} className="text-foreground/60" />
              </div>
              <span className="text-foreground font-bold text-lg">{albumSongs[0]?.artist || 'Various Artists'}</span>
              <span className="text-foreground/20">•</span>
              <span className="text-foreground/40 font-medium">{albumSongs.length} songs</span>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <button 
                onClick={() => onSongSelect(albumSongs[0])}
                className="h-14 px-8 rounded-full bg-white text-black font-black text-[15px] flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                {isPlaying && albumSongs.some(s => s.id === currentSong?.id) ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current" />}
                {isPlaying && albumSongs.some(s => s.id === currentSong?.id) ? 'Pause' : 'Play Album'}
              </button>
              
              <button className="w-14 h-14 rounded-full border border-border bg-card/5 flex items-center justify-center text-foreground hover:bg-card/10 transition-all">
                <Heart size={20} />
              </button>
              
              <button className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center text-foreground/40 hover:text-foreground transition-all">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Tracklist Table */}
        <div className="px-10 mt-8 pb-[100px]">
          <div className="grid grid-cols-[40px_1fr_120px_60px] gap-4 py-4 border-b border-white/5 text-foreground/20 text-[11px] font-black uppercase tracking-widest px-4">
            <div className="text-center">#</div>
            <div>Title</div>
            <div className="text-right"><Clock size={14} className="ml-auto" /></div>
            <div></div>
          </div>

          <div className="flex flex-col mt-2">
            {albumSongs.map((song, idx) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSongSelect(song)}
                className={`grid grid-cols-[40px_1fr_120px_60px] gap-4 items-center py-4 px-4 rounded-xl cursor-pointer group transition-all ${currentSong?.id === song.id ? 'bg-primary/20 shadow-lg' : 'hover:bg-primary/10'}`}
              >
                <div className="text-center text-foreground/30 font-bold group-hover:hidden tabular-nums">
                  {currentSong?.id === song.id && isPlaying ? (
                    <div className="flex items-end justify-center gap-0.5 h-3">
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [4, 12, 6, 12, 4] }}
                          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-white"
                        />
                      ))}
                    </div>
                  ) : idx + 1}
                </div>
                <div className="hidden group-hover:flex items-center justify-center">
                  {currentSong?.id === song.id && isPlaying ? <Pause size={14} className="text-foreground fill-white" /> : <Play size={14} className="text-foreground fill-white" />}
                </div>

                <div className="flex flex-col min-w-0">
                  <span className={`font-bold truncate ${currentSong?.id === song.id ? 'text-foreground' : 'text-foreground/90'}`}>{song.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-foreground/40 text-[12px] truncate">{song.artist}</span>
                    {song.language && (
                      <span className="px-1.5 py-0.5 rounded-full bg-card/5 border border-border text-foreground/40 text-[8px] font-black uppercase tracking-widest scale-90">
                        {song.language}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right text-foreground/40 tabular-nums font-medium text-[13px]">
                   {typeof song.duration === 'string' ? song.duration : `${Math.floor(song.duration / 60)}:${String(song.duration % 60).padStart(2, '0')}`}
                </div>

                <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                       e.stopPropagation();
                       onToggleLike?.(song.id);
                    }}
                    className="p-2 -m-2 hover:scale-125 transition-transform"
                  >
                    <Heart 
                      size={14} 
                      className={`transition-colors ${likedSongs.includes(song.id) ? "text-red-500 fill-red-500" : "text-foreground/20 hover:text-red-500"}`} 
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Related Albums - Dynamic */}
          <div className="mt-20">
            <div className="flex items-center gap-3 mb-10">
               <div className="w-1 h-6 bg-white rounded-full" />
               <h2 className="text-foreground text-2xl font-black">More Masterpieces</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
               {Array.from(new Set(songs.map(s => s.album))).filter(a => a !== album.name).slice(0, 5).map(otherAlbumName => {
                 const otherAlbumSong = songs.find(s => s.album === otherAlbumName);
                 if (!otherAlbumSong) return null;
                 
                 const otherAlbumObj = {
                    id: otherAlbumSong.albumId || otherAlbumSong.id || otherAlbumName,
                    name: otherAlbumName,
                    artist: otherAlbumSong.artist,
                    imageUrl: otherAlbumSong.imageUrl,
                    songs: songs.filter(s => s.album === otherAlbumName)
                 };

                 return (
                   <div 
                    key={otherAlbumName} 
                    onClick={() => onBack() || setTimeout(() => window.dispatchEvent(new CustomEvent('switch-album', { detail: otherAlbumObj })), 0)} // Hacky way for now or better to pass prop
                    className="group cursor-pointer"
                   >
                      <div 
                        onClick={() => {
                          // We need a better way to navigate between albums from within the detail view.
                          // For now, I'll update the component to handle internal selection or pass a 1-click onAlbumSelect.
                          // Let's assume the parent can handle this.
                        }}
                        className="aspect-square w-full rounded-[20px] bg-card/5 border border-border overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform shadow-lg"
                      >
                         <img src={otherAlbumSong.imageUrl} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all" />
                      </div>
                      <h4 className="text-foreground font-bold truncate mb-1 group-hover:text-amber-400 transition-colors uppercase tracking-tight text-sm">{otherAlbumName}</h4>
                      <p className="text-foreground/40 text-[11px] font-bold uppercase tracking-widest">{otherAlbumSong.artist}</p>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </motion.div>
  );
}
