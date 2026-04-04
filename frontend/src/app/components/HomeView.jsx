import { Play, Star, TrendingUp, Music2, Headphones, Clock, LogOut, LayoutGrid, Disc, Sparkles, ChevronRight, Search, Heart, Share2, Plus, Volume2, UserPlus, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

export function HomeView({
  songs,
  currentSong,
  isPlaying,
  onSongSelect,
  onOpenFullscreen,
  user,
  onNavChange,
  onLogout
}) {
  const sortedByPlays = [...songs].sort((a,b) => (b.plays || 0) - (a.plays || 0));
  const trendingSong = sortedByPlays[0] || songs[0] || currentSong;
  const topTracks = sortedByPlays.slice(1, 10);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-background transition-colors duration-500">
      
      {/* Cinematic Pulse Background - Becomes subtle in Brutalist for texture visibility */}
      <motion.div 
         key={currentSong?.imageUrl}
         initial={{ opacity: 0 }}
         animate={{ opacity: 0.15 }}
         className="absolute inset-0 blur-[140px] scale-150 pointer-events-none theme-spotlight"
      >
         <img src={currentSong?.imageUrl} className="w-full h-full object-cover" />
      </motion.div>

      {/* Subtle Noise / Grit Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full p-8 md:p-12 overflow-y-auto no-scrollbar pb-[140px] md:pb-12">
         
         {/* THE MODERN HEADER */}
         <header className="flex justify-between items-center mb-16 px-2">
            <div className="flex flex-col">
               <motion.h1 
                  animate={isPlaying ? { 
                     opacity: [1, 0.7, 1],
                     scale: [1, 1.02, 1]
                  } : {}}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-foreground text-5xl font-black tracking-tighter italic leading-none"
               >
                  Vinl.
               </motion.h1>
               <p className="text-primary text-[10px] font-black uppercase tracking-[5px] mt-1">Synergy Network v2.4</p>
            </div>
            
            <div className="flex items-center gap-8">
               <div className="hidden md:flex flex-col items-end opacity-40">
                  <span className="text-foreground text-sm font-black tracking-tighter">Current Latency</span>
                  <span className="text-green-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                     <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /> Optimizing Stream
                  </span>
               </div>
               
               <div className="flex items-center gap-4">
                  <button onClick={() => onNavChange('profile')} className="w-12 h-12 rounded-2xl bg-card border border-border flex items-center justify-center group hover:bg-foreground hover:text-background transition-all overflow-hidden shadow-sm">
                     {user?.avatarUrl ? (
                        <img src={user.avatarUrl} className="w-full h-full object-cover" />
                     ) : (
                        <span className="text-foreground text-lg font-black group-hover:text-background transition-colors">{user?.username?.charAt(0) || <Search size={20} />}</span>
                     )}
                  </button>
                  {user && (
                    <button onClick={onLogout} className="p-3 text-foreground/20 hover:text-destructive transition-colors">
                       <LogOut size={20} />
                    </button>
                  )}
               </div>
            </div>
         </header>

         <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-16"
         >
            {/* HERO - CINEMATIC SPOTLIGHT */}
            <motion.div variants={itemVariants} className="grid grid-cols-12 gap-12">
               <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
                  <div 
                    onClick={() => onSongSelect(trendingSong)}
                    className="relative aspect-video lg:aspect-[21/9] rounded-[60px] overflow-hidden border border-border shadow-2xl bg-card group cursor-pointer"
                  >
                     <img src={trendingSong?.imageUrl} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-2000 ease-out brutalist:scale-100" />
                     <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent p-10 md:p-16 flex flex-col justify-end">
                        <div className="flex flex-col">
                           <span className="px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-black uppercase tracking-widest text-[9px] w-fit mb-6 shadow-2xl backdrop-blur-md brutalist:backdrop-blur-none">Headline Record</span>
                           <h2 className="text-foreground text-6xl md:text-[90px] font-black tracking-tighter leading-[0.8] mb-4 italic truncate">{trendingSong?.title}</h2>
                           <div className="flex items-center gap-6">
                              <p className="text-foreground/40 text-xl md:text-3xl font-bold uppercase tracking-widest truncate">{trendingSong?.artist}</p>
                              <div className="h-px flex-1 bg-foreground/10 hidden md:block" />
                              <button className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all flex-none brutalist:rounded-lg">
                                 <Play size={24} className="fill-current ml-1" />
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* RECENT RECORDS - VIRTUAL CRATE */}
               <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                  <div className="flex items-center justify-between px-2">
                     <h3 className="text-foreground/40 font-black uppercase tracking-[5px] text-[10px]">Virtual Crate</h3>
                     <button className="text-primary text-[10px] font-black uppercase tracking-widest hover:text-foreground transition-colors">Expand Rack</button>
                  </div>
                  <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto no-scrollbar">
                     {songs.slice(0, 15).map((s, i) => (
                        <motion.div 
                           key={s.id}
                           whileHover={{ x: 10 }}
                           onClick={() => onSongSelect(s)}
                           className="flex items-center gap-6 p-4 rounded-[28px] bg-card border border-border/10 hover:bg-muted transition-all cursor-pointer group shadow-sm brutalist:rounded-lg"
                        >
                           <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl flex-none border border-border/20">
                              <img src={s.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform brutalist:scale-100" />
                           </div>
                           <div className="flex-1 truncate">
                              <h4 className="text-foreground font-black text-lg truncate leading-tight uppercase tracking-tighter italic">{s.title}</h4>
                              <p className="text-foreground/20 text-[9px] font-bold uppercase tracking-widest">{s.artist}</p>
                           </div>
                           <div className="text-foreground/5 text-2xl font-black italic pr-2">0{i+1}</div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </motion.div>

            {/* THE STATS STRIP - MODERN BLEND */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
               <div className="p-10 rounded-[48px] bg-card border border-border flex flex-col gap-6 group hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative brutalist:rounded-lg shadow-sm">
                  <Headphones size={32} className="text-primary" />
                  <div>
                     <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[5px] mb-1">Network Resonance</p>
                     <p className="text-foreground text-4xl font-black tracking-tighter italic">12.4<span className="text-primary text-2xl">H</span></p>
                  </div>
               </div>
               <div className="p-10 rounded-[48px] bg-card border border-border flex flex-col gap-6 group hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative brutalist:rounded-lg shadow-sm">
                  <Music2 size={32} className="text-primary" />
                  <div>
                     <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[5px] mb-1">Crate Depth</p>
                     <p className="text-foreground text-4xl font-black tracking-tighter italic">{songs.length}</p>
                  </div>
               </div>
               <div className="p-10 rounded-[48px] bg-card border border-border flex flex-col gap-6 group hover:bg-primary/5 transition-all cursor-pointer overflow-hidden relative brutalist:rounded-lg shadow-sm">
                  <Zap size={32} className="text-primary" />
                  <div>
                     <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[5px] mb-1">Synergy Mode</p>
                     <p className="text-foreground text-4xl font-black tracking-tighter italic">LIVE</p>
                  </div>
               </div>
            </motion.div>

            {/* GLOBAL FEED - CINEMATIC GRID */}
            <motion.div variants={itemVariants} className="flex flex-col gap-10">
               <div className="flex items-center gap-6 px-2">
                  <h3 className="text-foreground font-black text-4xl tracking-tighter italic">Global Synergy Feed.</h3>
                  <div className="h-px flex-1 bg-border" />
                  <LayoutGrid size={24} className="text-foreground/20" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {topTracks.map((song, idx) => (
                     <div 
                        key={song.id}
                        onClick={() => onSongSelect(song)}
                        className="group flex flex-col gap-6 p-8 rounded-[48px] bg-card border border-border hover:bg-muted transition-all cursor-pointer relative overflow-hidden brutalist:rounded-lg shadow-sm"
                     >
                        <div className="relative aspect-square rounded-[32px] overflow-hidden shadow-2xl border border-border brutalist:rounded-lg">
                           <img src={song.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 brutalist:scale-100" />
                           <div className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors" />
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 rounded-full bg-foreground text-background flex items-center justify-center shadow-2xl brutalist:rounded-lg">
                                 <Play size={24} className="fill-current ml-1" />
                              </div>
                           </div>
                           <div className="absolute bottom-4 left-4 bg-background/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-foreground/40 brutalist:backdrop-blur-none">
                              #{idx + 2}
                           </div>
                        </div>
                        <div className="flex-1 truncate">
                           <h4 className="text-foreground font-black text-2xl truncate leading-tight uppercase tracking-tighter italic mb-1">{song.title}</h4>
                           <p className="text-foreground/20 text-xs font-bold uppercase tracking-widest">{song.artist}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>

            {/* FOOTER - THE END OF THE STREAM */}
            <motion.div variants={itemVariants} className="mt-20 pt-20 border-t border-border flex flex-col items-center gap-12 text-center pb-20">
               <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center shadow-2xl mb-8 brutalist:rounded-lg">
                     <Disc size={32} className="text-background animate-spin-slow" />
                  </div>
                  <h3 className="text-foreground text-4xl font-black tracking-tighter italic">End of the Synergetic Stream.</h3>
                  <p className="text-foreground/20 font-medium max-w-sm mt-4">Every frequency eventually fades into the void. Stay tuned for the next transmission.</p>
               </div>
               <div className="flex items-center gap-6">
                 {['SYNERGY', 'PRIVACY', 'HISTORY', 'CODE'].map(l => (
                    <button key={l} className="text-foreground/20 text-[9px] font-black uppercase tracking-[5px] hover:text-foreground transition-colors">{l}</button>
                 ))}
               </div>
            </motion.div>
         </motion.div>
      </div>
    </div>
  );
}
