import { Disc, Play, Plus, Trash2, MoreVertical, Heart, Music2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: { y: 0, opacity: 1, scale: 1, transition: { type: "spring", damping: 20, stiffness: 100 } }
};

export function AlbumsView({
  songs,
  likedSongs = [],
  onAlbumSelect,
  playlists = [],
  onCreatePlaylist,
  onDeletePlaylist
}) {
  const [isHovered, setIsHovered] = useState(null);

  // Group songs by album
  const albumsMap = songs.reduce((acc, song) => {
    const albumName = song.album || "Unknown Album";
    if (!acc[albumName]) {
      acc[albumName] = {
        id: song.albumId || `album-${albumName}`,
        name: albumName,
        artist: song.artist,
        imageUrl: song.imageUrl,
        songs: []
      };
    }
    acc[albumName].songs.push(song);
    return acc;
  }, {});

  const albums = Object.values(albumsMap);

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-4 md:px-8 pt-6 md:pt-8 pb-[100px] relative w-full">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0 mb-8 md:mb-12 relative z-10">
        <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
                <Disc size={32} className="animate-spin-slow" />
            </div>
            <div>
                <h1 className="text-foreground text-[32px] md:text-[48px] font-black tracking-tighter leading-none mb-2">The Vinyl Vault</h1>
                <p className="text-foreground/40 text-[10px] md:text-sm font-black uppercase tracking-[2px] md:tracking-[4px]">Curated Collections • {albums.length} Masterpieces</p>
            </div>
        </div>

        <button 
           onClick={() => {
              const name = prompt("Enter Playlist Name:");
              if (name) onCreatePlaylist(name);
           }}
           className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card/5 border border-white/10 text-foreground font-bold hover:bg-card/10 hover:border-white/20 transition-all active:scale-95 group"
        >
            <Plus size={20} className="text-foreground group-hover:rotate-90 transition-transform" />
            <span>Create Collection</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 relative z-10">
        
        {/* Playlists Section (Custom) */}
        {playlists.length > 0 && (
           <div className="mb-16">
              <h2 className="text-foreground/20 text-[10px] font-black uppercase tracking-[6px] mb-6 md:mb-8 ml-2">Personal Curations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-10">
                 {playlists.map((playlist) => (
                    <motion.div
                       key={playlist.id}
                       variants={itemVariants}
                       initial="hidden"
                       animate="visible"
                       className="group relative"
                    >
                       <div 
                         onClick={() => onAlbumSelect({ ...playlist, isPlaylist: true })}
                         className="relative aspect-square rounded-[32px] overflow-hidden bg-card/5 border border-white/10 shadow-huge group-hover:-translate-y-2 transition-all duration-700 cursor-pointer"
                       >
                          <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                             <Music2 size={64} className="text-foreground/20 group-hover:text-foreground transition-colors" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                          <button 
                             onClick={(e) => { e.stopPropagation(); onDeletePlaylist(playlist.id); }}
                             className="absolute top-4 right-4 p-2 rounded-xl bg-black/40 text-foreground/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all active:scale-90"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                       <div className="mt-5 px-2">
                           <h3 className="text-foreground font-black text-lg truncate uppercase tracking-tight">{playlist.name}</h3>
                           <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-widest mt-1">Custom Stack • {playlist.songs?.length || 0} Tracks</p>
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        )}

        {/* Masterpiece Albums Section */}
        <h2 className="text-foreground/20 text-[10px] font-black uppercase tracking-[6px] mb-8 ml-2">Studio Records</h2>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xxl:grid-cols-6 gap-x-4 md:gap-x-10 gap-y-8 md:gap-y-16 pb-20"
        >
          {albums.map((album) => (
            <motion.div 
              key={album.id} 
              variants={itemVariants}
              onClick={() => onAlbumSelect(album)}
              onMouseEnter={() => setIsHovered(album.id)}
              onMouseLeave={() => setIsHovered(null)}
              className="group cursor-pointer perspective-1000"
            >
              <div 
                 className={`relative aspect-square w-full rounded-[30px] overflow-hidden mb-6 border border-white/10 shadow-huge transform-gpu transition-all duration-700 ease-out ${isHovered === album.id ? 'rotate-y-12 translate-x-3 scale-[1.05]' : ''}`}
                 style={{ 
                   boxShadow: isHovered === album.id ? `0 40px 80px -10px rgba(0,0,0,1), 0 0 40px rgba(0,0,0,0.5)` : '0 25px 50px -12px rgba(0,0,0,0.8)'
                 }}
              >
                {/* 3D Depth Layers */}
                <div className="absolute inset-0 bg-background/40 group-hover:bg-transparent transition-all duration-700" />
                <img src={album.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={album.name} />
                <div className="absolute inset-0 bg-gradient-to-tr from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* Vinyl Record Peeking Out (Digital UX Aesthetic) */}
                <div className="absolute top-[5%] -right-[15%] w-[90%] h-[90%] bg-[#111] rounded-full border border-foreground/5 opacity-0 group-hover:opacity-40 transition-all duration-700 -z-10 animate-spin-slow translate-x-8" />

                <div className="absolute inset-0 flex items-center justify-center translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl">
                       <Play size={28} className="fill-current ml-1" />
                    </div>
                </div>
              </div>

              <div className="px-1 transform transition-all duration-500 group-hover:translate-x-2">
                <h3 className="text-foreground font-black text-xl leading-8 mb-1 line-clamp-1 uppercase tracking-tighter">{album.name}</h3>
                <div className="flex items-center justify-between">
                    <p className="text-foreground/40 text-[11px] font-black uppercase tracking-widest">{album.artist}</p>
                    <div className="h-[2px] w-8 bg-card/10 rounded-full" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .shadow-huge { box-shadow: 0 20px 50px rgba(0,0,0,0.8); }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(-12deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
