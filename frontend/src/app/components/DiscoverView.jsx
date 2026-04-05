import { useState, useEffect, useRef } from "react";
import { 
  Search, Play, Pause, Heart, Sparkles, Flame, 
  Wind, Moon, Zap, Cloud, Coffee, Ghost, 
  Music2, ChevronRight, ChevronLeft, Mic2, Loader2, TrendingUp, Gem
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { songService } from "../services/songService";
import { aiService } from "../services/aiService";

// Emotional Mood Mapping
const MOODS = [
  { id: "chill", label: "Chill", icon: Coffee, color: "from-blue-400 to-cyan-400" },
  { id: "focus", label: "Focus", icon: Wind, color: "from-emerald-400 to-teal-400" },
  { id: "late-night", label: "Late Night", icon: Moon, color: "from-purple-500 to-indigo-600" },
  { id: "energetic", label: "Energize", icon: Zap, color: "from-orange-400 to-red-500" },
  { id: "dreamy", label: "Dreamy", icon: Cloud, color: "from-pink-400 to-rose-400" },
  { id: "romantic", label: "Romantic", icon: Heart, color: "from-red-400 to-pink-500" },
];

const GENRES = [
  { id: "pop", label: "Pop", color: "bg-[#FF3366]", image: "https://images.unsplash.com/photo-1514525253361-bee8d40d9b4b?q=80&w=400" },
  { id: "reggae", label: "Reggae", color: "bg-[#2ECC71]", image: "https://images.unsplash.com/photo-1526478806334-5fa488f39b99?q=80&w=400" },
  { id: "rnb", label: "R&B", color: "bg-[#9B59B6]", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400" },
  { id: "indie", label: "Indie", color: "bg-[#F1C40F]", image: "https://images.unsplash.com/photo-1459749411177-042180ceea72?q=80&w=400" },
];

export function DiscoverView({ onSongSelect, currentSong, isPlaying, likedSongs = [], onToggleLike }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [activeMood, setActiveMood] = useState(null);
  const [isAIRecommending, setIsAIRecommending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef(null);

  // Intelligent Search Suggestions
  const [suggestions, setSuggestions] = useState([]);

  const [selectedGenreInfo, setSelectedGenreInfo] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const data = await songService.getSongs();
      setSongs(data);
      setFilteredSongs(data.slice(0, 8)); // Initial "Trending" selection
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    const lower = searchQuery.toLowerCase();
    const matches = songs
      .filter(s => s.title.toLowerCase().includes(lower) || s.artist.toLowerCase().includes(lower))
      .slice(0, 4);
    setSuggestions(matches);
  }, [searchQuery, songs]);

  const handleMoodSelect = async (moodId) => {
    if (activeMood === moodId) {
      setActiveMood(null);
      setFilteredSongs(songs.slice(0, 8));
    } else {
      setActiveMood(moodId);
      setIsAIRecommending(true);
      // Simulate AI mood reasoning
      const results = await aiService.getRecommendations(`I want music for ${moodId} mood`);
      setFilteredSongs(results);
      setIsAIRecommending(false);
    }
  };

  if (selectedGenreInfo) {
    const genreSongs = songs.filter(s => s.genre?.toLowerCase() === selectedGenreInfo.id.toLowerCase());
    return (
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full h-full bg-background flex flex-col no-scrollbar overflow-y-auto"
      >
        {/* Genre Hero */}
        <div className="relative h-[40vh] min-h-[300px] w-full flex-none overflow-hidden">
          <img src={selectedGenreInfo.image} className="w-full h-full object-cover blur-sm scale-110 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6">
             <button 
                onClick={() => setSelectedGenreInfo(null)}
                className="absolute top-10 left-10 flex items-center gap-2 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-full border border-border backdrop-blur-md transition-all active:scale-95"
             >
                <ChevronLeft size={16} />
                <span className="text-[10px] font-black uppercase tracking-[3px]">Return to Discovery</span>
             </button>

             <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center gap-4"
             >
                <span className="text-[12px] font-black uppercase tracking-[8px] text-primary">Station_Archive</span>
                <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">{selectedGenreInfo.label}</h1>
                <div className="flex items-center gap-4 text-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                   <span>{genreSongs.length} Masters Found</span>
                   <div className="w-1 h-1 rounded-full bg-primary" />
                   <span>Analog_Sync_Active</span>
                </div>
             </motion.div>
          </div>
        </div>

        {/* Localized Song List */}
        <div className="px-6 md:px-[60px] pb-32 flex flex-col gap-8">
           <div className="flex items-center justify-between border-b border-border/20 pb-4">
              <h2 className="text-sm font-black uppercase tracking-[4px] text-foreground/30">Catalog Index</h2>
              <div className="flex items-center gap-2">
                 <button className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-all">
                    <Play size={20} fill="currentColor" className="ml-1" />
                 </button>
              </div>
           </div>

           <div className="flex flex-col gap-2">
              {genreSongs.map((song, i) => (
                 <motion.div
                    key={song.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => onSongSelect(song)}
                    className="group w-full flex items-center gap-6 p-4 rounded-2xl hover:bg-foreground/[0.03] border border-transparent hover:border-border/40 transition-all cursor-pointer"
                 >
                    <span className="w-8 text-lg font-black opacity-10 font-mono text-center">0{i+1}</span>
                    <div className="w-14 h-14 rounded-xl overflow-hidden shadow-xl border border-white/10 group-hover:scale-105 transition-transform flex-none">
                       <img src={song.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <h4 className="text-lg font-black uppercase tracking-tight truncate">{song.title}</h4>
                       <p className="text-[11px] font-bold opacity-30 uppercase tracking-[3px] truncate">{song.artist}</p>
                    </div>
                    <button 
                       onClick={(e) => { e.stopPropagation(); onToggleLike(song.id); }}
                       className={`flex-none transition-colors ${likedSongs.includes(song.id) ? 'text-red-500' : 'text-foreground/10 hover:text-foreground'}`}
                    >
                       <Heart size={18} fill={likedSongs.includes(song.id) ? "currentColor" : "none"} />
                    </button>
                    <div className="w-12 text-right">
                       <Play size={14} className="opacity-0 group-hover:opacity-100 text-primary transition-opacity inline" />
                    </div>
                 </motion.div>
              ))}
              {genreSongs.length === 0 && (
                 <div className="py-20 flex flex-col items-center gap-6 opacity-20">
                    <Mic2 size={48} strokeWidth={1} />
                    <p className="text-sm font-black uppercase tracking-widest">No Masters Found in this Sector</p>
                 </div>
              )}
           </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full bg-background text-foreground overflow-y-auto no-scrollbar scroll-smooth relative"
    >
      {/* ── ATMOSPHERIC BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
           animate={isFocused ? { scale: 1.2, opacity: 0.15 } : { scale: 1, opacity: 0.08 }}
           className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,var(--primary)_0%,transparent_50%)] blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* ── 1. HERO EXPERIENCE ── */}
      <section className="relative z-10 w-full pt-20 pb-16 px-6 md:px-[60px] flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-8 w-full max-w-[800px]"
        >
          <div className="flex flex-col items-center gap-4 text-center">
             <div className="flex items-center gap-2 px-3 py-1 bg-foreground/5 rounded-full border border-border">
                <Sparkles size={12} className="text-primary" />
                <span className="text-[10px] font-black uppercase tracking-[3px] opacity-40">Intelligence-Driven Discovery</span>
             </div>
             <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.9] bg-gradient-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
                What do you want <br /> to feel <span className="text-primary italic">today?</span>
             </h1>
          </div>

          <div className="relative w-full max-w-[600px] mt-4 group/search">
             {/* ── LIQUID ROTATING BORDER (REACTBITS STYLE) ── */}
             <div className={`absolute -inset-[2.5px] rounded-full overflow-hidden transition-all duration-700 pointer-events-none ${isFocused ? 'opacity-100 scale-102' : 'opacity-0 group-hover/search:opacity-100'}`}>
                <div className="absolute inset-[-250%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--primary)_60deg,transparent_120deg,var(--primary)_180deg,transparent_240deg,var(--primary)_300deg,transparent_360deg)] animate-spin-slow opacity-80 blur-[4px]" />
             </div>

             {/* ── ATMOSPHERIC OUTER GLOW ── */}
             <div className={`absolute -inset-[8px] rounded-full bg-primary/20 blur-[20px] transition-all duration-700 pointer-events-none ${isFocused ? 'opacity-100 scale-105' : 'opacity-0 group-hover/search:opacity-40'}`} />
             
             <div className={`relative h-16 md:h-20 bg-card/80 backdrop-blur-3xl border transition-all duration-500 rounded-full flex items-center px-6 gap-4 shadow-2xl overflow-hidden
                ${isFocused ? 'border-primary/20 shadow-[0_0_50px_rgba(var(--theme-accent-rgb),0.2)]' : 'border-border/40 hover:border-border/80'}
             `}>
                <Search size={24} className={`transition-all duration-500 ${isFocused ? 'text-primary scale-110 drop-shadow-[0_0_10px_rgba(var(--theme-accent-rgb),0.5)]' : 'text-foreground/20 group-hover/search:text-foreground/40'}`} />
                <input 
                   type="text" 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onFocus={() => setIsFocused(true)}
                   onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                   placeholder="Search moods, vibes, textures..." 
                   className="bg-transparent flex-1 text-lg md:text-2xl font-bold outline-none placeholder:text-foreground/5"
                />
                <AnimatePresence>
                   {isAIRecommending && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <Loader2 size={20} className="animate-spin text-primary" />
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>

             {/* Live Suggestions Dropdown */}
             <AnimatePresence>
                {isFocused && suggestions.length > 0 && (
                   <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-card/90 backdrop-blur-3xl border border-border rounded-3xl p-3 shadow-3xl z-50 overflow-hidden"
                   >
                      <span className="px-4 py-2 text-[9px] font-black uppercase tracking-[3px] text-foreground/20 block">Intuitive Suggestions</span>
                      {suggestions.map((s) => (
                         <button 
                            key={s.id}
                            onClick={() => onSongSelect(s)}
                            className="w-full flex items-center gap-4 p-3 hover:bg-foreground/5 rounded-2xl transition-all"
                         >
                            <img src={s.imageUrl} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="text-left">
                               <p className="text-sm font-bold truncate">{s.title}</p>
                               <p className="text-[11px] opacity-40 uppercase tracking-widest">{s.artist}</p>
                            </div>
                         </button>
                      ))}
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* ── 2. MOOD-FIRST DISCOVERY ── */}
      <section className="relative z-10 px-6 md:px-[60px] pb-12">
        <div className="flex flex-col gap-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[4px] text-foreground/30">Set Your Atmosphere</h3>
              <div className="h-[1px] flex-1 mx-6 bg-border/20" />
           </div>
           
           <div className="flex flex-wrap gap-4 justify-center">
              {MOODS.map((mood) => {
                 const Icon = mood.icon;
                 const active = activeMood === mood.id;
                 return (
                    <motion.button
                       key={mood.id}
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => handleMoodSelect(mood.id)}
                       className={`px-8 h-14 rounded-full flex items-center gap-3 border transition-all duration-500 relative overflow-hidden group
                          ${active ? 'bg-foreground text-background border-foreground shadow-[0_0_30px_var(--primary)]' : 'bg-foreground/5 border-border hover:border-foreground/20 text-foreground/60'}
                       `}
                    >
                       <Icon size={18} className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:rotate-12'}`} />
                       <span className="text-sm font-black uppercase tracking-widest">{mood.label}</span>
                       {active && <div className={`absolute inset-0 bg-gradient-to-r ${mood.color} opacity-20 mix-blend-overlay`} />}
                    </motion.button>
                 );
              })}
           </div>
        </div>
      </section>

      {/* ── 3. GENRE LAYER (Visually Rich Cards) ── */}
      <section className="relative z-10 px-6 md:px-[60px] pb-20">
         <div className="flex flex-col gap-6">
            <h3 className="text-sm font-black uppercase tracking-[4px] text-foreground/30">Dimensional Genres</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {GENRES.map((genre) => (
                  <motion.div
                     key={genre.id}
                     whileHover={{ y: -5 }}
                     onClick={() => setSelectedGenreInfo(genre)}
                     className="relative aspect-[4/5] rounded-[32px] overflow-hidden cursor-pointer group border border-border"
                  >
                     <img src={genre.image} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                     <div className={`absolute inset-0 ${genre.color} mix-blend-multiply opacity-20 group-hover:opacity-40 transition-opacity`} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                     
                     <div className="absolute bottom-6 left-6 right-6">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-white/40 block mb-1">Catalog</span>
                        <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter">{genre.label}</h4>
                     </div>

                     <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        <ChevronRight size={20} />
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* ── 4. AI-DRIVEN SECTIONS (Asymmetric Grid) ── */}
      <section className="relative z-10 px-6 md:px-[60px] pb-32">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* LARGE FEATURE: FOR YOU */}
            <div className="md:col-span-8 flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/20">
                     <TrendingUp size={20} className="text-primary" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter">AI Synthesized For You</h3>
               </div>
               
               <div className="flex md:flex-row flex-col gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
                  {filteredSongs.slice(0, 5).map((song) => (
                     <motion.div 
                        key={song.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onSongSelect(song)}
                        className="flex-none w-[280px] snap-start bg-card/40 border border-border rounded-[28px] p-4 flex flex-col gap-4 hover:bg-card/60 transition-all cursor-pointer group"
                     >
                        <div className="relative aspect-square rounded-[20px] overflow-hidden shadow-2xl border border-border">
                           <img src={song.imageUrl} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                              <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl">
                                 {currentSong?.id === song.id && isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                              </div>
                           </div>
                        </div>
                        <div className="px-1">
                           <p className="text-lg font-black uppercase tracking-tight truncate">{song.title}</p>
                           <p className="text-[10px] font-bold opacity-30 tracking-[3px] uppercase truncate">{song.artist}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>

            {/* SIDE FEATURE: HIDDEN GEMS */}
            <div className="md:col-span-4 flex flex-col gap-6">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                     <Gem size={20} className="text-amber-500" />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-amber-500">Hidden Gems</h3>
               </div>

               <div className="flex flex-col gap-3">
                  {(songs.length > 5 ? songs.slice(5, 10) : songs).slice(0, 5).map((song, i) => (
                     <motion.div
                        key={song.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => onSongSelect(song)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-foreground/[0.03] border border-border/40 hover:bg-foreground/[0.05] hover:border-amber-500/20 transition-all cursor-pointer group"
                     >
                        <span className="text-lg font-black opacity-10 font-mono">0{i+1}</span>
                        <img src={song.imageUrl} className="w-12 h-12 rounded-lg object-cover flex-none" />
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-black truncate">{song.title}</p>
                           <p className="text-[10px] opacity-40 uppercase tracking-widest truncate">{song.artist}</p>
                        </div>
                        <Heart size={14} className={`flex-none ${likedSongs.includes(song.id) ? 'fill-red-500 text-red-500' : 'opacity-20'}`} />
                     </motion.div>
                  ))}
                  {songs.length === 0 && (
                     <div className="p-8 border-2 border-dashed border-border/20 rounded-[28px] flex flex-col items-center gap-3 opacity-20">
                        <Loader2 className="animate-spin" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Scanning Archive...</span>
                     </div>
                  )}
               </div>
            </div>

         </div>
      </section>

      {/* ── FOOTER GRADIENT ── */}
      <div className="h-40 bg-gradient-to-t from-background to-transparent pointer-events-none sticky bottom-0 z-0" />

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </div>
  );
}
