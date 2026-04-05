import { useState, useMemo, useEffect } from "react";
import { 
  Play, Pause, Heart, Sparkles, Clock, Zap, Radio, 
  TrendingUp, Activity, Moon, Sun, Coffee, Flame, Headphones,
  Users, PlayCircle, MoreHorizontal, LogIn, User as UserIcon,
  ChevronRight, ArrowRight, Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SongCard } from "./SongCard";

export function HomeView({ songs = [], currentSong, isPlaying, onSongSelect, user, onLogout, onNavChange, themeColor = "#00ffcc" }) {
  const [timeOfDay, setTimeOfDay] = useState("Night");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setTimeOfDay("Morning");
    else if (hour >= 12 && hour < 18) setTimeOfDay("Day");
    else setTimeOfDay("Night");
  }, []);

  const forYou = useMemo(() => ({
    big: songs[0] || null,
    small: songs.slice(1, 3)
  }), [songs]);

  const continueListening = songs.slice(0, 4);
  const trending = songs.slice(3, 8);
  const aiPicks = songs.slice(12, 18);

  const moods = [
    { id: "chill", label: "Chill", icon: <Coffee size={18} /> },
    { id: "focus", label: "Focus", icon: <Activity size={18} /> },
    { id: "night", label: "Late Night", icon: <Moon size={18} /> },
    { id: "energetic", label: "Energetic", icon: <Flame size={18} /> },
  ];

  return (
    <div className="flex-1 h-full bg-background text-foreground font-['Outfit'] overflow-y-auto no-scrollbar scroll-smooth relative">
      
      {/* ── SUPREME TOP CLUSTER ── */}
      <header className="flex items-center justify-between sticky top-0 z-[100] px-10 py-6 bg-background/80 backdrop-blur-xl border-b border-foreground/[0.03]">
         <div className="flex items-center gap-10">
            <div className="flex flex-col">
               <h1 className="text-5xl font-black italic tracking-tighter leading-none mb-1">Vinl.</h1>
               <span className="text-[10px] font-black uppercase tracking-[5px] opacity-20">Network Synergy V2.4</span>
            </div>
         </div>

         <div className="flex items-center gap-6">
            <button className="w-12 h-12 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05] flex items-center justify-center text-foreground/40 hover:text-foreground transition-all hover:bg-foreground/[0.06]">
               <Search size={20} />
            </button>
            <AnimatePresence mode="wait">
               {user ? (
                 <motion.div 
                   key="user"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   className="flex items-center gap-4 bg-foreground/[0.03] border border-foreground/[0.05] rounded-full p-1.5 pl-4 pr-4 hover:bg-foreground/[0.06] transition-all cursor-pointer group"
                 >
                    <span className="text-[11px] font-black uppercase tracking-[2px] opacity-40 group-hover:opacity-100 transition-opacity">
                       {user.username || 'Syncing...'}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[12px] font-black border-2 border-background">
                       {(user.username || 'V')[0].toUpperCase()}
                    </div>
                 </motion.div>
               ) : (
                 <motion.button 
                   key="login"
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -10 }}
                   onClick={() => onNavChange?.('profile')}
                   className="h-11 px-8 rounded-full bg-foreground text-background text-[11px] font-black uppercase tracking-[3px] hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                 >
                    <LogIn size={14} /> Login / Get Started
                 </motion.button>
               )}
            </AnimatePresence>
         </div>
      </header>

      <div className="p-10 pt-12 pb-40">
         {/* ── 5. DYNAMIC FEATURED BANNER ── */}
      <section className="mb-14 relative rounded-[48px] overflow-hidden group border border-foreground/[0.05] shadow-2xl">
         <img 
            src="https://images.unsplash.com/photo-1542332213-9b5a5a3fad35?q=80&w=2670&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] brightness-50 contrast-[1.1]" 
         />
         <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-transparent opacity-80" />
         <div className="absolute inset-0 p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
               <div className="px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-[4px]">Featured Stream</div>
               <span className="text-[10px] font-black uppercase tracking-[4px] opacity-40 text-white">Uplink: Sector 01-A</span>
            </div>
            <h1 className="text-white text-8xl font-black italic tracking-tighter leading-[0.75] uppercase mb-8 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
               Focus Architecture
            </h1>
            <div className="flex items-center gap-6">
               <button className="h-14 px-12 rounded-2xl bg-white text-black text-[12px] font-black uppercase tracking-[3px] hover:scale-105 active:scale-95 transition-all flex items-center gap-4">
                  <Play size={20} className="fill-current" /> Start Discovery
               </button>
               <div className="flex flex-col">
                  <span className="text-[20px] font-black tracking-widest text-primary">2.1K Active</span>
                  <span className="text-[8px] opacity-20 font-black uppercase tracking-[2px] text-white">Synchronized Peers</span>
               </div>
            </div>
         </div>
      </section>

      {/* ── 3. MOOD QUICK ACCESS ── */}
      <section className="flex items-center gap-4 mb-16 px-2">
         {moods.map(mood => (
            <button key={mood.id} className="flex-1 h-24 rounded-[40px] bg-foreground/[0.02] border border-foreground/[0.05] hover:bg-foreground/[0.06] hover:border-foreground/[0.1] hover:scale-[1.03] transition-all flex flex-col items-center justify-center gap-1 group relative">
               <div className="text-foreground/20 group-hover:text-primary transition-colors">{mood.icon}</div>
               <span className="text-[10px] font-black uppercase tracking-[4px] text-foreground/40 group-hover:text-foreground transition-colors">{mood.label}</span>
               {mood.id === "chill" && <div className="absolute top-4 right-8 w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]" />}
            </button>
         ))}
      </section>

      <div className="flex flex-col gap-24">
         
         {/* ── 1. "FOR YOU" SMART SECTION ── */}
         <section>
            <div className="flex items-center justify-between mb-10 px-2">
               <div className="flex items-center gap-4">
                  <Sparkles size={24} className="text-primary" />
                  <h2 className="text-4xl font-black italic tracking-tighter uppercase">For Your Frequency</h2>
               </div>
               <button className="text-[10px] font-black uppercase tracking-[3px] opacity-20 hover:opacity-100 transition-opacity flex items-center gap-2">View Tailored Mix <ChevronRight size={14} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* 1 BIG CARD */}
               <motion.div 
                 whileHover={{ scale: 1.02 }}
                 onClick={() => onSongSelect(forYou.big)}
                 className="lg:col-span-2 relative aspect-[21/9] rounded-[48px] overflow-hidden cursor-pointer group border border-foreground/[0.05] shadow-2xl"
               >
                  <img src={forYou.big?.imageUrl} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 p-12 flex items-end justify-between">
                     <div className="translate-y-4 group-hover:translate-y-0 transition-transform">
                        <h3 className="text-white text-6xl font-black italic tracking-tighter uppercase mb-4">{forYou.big?.title}</h3>
                        <div className="flex items-center gap-4 text-white/40 text-[14px] font-bold uppercase tracking-[5px]">
                           <span>{forYou.big?.artist}</span>
                           <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                           <span className="text-primary">Headline Rank: #01</span>
                        </div>
                     </div>
                     <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center shadow-2xl opacity-0 group-hover:opacity-100 transform translate-y-10 group-hover:translate-y-0 transition-all">
                        <Play size={48} className="fill-current ml-2" />
                     </div>
                  </div>
               </motion.div>

               {/* 2 SMALL CARDS */}
               <div className="flex flex-col gap-8">
                  {forYou.small.map(song => (
                    <button 
                      key={song.id}
                      onClick={() => onSongSelect(song)}
                      className="flex-1 rounded-[40px] bg-foreground/[0.02] border border-foreground/[0.05] p-6 flex items-center gap-6 group hover:bg-foreground/[0.05] transition-all"
                    >
                       <div className="w-20 h-20 rounded-[20px] overflow-hidden shadow-2xl border border-foreground/[0.05] relative">
                          <img src={song.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                             <PlayCircle size={32} className="text-white" />
                          </div>
                       </div>
                       <div className="flex-1 text-left overflow-hidden">
                          <h4 className="text-[20px] font-black italic tracking-tighter truncate leading-none mb-2">{song.title}</h4>
                          <p className="text-[12px] font-medium opacity-20 uppercase tracking-[4px] truncate">{song.artist}</p>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
         </section>

         {/* ── 4. "DROP IN" SECTION (USP) ── */}
         <section className="relative px-20 py-24 rounded-[64px] overflow-hidden border border-primary/20 group text-center bg-card shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,_rgba(var(--primary-rgb),0.1)_0%,_transparent_60%)]" />
            <div className="relative z-10">
               <div className="flex items-center justify-center gap-3 mb-8 text-primary text-[11px] font-black uppercase tracking-[6px]">
                  <Users size={20} /> 1.2K Synchronized Now
               </div>
               <h2 className="text-8xl font-black italic tracking-[-8px] uppercase mb-10 leading-[0.8]">Join The Live Pulse</h2>
               <div className="flex items-center justify-center gap-8">
                  <button className="h-20 px-16 rounded-[28px] bg-primary text-primary-foreground text-[14px] font-black uppercase tracking-[4px] hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]">
                     Start Session
                  </button>
                  <button className="h-20 px-16 rounded-[28px] border-2 border-foreground/[0.1] text-[14px] font-black uppercase tracking-[4px] hover:bg-foreground/[0.03] transition-all">
                     View All Vibes
                  </button>
               </div>
            </div>
         </section>

         {/* ── 2. CONTINUE LISTENING ── */}
         <section>
            <div className="flex items-center justify-between mb-10 px-2">
               <div className="flex items-center gap-4">
                  <Clock size={20} className="text-foreground/20" />
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">Resume Frequency</h2>
               </div>
               <div className="h-[2px] flex-1 mx-8 bg-foreground/[0.05] rounded-full" />
            </div>
            <div className="flex gap-10 overflow-x-auto no-scrollbar pb-6 pr-10">
               {continueListening.map((song, i) => (
                 <div key={song.id} onClick={() => onSongSelect(song)} className="w-[200px] flex-none group cursor-pointer">
                    <div className="relative aspect-square rounded-[40px] overflow-hidden mb-6 border border-foreground/[0.05] shadow-2xl">
                       <img src={song.imageUrl} className="w-full h-full object-cover transition-all grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110" />
                       <div className="absolute inset-x-4 bottom-4 h-12 bg-black/60 backdrop-blur-3xl rounded-[24px] border border-white/10 flex items-center justify-between px-5">
                          <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden mr-4">
                             <div className="h-full bg-primary" style={{ width: `${35 + i*15}%` }} />
                          </div>
                          <span className="text-[10px] font-black uppercase text-primary">Resume</span>
                       </div>
                    </div>
                    <span className="text-xl font-black italic tracking-tighter block truncate mb-1 group-hover:text-primary transition-colors">{song.title}</span>
                    <span className="text-[11px] font-bold opacity-20 uppercase tracking-[3px] block truncate">{song.artist}</span>
                 </div>
               ))}
            </div>
         </section>

         {/* ── 6. TRENDING NOW ── */}
         <section className="overflow-hidden">
            <header className="flex items-center gap-6 mb-12">
               <TrendingUp size={32} className="text-primary" />
               <h2 className="text-5xl font-black italic tracking-tighter uppercase">Market Trends</h2>
            </header>
            <div className="flex gap-12 overflow-x-auto no-scrollbar pb-16 pr-40 scroll-smooth">
               {trending.map((song, i) => (
                 <div key={song.id} onClick={() => onSongSelect(song)} className="w-[360px] flex-none group cursor-pointer relative">
                    <div className="aspect-[4/5] rounded-[56px] overflow-hidden shadow-2xl border border-foreground/[0.05] mb-8">
                       <img src={song.imageUrl} className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                       <div className="absolute bottom-12 left-12 right-12">
                          <span className="text-white text-5xl font-black italic tracking-tighter leading-none block mb-4">{song.title}</span>
                          <div className="flex items-center gap-4">
                             <span className="text-8xl font-black italic text-white/5 absolute -left-6 bottom-0 leading-none pointer-events-none select-none">{i+1}</span>
                             <span className="text-xl font-medium text-white/40 uppercase tracking-[6px] block">{song.artist}</span>
                          </div>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         {/* ── 8. AI PICKS ── */}
         <section>
            <div className="flex items-center gap-6 mb-12">
               <Zap size={28} className="text-primary fill-primary" />
               <h2 className="text-4xl font-black italic tracking-tighter uppercase">Synesthetic Picks</h2>
               <div className="h-[1px] flex-1 bg-gradient-to-r from-foreground/[0.05] to-transparent" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10">
               {aiPicks.map((song, i) => (
                 <motion.div 
                   key={song.id}
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: i * 0.05 }}
                 >
                    <SongCard song={song} onClick={() => onSongSelect(song)} />
                 </motion.div>
               ))}
            </div>
         </section>

         {/* ── 7. GENRE CAPSULES (LUX DESIGN) ── */}
         <section className="pb-40">
            <div className="flex flex-col items-center gap-12 text-center">
               <div className="flex items-center gap-8 w-full">
                  <div className="flex-1 h-[1px] bg-foreground/[0.05]" />
                  <span className="text-[12px] font-black uppercase tracking-[10px] opacity-20 font-sans">Browse Architecture</span>
                  <div className="flex-1 h-[1px] bg-foreground/[0.05]" />
               </div>
               <div className="flex items-center justify-center flex-wrap gap-6 max-w-4xl">
                  {["Abstract Soul", "Nu-Disco", "Cyber Pop", "Hardcore", "Noir Jazz", "Techno Deep"].map(genre => (
                    <button 
                     key={genre}
                     className="px-14 h-20 rounded-[32px] bg-foreground/[0.02] border border-foreground/[0.05] text-[15px] font-black uppercase tracking-[5px] hover:bg-foreground hover:text-background hover:scale-105 transition-all shadow-xl group"
                    >
                       <span className="group-hover:tracking-[8px] transition-all duration-500">{genre}</span>
                    </button>
                  ))}
               </div>
            </div>
         </section>

      </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
