import { Heart, Play, Pause, Clock, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function LikedSongsView({ songs, likedSongs, onSongSelect, currentSong, isPlaying, onBack }) {
  const likedTracks = songs.filter(s => likedSongs.includes(s.id));

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto custom-scrollbar relative">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-red-900/20 via-transparent to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-5xl mx-auto w-full flex flex-col gap-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end gap-8">
           <div className="w-48 h-48 md:w-64 md:h-64 rounded-[40px] bg-gradient-to-br from-red-600 to-rose-900 shadow-2xl flex items-center justify-center relative overflow-hidden group mb-4 md:mb-0">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
              <Heart size={80} className="text-foreground fill-foreground animate-pulse" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => likedTracks.length > 0 && onSongSelect(likedTracks[0])} className="w-16 h-16 rounded-full bg-card/5 flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all">
                    <Play size={24} className="text-black fill-black ml-1" />
                 </button>
              </div>
           </div>

           <div className="flex flex-col gap-2 flex-1">
              <span className="text-foreground/40 text-[10px] font-black uppercase tracking-[4px]">Private Collection</span>
              <h1 className="text-foreground text-[56px] md:text-[80px] font-black tracking-tighter leading-[0.8] mb-2">Liked Songs</h1>
              <div className="flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-card/10 flex items-center justify-center">
                    <Heart size={12} className="text-red-500 fill-red-500" />
                 </div>
                 <p className="text-foreground/60 font-bold text-sm">
                    {likedTracks.length} tracks • {likedTracks.length * 3} minutes of pure synergy
                 </p>
              </div>
           </div>
        </div>

        {/* Tracks Table */}
        <div className="flex flex-col w-full">
           <div className="grid grid-cols-[40px_1fr_120px_40px] px-6 py-4 border-b border-white/5 text-foreground/20 text-[10px] font-black uppercase tracking-widest">
              <span>#</span>
              <span>Title</span>
              <span className="hidden md:block">Album</span>
              <Clock size={14} className="justify-self-end" />
           </div>

           <div className="flex flex-col mt-4">
              {likedTracks.length > 0 ? (
                likedTracks.map((song, i) => (
                  <motion.div 
                    key={song.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => onSongSelect(song)}
                    className={`grid grid-cols-[40px_1fr_120px_40px] items-center px-6 py-4 rounded-3xl transition-all cursor-pointer group ${currentSong?.id === song.id ? 'bg-card/10 text-foreground' : 'hover:bg-card/4 text-foreground/80'}`}
                  >
                     <span className="text-xs font-bold text-foreground/20 group-hover:text-foreground transition-colors">
                        {currentSong?.id === song.id && isPlaying ? <div className="flex items-end gap-[2px] h-3"><div className="w-1 h-full bg-red-500 animate-[bounce_1s_infinite_0.1s]" /><div className="w-1 h-full bg-red-500 animate-[bounce_1s_infinite_0.3s]" /><div className="w-1 h-full bg-red-500 animate-[bounce_1s_infinite_0.5s]" /></div> : i + 1}
                     </span>
                     <div className="flex items-center gap-4 min-w-0 pr-4">
                        <img src={song.imageUrl} className="w-10 h-10 rounded-lg object-cover flex-none" alt="" />
                        <div className="flex flex-col min-w-0">
                           <p className={`font-bold truncate ${currentSong?.id === song.id ? 'text-red-400' : 'text-foreground'}`}>{song.title}</p>
                           <p className="text-foreground/40 text-[11px] font-medium truncate tracking-tight">{song.artist}</p>
                        </div>
                     </div>
                     <span className="hidden md:block text-xs font-medium text-foreground/30 truncate pr-4">{song.album}</span>
                     <span className="text-xs font-bold text-foreground/20 tabular-nums justify-self-end group-hover:text-foreground transition-colors">{song.duration}</span>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-20">
                   <Heart size={48} />
                   <p className="font-bold">No liked songs yet. Start buildling your synergy.</p>
                </div>
              )}
           </div>
        </div>
      </motion.div>

      <style>{`
         @keyframes bounce {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
         }
      `}</style>
    </div>
  );
}
