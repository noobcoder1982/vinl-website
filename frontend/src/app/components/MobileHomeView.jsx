import { Play, Sparkles, Heart, Mic2, Disc, Waves, Zap, Flame, Infinity } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

export function MobileHomeView({
  songs,
  currentSong,
  isPlaying,
  onSongSelect,
  onProfileSelect,
  user
}) {
  const featuredSong = songs[0];
  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Rise & Shine";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex-1 h-full bg-background overflow-y-auto no-scrollbar pb-[160px] pt-14 px-6 md:px-12 transition-colors duration-500 relative">
      {/* Background Ambience Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-50 [.brutalist_&]:hidden">
        <div className="absolute top-[-10%] right-[-20%] w-[120%] h-[50vh] bg-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[100%] h-[40vh] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col gap-12"
      >
        {/* Cinematic Header */}
        <motion.div variants={itemVariants} className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <span className="w-6 h-[1px] bg-primary/40 rounded-full" />
                <span className="text-primary text-[10px] font-black uppercase tracking-[5px] opacity-80">{greeting()}</span>
             </div>
             <h1 className="text-foreground text-[44px] font-black tracking-[-3px] leading-[0.9]">
               {user?.username || "Guest"}
             </h1>
          </div>
          <motion.div 
            whileTap={{ scale: 0.9 }}
            onClick={onProfileSelect}
            className="w-[56px] h-[56px] rounded-[24px] bg-foreground/5 border border-border p-1 flex items-center justify-center p-1.5 cursor-pointer active:bg-foreground/10 transition-colors"
          >
             <div className="w-full h-full rounded-[18px] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 flex items-center justify-center border border-white/10">
                <img 
                   src={`https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username || 'Guest'}`} 
                   className="w-full h-full object-cover opacity-60" 
                   alt="pfp"
                />
             </div>
          </motion.div>
        </motion.div>

        {/* Stories / Collective Vibes */}
        <motion.div variants={itemVariants} className="flex flex-col gap-4">
           <div className="flex items-center justify-between">
              <h3 className="text-foreground/40 text-[10px] font-black uppercase tracking-[4px]">Your Pulse</h3>
              <button className="text-primary text-[9px] font-black uppercase tracking-widest">Tune In</button>
           </div>
           <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
              {[
                { name: 'Pure Energy', icon: <Zap size={18}/>, color: 'from-orange-500 to-red-500' },
                { name: 'Flow State', icon: <Waves size={18}/>, color: 'from-blue-500 to-indigo-500' },
                { name: 'Deep Focus', icon: <Disc size={18}/>, color: 'from-emerald-500 to-teal-500' },
                { name: 'Midnight', icon: <Flame size={18}/>, color: 'from-purple-500 to-black' },
                { name: 'Infinity', icon: <Infinity size={18}/>, color: 'from-pink-500 to-rose-500' }
              ].map((vibe, i) => (
                <motion.div 
                  key={i} 
                  whileTap={{ scale: 0.94 }}
                  className="flex flex-col items-center gap-3 flex-none cursor-pointer"
                >
                   <div className={`w-[76px] h-[76px] rounded-[32px] p-[3px] bg-gradient-to-tr ${vibe.color} shadow-lg shadow-black/20`}>
                      <div className="w-full h-full rounded-[29px] bg-background flex items-center justify-center border border-white/5 group-active:scale-95 transition-transform">
                         <div className="text-foreground/80">{vibe.icon}</div>
                      </div>
                   </div>
                   <span className="text-foreground/60 text-[9px] font-black uppercase tracking-wider">{vibe.name}</span>
                </motion.div>
              ))}
           </div>
        </motion.div>

        {/* Floating Spotlight Card */}
        <motion.div variants={itemVariants} className="relative group overflow-visible">
           <div className="absolute -inset-4 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
           <div className="relative aspect-[4/5] md:aspect-[16/9] w-full rounded-[48px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] bg-card border border-border group-active:scale-95 transition-all duration-500">
              <img src={featuredSong?.imageUrl || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=800"} className="w-full h-full object-cover grayscale-[0.3] brightness-75 group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt="hero" />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-10 flex flex-col justify-end">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="flex flex-col gap-2"
                  >
                     <div className="flex items-center gap-3 mb-2">
                        <Sparkles size={16} className="text-primary animate-pulse" />
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-[6px]">Curated Selection</span>
                     </div>
                     <h2 className="text-white text-[48px] font-black tracking-[-4px] leading-[0.8] mb-4">
                        {featuredSong?.title || "Sonic Journey"}
                     </h2>
                     <div className="flex items-center gap-4">
                        <button 
                           onClick={() => onSongSelect(featuredSong)}
                           className="px-10 h-[56px] bg-white text-black rounded-[24px] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 shadow-xl active:scale-90 transition-all"
                        >
                           <Play size={18} fill="currentColor" /> Play
                        </button>
                        <button className="w-[56px] h-[56px] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[24px] flex items-center justify-center active:scale-90 transition-all text-white/60 hover:text-white">
                           <Heart size={20} />
                        </button>
                     </div>
                  </motion.div>
              </div>
           </div>
        </motion.div>

        {/* Dynamic Activity Feed / Quick Access */}
        <motion.div variants={itemVariants} className="flex flex-col gap-6">
           <div className="flex items-end justify-between">
              <div className="flex flex-col">
                 <h3 className="text-foreground text-[28px] font-black tracking-[-1.5px]">Daily Recap</h3>
                 <p className="text-foreground/30 text-[11px] font-black uppercase tracking-[3px]">Recently Spinning</p>
              </div>
              <button className="h-[36px] px-6 rounded-full bg-foreground/5 text-foreground/40 text-[10px] font-black uppercase tracking-widest border border-border hover:bg-primary/20 hover:text-primary transition-all">Explore</button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {songs.slice(1, 5).map((song, i) => (
                <motion.div 
                   key={i} 
                   whileTap={{ scale: 0.98 }}
                   onClick={() => onSongSelect(song)}
                   className="flex items-center gap-5 p-4 rounded-[32px] bg-foreground/[0.02] border border-border group cursor-pointer hover:bg-foreground/[0.05] transition-all duration-300"
                >
                   <div className="w-[72px] h-[72px] rounded-[24px] overflow-hidden shadow-xl flex-none border border-white/5 group-hover:scale-105 transition-transform">
                      <img src={song.imageUrl} className="w-full h-full object-cover" alt={song.title} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-foreground font-black text-[15px] truncate leading-tight mb-1">{song.title}</p>
                      <p className="text-foreground/40 text-[11px] font-bold uppercase tracking-widest truncate">{song.artist}</p>
                   </div>
                   <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center opacity-40 group-hover:opacity-100 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                      <Play size={16} className="text-foreground group-hover:text-primary transition-colors translate-x-0.5" />
                   </div>
                </motion.div>
              ))}
           </div>
        </motion.div>

        {/* Creative Lab Deck */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="p-10 rounded-[48px] bg-gradient-to-br from-primary/20 via-background to-background border border-primary/20 flex flex-col gap-6 relative overflow-hidden group">
              <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
              <div className="w-14 h-14 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                 <Mic2 size={24} className="text-white" />
              </div>
              <div>
                 <h4 className="text-foreground text-[22px] font-black tracking-tight mb-1">Crate Digging</h4>
                 <p className="text-foreground/40 text-sm font-medium leading-relaxed">Let AI build your perfect session based on your current vibe.</p>
              </div>
           </div>
           <div className="p-10 rounded-[48px] bg-foreground/5 border border-border flex flex-col gap-6 group hover:border-white/20 transition-all duration-500">
              <div className="w-14 h-14 rounded-3xl bg-foreground/10 flex items-center justify-center">
                 <Disc size={24} className="text-foreground/60" />
              </div>
              <div>
                 <h4 className="text-foreground text-[22px] font-black tracking-tight mb-1">The Archives</h4>
                 <p className="text-foreground/40 text-sm font-medium leading-relaxed">Rediscover the tracks you loved from previous seasons.</p>
              </div>
           </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
