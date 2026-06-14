import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Radio, Play, Pause, Signal, Wifi, Globe, 
  Loader, ChevronLeft, Heart, Search, X, Zap, Star, LayoutGrid, 
  List, Settings2, Info, Cpu, Activity, Database, ShieldAlert,
  Terminal, Share2, Power, Eye, Volume2, Waves, Music,
  Maximize2, Box, Mic2
} from "lucide-react";

/* ── Radio Browser API ─────────────────────────────── */
const RADIO_API = "https://de1.api.radio-browser.info/json";

const GENRES = [
  { id: "electronic", label: "Electronic", color: "#00ffcc" },
  { id: "rock",       label: "Industrial", color: "#ff0055" },
  { id: "pop",        label: "Pop",        color: "#ffff00" },
  { id: "jazz",       label: "Noir",       color: "#3b82f6" },
  { id: "lofi",       label: "Space",      color: "#8b5cf6" },
  { id: "ambient",    label: "Zen",        color: "#a3e635" },
];

async function fetchStations(tag) {
  try {
    const res = await fetch(`${RADIO_API}/stations/bytag/${encodeURIComponent(tag)}?limit=40&hidebroken=true&order=votes&reverse=true`);
    return (await res.json()).filter(s => s.url_resolved && s.name);
  } catch { return []; }
}

/* ──────────────────────────────────────────────────
   PREMIUM NEON RADIO UI: "THE OBSIDIAN DECK"
────────────────────────────────────────────────── */
function StationCell({ station, isActive, isPlaying, onClick }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full h-[120px] rounded-[32px] p-6 flex flex-col justify-between transition-all border relative overflow-hidden group
        ${isActive ? 'bg-foreground/[0.08] border-foreground/40' : 'bg-foreground/[0.02] border-foreground/5 hover:border-foreground/10'}
      `}
    >
       <div className="flex items-start justify-between relative z-10">
          <div className="flex flex-col">
             <span className={`text-[15px] font-black uppercase tracking-tighter truncate max-w-[160px] ${isActive ? 'text-primary' : 'text-foreground'}`}>
                {station.name}
             </span>
             <span className="text-[9px] font-bold opacity-30 uppercase tracking-[3px] mt-1">{station.country || 'Global'}</span>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${isActive ? 'bg-primary text-primary-foreground border-primary' : 'bg-foreground/[0.05] border-foreground/[0.1] text-foreground/20'}`}>
             {isActive && isPlaying ? <Activity size={18} /> : <Radio size={18} />}
          </div>
       </div>

       <div className="flex items-center justify-between relative z-10 w-full mt-auto">
          <div className="flex items-center gap-2">
             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse shadow-[0_0_8px_var(--primary)]' : 'bg-foreground/10'}`} />
             <span className="text-[10px] font-black tracking-widest opacity-20">{station.bitrate || '---'}K</span>
          </div>
          {isActive && (
            <div className="flex gap-0.5 h-3 items-end">
               {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.4, delay: i*0.1 }} className="w-1 bg-primary" />)}
            </div>
          )}
       </div>
    </motion.button>
  );
}

export function RadioView({ onBack }) {
  const [activeGenre, setActiveGenre] = useState(GENRES[0]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    fetchStations(activeGenre.id).then(data => {
      setStations(data);
      setLoading(false);
    });
  }, [activeGenre]);

  const playStation = (station) => {
    if (currentStation?.stationuuid === station.stationuuid && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    setCurrentStation(station);
    if (audioRef.current) {
      audioRef.current.src = station.url_resolved;
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    }
  };

  return (
    <div className="w-full h-full bg-background text-foreground font-['JetBrains_Mono'] relative overflow-hidden flex flex-col">
      <audio ref={audioRef} onPlaying={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
      
      {/* ── BACKGROUND SPECTRUM ── */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-end justify-center gap-[2px]">
         {Array.from({ length: 120 }).map((_, i) => (
            <motion.div 
              key={i}
              animate={isPlaying ? { height: [`${10 + Math.random()*90}%`, `${10 + Math.random()*90}%`] } : { height: '10%' }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="flex-1 bg-primary"
            />
         ))}
      </div>

      <div className="relative z-50 flex-1 flex flex-col overflow-hidden">
         
         {/* TOP NAV GRID */}
         <header className="p-4 md:p-8 pb-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 md:gap-8">
               <button onClick={onBack} className="w-12 h-12 md:w-[60px] md:h-[60px] rounded-[18px] md:rounded-[24px] bg-foreground/[0.05] border border-foreground/[0.1] flex items-center justify-center hover:bg-foreground/[0.1] transition-all active:scale-95 flex-none">
                  <ChevronLeft size={24} className="text-foreground" />
               </button>
               <div className="flex flex-col">
                  <h1 className="text-xl md:text-3xl font-black italic tracking-tighter uppercase leading-none">Global_Frequency</h1>
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-primary opacity-60 mt-1">Uplink://Sector_01_Online</span>
               </div>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 pb-1.5 md:pb-0 max-w-full">
               {GENRES.map(g => (
                 <button 
                   key={g.id} 
                   onClick={() => setActiveGenre(g)}
                   className={`px-5 md:px-8 h-10 md:h-14 rounded-2xl md:rounded-3xl text-[10px] md:text-[11px] font-black uppercase tracking-[2px] md:tracking-[3px] transition-all border flex-none
                     ${activeGenre.id === g.id ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_20px_var(--primary)]' : 'bg-foreground/[0.05] border-foreground/[0.1] text-foreground/40 hover:bg-foreground/[0.1]'}
                   `}
                 >
                   {g.label}
                 </button>
               ))}
            </div>
         </header>

         <main className="flex-1 flex flex-col md:flex-row px-4 md:px-8 py-4 md:py-6 gap-4 md:gap-8 overflow-hidden min-h-0">
            
            {/* THE DECK (GRID) */}
            <div className="w-full md:w-[480px] grid grid-cols-2 content-start gap-3 md:gap-4 overflow-y-auto no-scrollbar pr-1 flex-none h-[30vh] md:h-full pb-10">
               {loading ? (
                  <div className="col-span-2 flex flex-col items-center justify-center py-20 md:py-40 gap-4 opacity-10">
                     <Loader size={32} className="animate-spin text-foreground md:size-[48px]" />
                     <span className="text-[9px] md:text-[10px] font-black tracking-[3px] md:tracking-[4px]">SYNC_PENDING...</span>
                  </div>
               ) : (
                  stations.map(s => (
                    <StationCell 
                      key={s.stationuuid} 
                      station={s} 
                      isActive={currentStation?.stationuuid === s.stationuuid} 
                      isPlaying={isPlaying} 
                      onClick={() => playStation(s)}
                    />
                  ))
               )}
            </div>

            {/* THE FOCUS CONSOLE (RIGHT) */}
            <div className="flex-1 flex flex-col bg-card border border-foreground/[0.05] rounded-[28px] md:rounded-[48px] overflow-hidden relative shadow-2xl min-h-0 pb-10 md:pb-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.05] to-transparent pointer-events-none" />
               <div className="absolute top-4 right-4 md:top-12 md:right-12 flex items-center gap-2 md:gap-4 text-foreground/10 text-[8px] md:text-[10px] uppercase font-black tracking-[3px] md:tracking-[4px]">
                  <Activity size={12} className="md:size-4" /> NEURAL_LOAD: 2.1%
               </div>

               <AnimatePresence mode="wait">
                  {currentStation ? (
                     <motion.div 
                       key={currentStation.stationuuid}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       exit={{ opacity: 0, y: -20 }}
                       className="flex-1 flex flex-col items-center justify-center p-4 md:p-16 text-center min-h-0 justify-around md:justify-center"
                     >
                        <div className="relative w-[180px] h-[180px] md:w-[400px] md:h-[400px] flex items-center justify-center mb-4 md:mb-16 scale-90 md:scale-100 flex-none">
                           <div className="absolute inset-0 rounded-full border border-primary/10 animate-spin-slow" />
                           <div className="absolute inset-[10%] rounded-full border border-foreground/5" />
                           
                           <div className="w-[120px] h-[120px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden shadow-[0_0_100px_rgba(var(--primary-rgb),0.1)] border-[6px] md:border-[10px] border-card relative group">
                              {currentStation.favicon ? (
                                <img src={currentStation.favicon} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-foreground/[0.05]"><Radio size={40} className="opacity-10 md:hidden" /><Radio size={100} className="opacity-10 hidden md:block" /></div>
                              )}
                              <div className="absolute inset-0 bg-black/20" />
                           </div>

                           {/* Orbiting Metadata */}
                           <div className="absolute top-0 right-0 px-3 py-1 rounded-2xl md:px-4 md:py-2 md:rounded-3xl bg-primary text-primary-foreground font-black text-[8px] md:text-[10px] tracking-[1.5px] md:tracking-[2px] uppercase shadow-xl">
                              LIVE_DECODE
                           </div>
                        </div>

                        <div className="flex flex-col gap-2 md:gap-4 overflow-hidden max-w-full">
                           <h2 className="text-2xl md:text-8xl font-black italic tracking-tight md:tracking-[-5px] uppercase leading-none truncate p-1">
                              {currentStation.name}
                           </h2>
                           <div className="flex items-center justify-center gap-4 md:gap-8">
                              <div className="flex items-center gap-1.5 md:gap-3">
                                 <Globe size={16} className="text-primary md:size-6" />
                                 <span className="text-sm md:text-2xl font-black uppercase text-foreground/60">{currentStation.country || 'Global'}</span>
                              </div>
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-foreground/10" />
                              <div className="px-3 py-1 md:px-6 md:py-2 rounded-full border border-foreground/[0.1] text-[9px] md:text-[12px] font-black uppercase tracking-[3px] md:tracking-[5px] text-foreground/30">
                                 Link_ID: {currentStation.stationuuid.slice(0, 8)}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ) : (
                     <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 py-10 md:py-0">
                        <Radio size={60} className="mb-6 text-foreground md:size-[120px] md:mb-12" />
                        <p className="text-xl md:text-4xl font-black italic uppercase tracking-[8px] md:tracking-[15px]">Select_Freq</p>
                     </div>
                  )}
               </AnimatePresence>

               {/* PERFORMANCE CONTROLS */}
               <footer className="h-20 md:h-40 px-6 md:px-16 flex items-center justify-between border-t border-foreground/[0.05] bg-card/50 backdrop-blur-3xl flex-none">
                  <div className="hidden sm:flex items-center gap-12">
                     <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-[4px]">Receiver_Volume</span>
                        <div className="w-64 h-[4px] bg-foreground/10 rounded-full overflow-hidden">
                           <div className="h-full bg-primary shadow-[0_0_15px_var(--primary)]" style={{ width: '85%' }} />
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => currentStation && playStation(currentStation)}
                    className={`w-12 h-12 md:w-[100px] md:h-[100px] rounded-2xl md:rounded-[32px] flex items-center justify-center transition-all active:scale-90
                      ${isPlaying ? 'bg-primary text-primary-foreground shadow-[0_0_50px_rgba(var(--primary-rgb),0.3)]' : 'border border-primary text-primary hover:bg-primary/10 shadow-2xl'}
                    `}
                  >
                      {isPlaying ? (
                         <>
                            <Pause size={20} className="fill-current md:hidden" />
                            <Pause size={48} className="fill-current hidden md:block" />
                         </>
                      ) : (
                         <>
                            <Play size={20} className="fill-current ml-0.5 md:hidden" />
                            <Play size={48} className="fill-current ml-2 hidden md:block" />
                         </>
                      )}
                  </button>

                  <div className="flex items-center gap-3 md:gap-6">
                     <button className="p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-foreground/[0.05] border border-foreground/[0.1] text-foreground/20 hover:text-foreground transition-all"><Settings2 size={16} className="md:size-6" /></button>
                     <button className="p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-foreground/[0.05] border border-foreground/[0.1] text-foreground/20 hover:text-foreground transition-all"><Share2 size={16} className="md:size-6" /></button>
                  </div>
               </footer>
            </div>
         </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-spin-slow { animation: spin 20s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
