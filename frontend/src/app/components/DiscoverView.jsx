import { useState, useEffect } from "react";
import { Search, Play, Pause, Heart, Disc, Music2, Headphones, Sparkles, Flame, Mic2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { songService } from "../services/songService";
import { aiService } from "../services/aiService";

export function DiscoverView({ onSongSelect, currentSong, isPlaying, themeColor, likedSongs = [], onToggleLike }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const [isAIRecommending, setIsAIRecommending] = useState(false);

  // Dynamically calculate unique genres from the uploaded songs
  const genres = Array.from(new Set(songs.map(s => s.genre).filter(Boolean))).sort();

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await songService.getSongs();
      setSongs(data);
      setFilteredSongs(data);
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    let timeoutId;
    
    const performSearch = async () => {
      if (!searchQuery) {
        let filtered = songs;
        if (activeGenre) {
          filtered = filtered.filter(s => 
            s.genre?.toLowerCase().includes(activeGenre.toLowerCase())
          );
        }
        setFilteredSongs(filtered);
        setIsAIRecommending(false);
        return;
      }

      // Check if this looks like an AI query (e.g. "I feel sad")
      if (aiService.isAIQuery(searchQuery)) {
        setIsAIRecommending(true);
        const aiResults = await aiService.getRecommendations(searchQuery);
        setFilteredSongs(aiResults);
        setIsAIRecommending(false);
      } else {
        // Standard keyword search
        const lowerQuery = searchQuery.toLowerCase();
        let filtered = songs.filter(s => 
          s.title.toLowerCase().includes(lowerQuery) ||
          s.artist.toLowerCase().includes(lowerQuery) ||
          (s.genre && s.genre.toLowerCase().includes(lowerQuery))
        );
        
        if (activeGenre) {
          filtered = filtered.filter(s => 
            s.genre?.toLowerCase().includes(activeGenre.toLowerCase())
          );
        }
        setFilteredSongs(filtered);
        setIsAIRecommending(false);
      }
    };

    // Debounce search to 800ms to avoid excessive API calls
    timeoutId = setTimeout(performSearch, 800);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeGenre, songs]);

  return (
    <div className="w-full h-full flex flex-col items-center px-6 md:px-[40px] pb-[120px] pt-8 md:pt-[40px] overflow-y-auto no-scrollbar relative scroll-smooth">
      {/* Dynamic Background Glow */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      {/* Header Section */}
      <div className="relative z-10 flex flex-col items-center gap-[40px] w-full max-w-[900px]">
        <div className="flex flex-col items-center gap-[12px]">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border"
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span className="text-foreground/60 text-[11px] font-bold uppercase tracking-widest">Discover New Music</span>
          </motion.div>
          <h1 className="text-foreground text-[40px] md:text-[56px] font-black tracking-tighter text-center leading-[0.9]">
            Search Anything.
          </h1>
        </div>

        {/* Rotating RGB Glowing Search Bar */}
        <div className="relative w-full max-w-[500px] h-[60px] md:h-[64px] group">
          {/* Neon RGB Rotating Border (Desktop Hub) */}
          <div className="absolute -inset-[2px] rounded-full overflow-hidden opacity-40 group-focus-within:opacity-100 transition-all duration-700 pointer-events-none z-0 hidden md:block">
             <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ff4444,#ff8844,#ffff44,#44ff44,#44ffff,#4444ff,#8844ff,#ff44ff,#ff4444)] animate-spin-slow blur-md" />
          </div>
          
          {/* Simple White Glow (Mobile Sync) */}
          <div className="absolute inset-0 rounded-full bg-foreground/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 md:hidden z-0 [.brutalist_&]:hidden" />
          <div className="absolute -inset-[1px] rounded-full border border-white/20 md:hidden z-0 [.brutalist_&]:border-border [.brutalist_&]:border-2" />
          
          <motion.div 
            className="absolute inset-0 bg-card border border-border rounded-full flex items-center px-6 gap-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] z-10 box-border [.brutalist_&]:rounded-sm [.brutalist_&]:border-2 [.brutalist_&]:shadow-[6px_6px_0px_var(--foreground)]"
          >
            <Search size={20} className="text-foreground/30 group-focus-within:text-foreground/70 transition-colors flex-none [.brutalist_&]:text-foreground" />
            <input 
              type="text" 
              placeholder="Search songs, moods..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-foreground text-[15px] md:text-[18px] outline-none flex-1 placeholder-foreground/20 font-medium min-w-0"
            />
            {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-foreground/20 hover:text-foreground transition-colors text-[11px] font-black uppercase tracking-widest flex-none [.brutalist_&]:text-foreground">Clear</button>
            )}
          </motion.div>
        </div>

        <div className="flex flex-wrap justify-center gap-[10px] w-full max-w-[800px]">
          {genres.map((genre, idx) => (
            <motion.button
              key={genre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => setActiveGenre(activeGenre === genre ? null : genre)}
              className={`px-[24px] py-[10px] rounded-full border text-[14px] font-bold transition-all duration-300 [.brutalist_&]:rounded-sm [.brutalist_&]:border-2 ${
                activeGenre === genre 
                ? "bg-primary text-white border-primary shadow-[0_0_15px_var(--primary)] [.brutalist_&]:bg-primary [.brutalist_&]:border-foreground [.brutalist_&]:shadow-[4px_4px_0px_var(--foreground)]" 
                : "bg-foreground/5 border-border text-foreground/40 hover:bg-foreground/10 hover:border-white/20 hover:text-foreground [.brutalist_&]:bg-background [.brutalist_&]:text-foreground [.brutalist_&]:border-foreground"
              }`}
            >
              {genre}
            </motion.button>
          ))}
        </div>

        {/* Results Section */}
        <div className="w-full mt-[40px] flex flex-col gap-[16px]">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-foreground text-[20px] font-black">
              {isAIRecommending ? 'AI is Thinking...' : (searchQuery || activeGenre ? 'Search Results' : 'Trending Now')}
            </h2>
            <span className="text-foreground/20 text-[12px] font-bold uppercase">
              {isAIRecommending ? 'Analyzing mood' : `${filteredSongs.length} songs found`}
            </span>
          </div>

          <AnimatePresence>
            {isAIRecommending && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full mb-4 p-6 rounded-[28px] border border-purple-500/20 bg-gradient-to-r from-purple-900/10 via-blue-900/10 to-transparent flex items-center justify-between overflow-hidden relative shadow-2xl"
              >
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(168,85,247,0.1),transparent)] animate-spin-slow pointer-events-none" />
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center animate-pulse">
                      <Sparkles size={24} className="text-purple-400" />
                   </div>
                   <div>
                      <p className="text-foreground font-black text-sm uppercase tracking-widest">NVIDIA Llama 3.1 is active</p>
                      <p className="text-foreground/40 text-[12px]">Generating custom recommendations for your vibe...</p>
                   </div>
                </div>
                <Loader2 size={24} className="text-purple-400 animate-spin relative z-10" />
              </motion.div>
            )}
          </AnimatePresence>

          {filteredSongs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px]">
                <AnimatePresence mode="popLayout">
                    {filteredSongs.map((song, idx) => (
                      <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ delay: idx * 0.02 }}
                        onClick={() => onSongSelect(song)}
                        className={`group flex items-center p-4 rounded-[20px] border transition-all cursor-pointer [.brutalist_&]:rounded-sm [.brutalist_&]:border-2 ${
                          currentSong?.id === song.id 
                          ? "bg-foreground/10 border-white/20 [.brutalist_&]:bg-card [.brutalist_&]:border-foreground [.brutalist_&]:shadow-[4px_4px_0px_var(--foreground)]" 
                          : "bg-white/[0.03] border-white/5 hover:bg-white/[0.06] hover:border-border [.brutalist_&]:bg-background [.brutalist_&]:border-foreground"
                        }`}
                      >
                        <div className="w-[56px] h-[56px] rounded-[12px] overflow-hidden relative mr-4 flex-shrink-0">
                          <img src={song.imageUrl} className="w-full h-full object-cover" alt={song.title} />
                          
                          {/* Playback Overlay with Rotating RGB Halo for Active Song */}
                          <div className={`absolute inset-0 flex items-center justify-center transition-all ${currentSong?.id === song.id && isPlaying ? 'opacity-100 bg-black/40' : 'opacity-0 group-hover:opacity-100 bg-black/60'}`}>
                            {currentSong?.id === song.id && isPlaying && (
                                <div className="absolute inset-0 z-0">
                                   <div className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#ff0000,#ff8000,#ffff00,#00ff00,#00ffff,#0000ff,#8000ff,#ff00ff,#ff0000)] animate-spin-slow opacity-60 blur-md" />
                                </div>
                            )}
                            <div className="relative z-10 w-[40px] h-[40px] rounded-full bg-foreground/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
                                {currentSong?.id === song.id && isPlaying ? <Pause size={18} className="text-foreground fill-white" /> : <Play size={18} className="text-foreground fill-white ml-0.5" />}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold truncate ${currentSong?.id === song.id ? 'text-foreground' : 'text-foreground/90'}`}>{song.title}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="text-foreground/40 text-[13px] truncate">{song.artist} • {song.genre}</p>
                            {song.language && (
                              <span className="px-2 py-0.5 rounded-full bg-foreground/5 border border-border text-foreground/40 text-[9px] font-black uppercase tracking-widest leading-none">
                                {song.language}
                              </span>
                            )}
                            {song.tags && song.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                    <Sparkles size={8} className="text-yellow-400" />
                                    <span className="text-yellow-400/60 text-[10px] font-black uppercase tracking-tighter italic">
                                        {song.tags[0]}
                                    </span>
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-foreground/40 text-[12px] tabular-nums">{song.duration}</span>
                          <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onToggleLike?.(song.id);
                            }}
                            className="p-1 -m-1 hover:scale-125 transition-transform relative z-20"
                          >
                            <Heart 
                                size={16} 
                                className={`transition-colors ${likedSongs?.includes(song.id) ? "text-red-500 fill-red-500" : "text-foreground/20 hover:text-red-500"}`} 
                            />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[100px] text-foreground/20 gap-4">
              <Mic2 size={48} />
              <p className="font-bold">No songs found. Try a different search.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
