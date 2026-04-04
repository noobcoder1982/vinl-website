import { Play, Star, TrendingUp, Music2, Headphones, Clock, LogOut } from "lucide-react";
import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
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
  // Sort by plays DESC to find the #1 Trending track
  const sortedByPlays = [...songs].sort((a,b) => (b.plays || 0) - (a.plays || 0));
  const trendingSong = sortedByPlays[0] || songs[0] || currentSong;
  const recentSongs = songs.slice(1, 5); // Fallback placeholder
  const topTracks = sortedByPlays.slice(1, 6);

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long"
  });

  return (
    <div className="flex-1 flex overflow-hidden">
      <div className="flex-1 relative overflow-hidden rounded-[24px] bg-card border border-border shadow-2xl shadow-black/50">
        {/* Immersive Background Gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-900/10 blur-[100px] rounded-full" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
        </div>

        <div className="relative h-full flex flex-col overflow-y-auto no-scrollbar p-0 md:p-10 pb-[140px] md:pb-10">
          
          {/* Header Dashboard */}
          <div className="flex items-center justify-between mb-12 px-6 md:px-0 mt-8 md:mt-0">
            <div className="flex items-center gap-5">
              <button 
                onClick={() => onNavChange('profile')}
                className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-800 flex items-center justify-center border border-white/20 shadow-2xl hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              >
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <span className="text-foreground text-lg font-black uppercase tracking-tight">{user?.username?.charAt(0) || '?'}</span>
                )}
              </button>
              <div className="flex flex-col mr-6">
                <span className="text-foreground text-lg font-black tracking-tighter leading-none mb-1">{user?.username || 'Guest'}</span>
                <span className="text-foreground/20 text-[10px] font-black uppercase tracking-[3px] leading-none">Synergy Protocol</span>
              </div>
              {user && (
                <button 
                  onClick={onLogout}
                  className="p-3 rounded-2xl bg-foreground/5 hover:bg-red-500/10 text-foreground/10 hover:text-red-500 transition-all border border-white/5"
                >
                  <LogOut size={18} />
                </button>
              )}
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="text-foreground/20 text-[9px] font-black uppercase tracking-[5px] block mb-2">Network Status: Finalized</span>
              <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-foreground/5 border border-border">
                 <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 <p className="text-foreground font-medium text-xs tracking-wide">{dateStr}</p>
              </div>
            </div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-16 px-6 md:px-0"
          >
            {/* HER0 - DATA-DRIVEN TRENDING FEATURE */}
            <motion.div variants={itemVariants} className="relative group">
              <div className="absolute inset-x-0 -bottom-10 top-20 bg-primary/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" />
              
              <div className="relative w-full rounded-[40px] overflow-hidden border border-border shadow-[0_40px_100px_rgba(0,0,0,0.8)] bg-card/80 backdrop-blur-xl">
                
                {/* Background Blur Overlay (Use the cover art but blurred to oblivion to create matching atmosphere) */}
                <div className="absolute inset-0 z-0 opacity-[0.15] mix-blend-screen overflow-hidden pointer-events-none">
                   {trendingSong?.imageUrl && (
                     <img src={trendingSong.imageUrl} className="w-full h-full object-cover scale-[1.5] blur-[120px] brightness-75" />
                   )}
                </div>
                
                {/* Subtle digital noise */}
                <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-16">
                  
                  {/* The Crisp Original-Size Cover Art */}
                  <div className="relative shrink-0 group/cover self-center">
                    <div className="absolute -inset-6 bg-foreground/5 rounded-[40px] blur-3xl opacity-0 group-hover/cover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl overflow-hidden border border-white/20 shadow-2xl relative z-10 bg-black/40 flex items-center justify-center">
                       {trendingSong?.imageUrl ? (
                         <img 
                           src={trendingSong.imageUrl} 
                           alt={trendingSong.title} 
                           className="w-full h-full object-cover group-hover/cover:scale-105 transition-transform duration-700 ease-out"
                         />
                       ) : (
                         <div className="text-foreground/20 flex flex-col items-center">
                           <Music2 size={64} className="mb-2" />
                           <span className="text-[10px] font-black uppercase tracking-widest">NO ARTWORK</span>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-foreground/10 pointer-events-none" />
                    </div>
                  </div>
                  
                  {/* Typography & Actions */}
                  <div className="flex-1 flex flex-col items-start justify-center min-w-0">
                    <div className="flex items-center gap-4 mb-6 md:mb-8">
                      <div className="px-4 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 font-black uppercase tracking-widest text-[9px] shadow-2xl flex items-center gap-2">
                         <TrendingUp size={14} />
                         Most Listened
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-foreground/5 border border-border text-foreground/50 font-black uppercase tracking-widest text-[9px]">
                         {trendingSong?.genre || 'Essential Selection'}
                      </div>
                    </div>
                    
                    <h1 className="text-foreground text-5xl md:text-6xl lg:text-[90px] font-black tracking-tighter leading-[0.9] mb-4 md:mb-6 truncate w-full" style={{ fontFamily: "Outfit, sans-serif" }}>
                      {trendingSong?.title || "Unknown Signal"}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-10 w-full">
                       <p className="text-foreground/50 text-xl lg:text-3xl font-bold tracking-tight uppercase truncate">{trendingSong?.artist || "Unknown Artist"}</p>
                       <div className="hidden lg:block h-px flex-1 bg-gradient-to-r from-white/20 to-transparent ml-6" />
                    </div>

                    <div className="flex flex-wrap gap-4 mt-auto">
                      <button 
                        onClick={() => trendingSong && onSongSelect(trendingSong)}
                        className="px-8 md:px-12 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)] bg-foreground text-background rounded-full font-black uppercase tracking-widest text-[11px] md:text-[13px] flex items-center gap-3 hover:scale-105 transition-all"
                      >
                        <Play size={20} className="fill-current" />
                        Listen Now
                      </button>
                      <button 
                        onClick={onOpenFullscreen}
                        className="px-8 md:px-10 py-4 bg-primary/5 text-foreground/80 rounded-full font-black uppercase tracking-widest text-[11px] md:text-[13px] border border-border hover:bg-primary/10 hover:text-foreground transition-all flex items-center gap-3"
                      >
                        <span className="w-2 h-2 rounded-full bg-primary animate-[ping_2s_ease-in-out_infinite]" />
                        Turntable
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

            {/* SYNERGY STATS STRIP */}
            <motion.div variants={itemVariants} className="w-full relative group">
              <div className="absolute inset-x-0 -bottom-10 top-10 bg-indigo-500/10 blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-1000 pointer-events-none" />
              <div className="relative p-8 md:p-10 rounded-[32px] bg-white/[0.02] border border-border backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden shadow-2xl">
                
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                
                {/* Stat 1 */}
                <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                  <div className="w-14 h-14 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Headphones size={24} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-foreground/30 text-[9px] font-black uppercase tracking-[4px] mb-1">Pulse Velocity</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-foreground text-3xl font-black tracking-tighter leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>12.4<span className="text-indigo-400 text-lg">H</span></p>
                      <span className="text-foreground/10 text-[10px] font-bold uppercase tracking-widest hidden lg:block">Synergy</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-foreground/10 relative z-10" />

                {/* Stat 2 */}
                <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                  <div className="w-14 h-14 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Music2 size={24} className="text-violet-400" />
                  </div>
                  <div>
                    <p className="text-foreground/30 text-[9px] font-black uppercase tracking-[4px] mb-1">Database Depth</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-foreground text-3xl font-black tracking-tighter leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>{songs.length}</p>
                      <span className="text-foreground/10 text-[10px] font-bold uppercase tracking-widest hidden lg:block">Records</span>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-px h-16 bg-white/10 relative z-10" />

                {/* Stat 3 */}
                <div className="flex items-center gap-6 w-full md:w-auto relative z-10">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Star size={24} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-foreground/30 text-[9px] font-black uppercase tracking-[4px] mb-1">Protocol Rank</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-foreground text-3xl font-black tracking-tighter leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>GOLD</p>
                      <span className="text-foreground/10 text-[10px] font-bold uppercase tracking-widest hidden lg:block">Listener</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* COMMUNITY HOT TRACKS - SORTED BY GLOBAL PLAYS */}
            <motion.div variants={itemVariants} className="flex flex-col gap-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div>
                  <h2 className="text-foreground text-4xl font-black mb-2 tracking-tighter" style={{ fontFamily: "Outfit, sans-serif" }}>Community Hot Tracks</h2>
                  <p className="text-foreground/20 text-[11px] font-black uppercase tracking-[3px]">Global listening trends across the network</p>
                </div>
                <button className="px-6 py-2.5 rounded-full bg-foreground/5 border border-border text-foreground/40 hover:text-foreground hover:bg-indigo-600 hover:border-indigo-600 transition-all text-[10px] font-black uppercase tracking-[2px]">Sync History</button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {topTracks.map((song, idx) => (
                  <div 
                    key={song.id}
                    onClick={() => onSongSelect(song)}
                    className="flex items-center gap-6 p-5 rounded-[28px] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/20 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    <div className="text-foreground/5 text-6xl font-black absolute right-4 bottom-[-10%] select-none pointer-events-none group-hover:text-indigo-500/10 transition-colors">
                       0{idx + 1}
                    </div>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl border border-border relative z-10 shrink-0">
                      <img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-1 min-w-0 relative z-10">
                      <h3 className="text-foreground font-black text-xl mb-1 truncate leading-none tracking-tight">{song.title}</h3>
                      <p className="text-foreground/20 text-xs font-bold uppercase tracking-widest">{song.artist}</p>
                      <div className="mt-4 flex items-center gap-4">
                         <span className="text-amber-500/80 text-[10px] font-black uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">Trending Now</span>
                         <span className="text-foreground/20 text-[10px] font-black uppercase tracking-widest">{song.plays || 0} Synergy Units</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-foreground/20 shrink-0 relative z-10">
                      <button className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center hover:scale-110 transition-all shadow-xl">
                        <Play size={20} className="fill-black" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* RICH FOOTER DESIGN */}
            <motion.div variants={itemVariants} className="mt-10 pt-16 pb-12 border-t border-white/[0.05] relative overflow-hidden flex flex-col items-center md:items-start px-2 md:px-6">
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[300px] bg-indigo-600/20 blur-[150px] pointer-events-none" />

              <div className="w-full flex flex-col md:flex-row justify-between gap-16 mb-20 relative z-10">
                {/* Brand Column */}
                <div className="flex flex-col max-w-[320px] text-center md:text-left mx-auto md:mx-0 items-center md:items-start">
                   <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                     <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                       <Play size={20} className="fill-black ml-1 text-black" />
                     </div>
                     <span className="text-foreground text-2xl font-black tracking-tighter" style={{ fontFamily: "Outfit, sans-serif" }}>VINYL OS</span>
                   </div>
                   <p className="text-foreground/40 text-[13px] leading-relaxed font-medium mb-8">
                     An advanced auditory operating system bridging analog warmth with digital synergy. Designed for the true audiophile.
                   </p>
                   <div className="flex items-center justify-center md:justify-start gap-4">
                      {['TW', 'IG', 'GH', 'DC'].map(social => (
                        <button key={social} className="w-10 h-10 rounded-full bg-white/[0.03] border border-border text-foreground/40 text-[10px] font-black flex items-center justify-center hover:bg-white/10 hover:text-foreground transition-all shadow-xl">
                          {social}
                        </button>
                      ))}
                   </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 w-full md:w-auto text-center md:text-left mx-auto md:mx-0">
                  <div className="flex flex-col gap-4">
                    <span className="text-foreground text-[11px] font-black uppercase tracking-[3px] mb-2">Protocol</span>
                    {['Manifesto', 'Architecture', 'Changelog', 'Synergy Core'].map(link => (
                      <a key={link} href="#" className="text-foreground/40 hover:text-indigo-400 text-[13px] font-medium transition-colors cursor-pointer">{link}</a>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <span className="text-foreground text-[11px] font-black uppercase tracking-[3px] mb-2">Engage</span>
                    {['Community', 'Support', 'Feedback', 'Open Source'].map(link => (
                      <a key={link} href="#" className="text-foreground/40 hover:text-violet-400 text-[13px] font-medium transition-colors cursor-pointer">{link}</a>
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 hidden lg:flex">
                    <span className="text-foreground text-[11px] font-black uppercase tracking-[3px] mb-2">Legal</span>
                    {['Terms of Service', 'Privacy Policy', 'Cookie Settings', 'Guidelines'].map(link => (
                      <a key={link} href="#" className="text-foreground/40 hover:text-foreground text-[13px] font-medium transition-colors cursor-pointer">{link}</a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.05] relative z-10">
                 <p className="text-foreground/20 text-[10px] font-black uppercase tracking-[3px]">© 2026 Antigravity Protocol</p>
                 <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-black uppercase tracking-widest text-[9px]">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   All Systems Operational
                 </div>
              </div>

            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
