import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "motion/react";
import { Radio, Play, Pause, SkipForward, SkipBack, Signal, Wifi, Globe, Loader, ChevronLeft, Heart, Search, X, Zap, Star, LayoutGrid, List, Settings2, Info } from "lucide-react";

/* ── Radio Browser API ─────────────────────────────── */
const RADIO_API = "https://de1.api.radio-browser.info/json";

const GENRES = [
  { id: "pop",       label: "Pop",       color: "#ec4899" },
  { id: "jazz",      label: "Jazz",      color: "#f59e0b" },
  { id: "lofi",      label: "Lo-Fi",     color: "#8b5cf6" },
  { id: "classical", label: "Classical", color: "#3b82f6" },
  { id: "hiphop",    label: "Hip-Hop",   color: "#10b981" },
  { id: "rock",      label: "Rock",      color: "#ef4444" },
  { id: "electronic",label: "Electronic",color: "#06b6d4" },
  { id: "ambient",   label: "Ambient",   color: "#a3e635" },
];

async function fetchStations(tag) {
  try {
    const res = await fetch(
      `${RADIO_API}/stations/bytag/${encodeURIComponent(tag)}?limit=30&hidebroken=true&order=votes&reverse=true`,
      { headers: { "User-Agent": "VinylApp/1.0" } }
    );
    const data = await res.json();
    return data.filter(s => s.url_resolved && s.name);
  } catch {
    return [];
  }
}

async function searchStations(query) {
  try {
    const res = await fetch(
      `${RADIO_API}/stations/byname/${encodeURIComponent(query)}?limit=20&hidebroken=true`,
      { headers: { "User-Agent": "VinylApp/1.0" } }
    );
    return await res.json();
  } catch {
    return [];
  }
}

/* ── Signal Bars ───────────────────────────────────── */
function SignalBars({ strength = 4, color = "#00ffaa" }) {
  return (
    <div className="flex items-end gap-[4px]">
      {[1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full transition-colors duration-300"
          animate={{
            height: 4 + i * 3,
            background: i <= strength ? color : "rgba(255,255,255,0.05)",
            boxShadow: i <= strength ? `0 0 10px ${color}40` : "none"
          }}
        />
      ))}
    </div>
  );
}

/* ── Animated Waveform ─────────────────────────────── */
function Waveform({ isPlaying, color = "#00ffaa", height = 20, bars = 12 }) {
  return (
    <div className="flex items-end gap-[2px]" style={{ height }}>
      {Array.from({ length: bars }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[2px] rounded-full"
          style={{ background: color }}
          animate={isPlaying ? {
            height: ["20%", `${40 + Math.random() * 60}%`, "20%"],
          } : { height: "20%" }}
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.04,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Clicky Rotary Knob ── */
function ClickyKnob({ label, value, onChange, size = 64 }) {
  const [isDragging, setIsDragging] = useState(false);
  const lastValueRef = useRef(value);

  const startDrag = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    let lastY = null;
    const handleMouseMove = (e) => {
      if (lastY === null) {
        lastY = e.clientY;
        return;
      }
      const delta = lastY - e.clientY;
      lastY = e.clientY;
      if (delta !== 0) {
        onChange(prev => {
           let next = Math.max(0, Math.min(100, prev + delta * 1.5));
           if (Math.abs(next - lastValueRef.current) >= 4) {
              lastValueRef.current = next;
              try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                if (ctx.state === 'suspended') ctx.resume();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(1500, ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);
                gain.gain.setValueAtTime(0.06, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.05);
              } catch (e) {}
           }
           return next;
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onChange]);

  const rotation = -135 + (value / 100) * 270;

  return (
    <div className="flex flex-col items-center gap-3">
      <div 
        className="relative rounded-full cursor-ns-resize active:scale-95 transition-transform"
        style={{ width: size, height: size, background: "radial-gradient(circle at 30% 30%, #333, #050505)", boxShadow: "0 5px 15px rgba(0,0,0,0.8), inset 0 2px 4px rgba(255,255,255,0.15)" }}
        onMouseDown={(e) => { startDrag(); e.preventDefault(); }}
      >
         <svg className="absolute -inset-4 w-[calc(100%+32px)] h-[calc(100%+32px)] pointer-events-none opacity-30" viewBox="0 0 100 100">
           {Array.from({ length: 11 }).map((_, i) => (
             <line 
               key={i} x1="50" y1="8" x2="50" y2="14"
               transform={`rotate(${-135 + (i * 27)} 50 50)`}
               stroke="white" strokeWidth="1.5"
             />
           ))}
         </svg>
         
         <div className="absolute inset-1.5 rounded-full border border-white/5" style={{ background: "conic-gradient(from 0deg, #151515, #333, #151515, #333, #151515)" }}>
            <motion.div 
               className="absolute inset-0"
               animate={{ rotate: rotation }}
               transition={{ type: "tween", duration: 0.1 }}
            >
               <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-orange-500 rounded-full shadow-[0_0_8px_#ff6600]" />
            </motion.div>
         </div>
      </div>
      <span className="text-[9px] font-black uppercase tracking-[3px] text-white/40 select-none">{label}</span>
    </div>
  );
}

/* ── Particle Visualizer ── */
function ParticleVisualizer({ isPlaying, color }) {
  const particles = useMemo(() => Array.from({ length: 25 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 1 + Math.random() * 3,
    delay: Math.random() * 2
  })), []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ 
            left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, 
            background: color, opacity: 0.2
          }}
          animate={isPlaying ? {
            y: [0, -100, 0], opacity: [0.1, 0.5, 0.1], scale: [1, 1.5, 1]
          } : { opacity: 0.05 }}
          transition={{
            duration: 5 + Math.random() * 5, repeat: Infinity, delay: p.delay, ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

/* ── Desktop Premium Analog Tuner ── */
function DesktopRadioTuner({ station, isPlaying, buffering, accentColor, onToggle, signalStrength, audioRef }) {
  const [vol, setVol] = useState(80);
  const [bass, setBass] = useState(50);
  const [treb, setTreb] = useState(50);

  useEffect(() => {
    if (!audioRef?.current) return;
    audioRef.current.volume = vol / 100;

    try {
      if (!audioRef.current.audioCtx) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioRef.current.audioCtx = ctx;
        const source = ctx.createMediaElementSource(audioRef.current);
        const bassFilter = ctx.createBiquadFilter();
        bassFilter.type = "lowshelf";
        bassFilter.frequency.value = 250;
        const trebFilter = ctx.createBiquadFilter();
        trebFilter.type = "highshelf";
        trebFilter.frequency.value = 4000;
        
        source.connect(bassFilter);
        bassFilter.connect(trebFilter);
        trebFilter.connect(ctx.destination);
        
        audioRef.current.bassFilter = bassFilter;
        audioRef.current.trebFilter = trebFilter;
      }
      if (audioRef.current.bassFilter) {
        audioRef.current.bassFilter.gain.value = ((bass - 50) / 50) * 15;
      }
      if (audioRef.current.trebFilter) {
        audioRef.current.trebFilter.gain.value = ((treb - 50) / 50) * 15;
      }
    } catch (e) {
      // Stream may not support CORS for Web Audio API EQ
    }
  }, [vol, bass, treb, audioRef]);

  return (
    <div className="w-full relative group mb-8">
      {/* Premium Mahogany/Walnut Case */}
      <div className="absolute -inset-2 rounded-[40px] bg-[#2a1a10] border-4 border-[#3a2a20] shadow-[0_40px_100px_rgba(0,0,0,0.8)] pointer-events-none" />
      
      {/* Front Panel Mesh Texture Background */}
      <div className="relative w-full p-8 md:p-10 rounded-[38px] overflow-hidden border border-white/5"
        style={{ 
          background: "linear-gradient(135deg, #151515 0%, #050505 100%)",
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)"
        }}>
        
        <ParticleVisualizer isPlaying={isPlaying} color={accentColor} />
        
        <div className="relative z-10 flex flex-col gap-8">
          
          {/* Top Row: Meta & Tubes -> EQ Rack */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
               <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-orange-500 animate-pulse shadow-[0_0_15px_#ff6600]' : 'bg-white/10'}`} />
                  <span className="text-[11px] font-black tracking-[5px] text-white/30 uppercase">ANALOG UNIT V.2024</span>
               </div>
               <div className="flex items-center gap-4 mt-2">
                 <SignalBars strength={isPlaying ? signalStrength : 0} color="#ffaa00" />
                 <span className="text-foreground/20 text-[9px] font-bold uppercase tracking-[2px]">Tuned Frequency Signal</span>
               </div>
            </div>

            {/* Interactive Audio EQ Rack */}
            <div className="flex gap-6 sm:gap-10 px-8 py-5 bg-[#080808] rounded-[32px] border border-white/5 shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)]">
               <ClickyKnob label="BASS" value={bass} onChange={setBass} size={60} />
               <ClickyKnob label="TREB" value={treb} onChange={setTreb} size={60} />
               <ClickyKnob label="VOL" value={vol} onChange={setVol} size={60} />
            </div>
          </div>

          {/* Main Content Row: Display & Tuning Knob */}
          <div className="flex flex-col lg:flex-row items-center gap-10">
            {/* Left: The Display Deck */}
            <div className="flex-1 w-full bg-black/60 rounded-[32px] border border-white/5 p-8 sm:p-10 relative overflow-hidden group/display min-h-[320px] flex flex-col mt-4">
               <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
               <div className="relative z-10 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-10">
                     <span className="text-[10px] font-black tracking-[4px] text-foreground/20 uppercase">STATION METADATA</span>
                     <div className="flex items-center gap-2">
                        {buffering && <Loader size={14} className="text-orange-500 animate-spin" />}
                        <span className="text-orange-500/80 text-[10px] font-black uppercase tracking-[3px]">{buffering ? "ACQUIRING..." : isPlaying ? "LIVE" : "READY"}</span>
                     </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={station?.stationuuid || "idle"}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      className="flex-1 flex flex-col justify-center mb-12"
                    >
                      <h1 className="text-foreground text-[32px] sm:text-[48px] lg:text-[72px] font-black tracking-tighter leading-[0.9] mb-6 italic uppercase">
                        {station?.name || "IDLE STATION"}
                      </h1>
                      <div className="flex items-center gap-6 sm:gap-10">
                        <div className="flex flex-col">
                           <span className="text-foreground text-[12px] sm:text-[14px] font-black uppercase tracking-[2px]">{station?.country || "Earth"}</span>
                           <span className="text-foreground/20 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-1">BROADCAST REGION</span>
                        </div>
                        <div className="w-px h-10 bg-foreground/10" />
                        <div className="flex flex-col">
                           <span className="text-foreground text-[12px] sm:text-[14px] font-black uppercase tracking-[2px]">{station?.bitrate || "---"} KBPS</span>
                           <span className="text-foreground/20 text-[8px] sm:text-[9px] font-black uppercase tracking-widest mt-1">BITRATE DECODING</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
               </div>

               {/* Waveform at Bottom of Display */}
               <div className="absolute bottom-0 inset-x-0 h-20 flex items-end pointer-events-none pb-4 px-10">
                  <Waveform isPlaying={isPlaying} color={accentColor} height={40} bars={80} />
               </div>
            </div>

            {/* Right: The Master Control Knob */}
            <div className="flex flex-col items-center gap-8 flex-none w-[200px]">
               <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] pointer-events-none opacity-20" viewBox="0 0 100 100">
                    {Array.from({ length: 48 }).map((_, i) => (
                      <line 
                        key={i}
                        x1="50" y1="5" x2="50" y2="10"
                        transform={`rotate(${i * 7.5} 50 50)`}
                        stroke="white" strokeWidth="0.5"
                      />
                    ))}
                  </svg>

                  <motion.div 
                    animate={isPlaying ? { rotate: 360 } : {}}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-white/5 ring-1 ring-white/10"
                  />
                  
                  <button 
                    onClick={onToggle}
                    className="w-40 h-40 rounded-full flex items-center justify-center relative group active:scale-90 transition-all cursor-pointer z-10"
                    style={{ 
                      background: "radial-gradient(circle at 30% 30%, #333 0%, #111 100%)",
                      boxShadow: "0 25px 60px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.15)"
                    }}
                  >
                     <div className="absolute inset-6 rounded-full border border-white/5 opacity-40 shadow-inner" style={{ background: "conic-gradient(from 0deg, #111, #444, #111, #444, #111)" }} />
                     
                     <div className="relative z-20 flex flex-col items-center">
                        {isPlaying ? <Pause size={56} className="text-white fill-white shadow-2xl" /> : <Play size={56} className="text-white fill-white ml-2 shadow-2xl" />}
                     </div>

                     <motion.div animate={isPlaying ? { rotate: 180 } : { rotate: 0 }} className="absolute inset-2 pointer-events-none">
                        <div className="w-1 h-3 bg-white/80 rounded-full mx-auto" />
                     </motion.div>
                  </button>
               </div>
               <div className="text-center">
                  <span className="text-[12px] font-black tracking-[6px] text-white/40 uppercase">POWER UNIT</span>
                  <p className="text-white/10 text-[8px] uppercase tracking-[3px] mt-1">Solid State Analog Bridge</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   INNER CASSETTE COMPONENTS FOR RADIO
──────────────────────────────────────────── */
function RadioReel({ isPlaying, size = 80 }) {
  const rotation = useRef(0);
  const rafRef = useRef(null);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const spin = () => {
      rotation.current += 1.8;
      setAngle(rotation.current);
      rafRef.current = requestAnimationFrame(spin);
    };
    rafRef.current = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying]);

  const outerR = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={outerR} cy={outerR} r={outerR - 2} fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
      <circle cx={outerR} cy={outerR} r={outerR * 0.72} fill="#2a2218" />
      <g transform={`rotate(${angle}, ${outerR}, ${outerR})`}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <line key={deg} x1={outerR} y1={outerR} x2={outerR + Math.cos((deg * Math.PI) / 180) * (size * 0.3)} y2={outerR + Math.sin((deg * Math.PI) / 180) * (size * 0.3)} stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
        ))}
        <circle cx={outerR} cy={outerR} r={size * 0.1} fill="#111" stroke="#444" strokeWidth="1" />
      </g>
    </svg>
  );
}

function StationCard({ station, isActive, isPlaying, onClick, accentColor, onFavorite }) {
  return (
    <motion.div
      layout
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.8}
      whileDrag={{ scale: 1.05, zIndex: 50, cursor: "grabbing" }}
      onDragEnd={(e, info) => {
        // If dragged significantly to the top, add to favorites
        if (info.offset.y < -150) {
           onFavorite?.(station);
        }
      }}
      className="relative"
    >
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
          isActive
            ? "border-white/20 bg-white/10"
            : "border-white/5 bg-white/[0.03] hover:bg-white/[0.06]"
        }`}
      >
        {/* Station favicon / fallback */}
        <div
          className="w-12 h-12 rounded-xl flex-none flex items-center justify-center overflow-hidden border border-white/10 relative"
          style={{ background: `${accentColor}20` }}
        >
          {station.favicon ? (
            <img
              src={station.favicon}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = "none"; }}
            />
          ) : (
            <Radio size={20} style={{ color: accentColor }} />
          )}
          
          {/* Drag Handle Indicator */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
             <LayoutGrid size={14} className="text-foreground" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className={`font-bold text-[14px] truncate ${isActive ? "text-foreground" : "text-foreground/80"}`}>
            {station.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-foreground/30 text-[11px] truncate">
              {station.country} {station.bitrate ? `· ${station.bitrate} kbps` : ""}
            </p>
          </div>
        </div>
        <div className="flex-none flex items-center gap-3">
          {isActive ? (
            isPlaying
              ? <Waveform isPlaying color={accentColor} height={16} />
              : <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Play size={14} className="text-foreground fill-white ml-0.5" />
                </div>
          ) : (
            <Star size={14} className="text-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </motion.button>
    </motion.div>
  );
}

/* ── Main RadioView ────────────────────────────────── */
export function RadioView({ onBack }) {
  const [activeGenre, setActiveGenre] = useState(GENRES[0]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStation, setCurrentStation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [signalStrength, setSignalStrength] = useState(4);
  const [volume, setVolume] = useState(80);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoriteStations");
    return saved ? JSON.parse(saved) : [];
  });
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const audioRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Load stations for genre
  useEffect(() => {
    setLoading(true);
    setStations([]);
    fetchStations(activeGenre.id).then(data => {
      setStations(data);
      setLoading(false);
    });
  }, [activeGenre]);

  // Fake signal fluctuation for realism
  useEffect(() => {
    if (!isPlaying) return;
    const t = setInterval(() => {
      setSignalStrength(Math.floor(3 + Math.random() * 3));
    }, 2000);
    return () => clearInterval(t);
  }, [isPlaying]);

  // Search debounce
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchStations(searchQuery);
      setSearchResults(results.filter(s => s.url_resolved));
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Volume/Favorites sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    localStorage.setItem("favoriteStations", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (station) => {
    setFavorites(prev => {
      const exists = prev.find(s => s.stationuuid === station.stationuuid);
      if (exists) return prev.filter(s => s.stationuuid !== station.stationuuid);
      return [station, ...prev];
    });
  };

  const playStation = (station) => {
    if (currentStation?.stationuuid === station.stationuuid && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    setCurrentStation(station);
    setBuffering(true);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.src = station.url_resolved;
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setBuffering(false); })
        .catch(() => { setBuffering(false); });
    }
  };

  const displayList = searchQuery.trim() ? searchResults : stations;
  const accentColor = activeGenre.color;

  return (
    <div className="w-full h-full flex flex-col bg-background rounded-[16px] overflow-hidden relative">
      <audio
        ref={audioRef}
        onWaiting={() => setBuffering(true)}
        onPlaying={() => { setIsPlaying(true); setBuffering(false); }}
        onError={() => { setBuffering(false); setIsPlaying(false); }}
        onPause={() => setIsPlaying(false)}
      />

      {/* Dynamic color glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[300px] pointer-events-none transition-colors duration-1000"
        style={{ background: `radial-gradient(ellipse at 50% -20%, ${accentColor}30 0%, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">

        {/* ── Header ── */}
        <div className="flex items-center gap-4 px-6 pt-6 pb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft size={18} className="text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="text-foreground text-xl font-black tracking-tight">Live Radio</h1>
            <p className="text-foreground/30 text-[11px] font-mono mt-0.5">Radio Browser · Open Source</p>
          </div>
          <SignalBars strength={isPlaying ? signalStrength : 0} />
        </div>

        {/* ── Now Playing Bar ── */}
        <AnimatePresence>
          {currentStation && (
            isMobile ? (
              /* Mobile Cassette UI for Radio */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mx-4 mb-6 relative group"
              >
                <div className="relative w-full aspect-[340/180] rounded-[24px] overflow-hidden border border-white/10 shadow-2xl" 
                   style={{ background: "linear-gradient(160deg, #2d2d2d 0%, #1a1a1a 50%, #252525 100%)" }}>
                  
                  {/* Inner Deck Window */}
                  <div className="absolute top-[12px] left-[12px] right-[12px] bottom-[12px] rounded-[16px] bg-[#0a0a0a] shadow-inner flex items-center justify-between px-6">
                     <RadioReel isPlaying={isPlaying} size={64} />
                     
                     <div className="flex-1 mx-4 relative h-[70px] rounded-lg overflow-hidden border border-white/5 shadow-lg">
                        <div className="absolute inset-0 bg-white/5 backdrop-blur-md z-0" />
                        <img src={currentStation.favicon || ""} className="absolute inset-0 w-full h-full object-cover opacity-20" />
                        
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 z-10 opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/natural-paper.png')" }} />
                        
                        <div className="relative z-20 h-full flex flex-col items-center justify-center p-2 text-center">
                           <span className="text-white/30 text-[7px] font-black uppercase tracking-[3px] mb-1">Station ID: {currentStation.stationuuid.slice(0, 8)}</span>
                           <p className="text-white text-[12px] font-black truncate w-full leading-tight">{currentStation.name}</p>
                           <p className="text-white/40 text-[9px] font-bold mt-1 uppercase tracking-widest">{currentStation.country}</p>
                        </div>
                     </div>

                     <RadioReel isPlaying={isPlaying} size={64} />
                  </div>

                  {/* Play/Pause Button Floating on Cassette */}
                  <button 
                    onClick={() => playStation(currentStation)}
                    className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xl z-30 active:scale-90 transition-transform"
                  >
                     {buffering ? <Loader size={20} className="text-black animate-spin" /> : isPlaying ? <Pause size={20} className="text-black fill-black" /> : <Play size={20} className="text-black fill-black ml-1" />}
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Desktop Premium Tuner */
              <div className="px-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                   {/* Favorites "Drop Zone" Bar */}
                   <AnimatePresence>
                     {favorites.length > 0 && (
                       <motion.div 
                         initial={{ height: 0, opacity: 0 }}
                         animate={{ height: "auto", opacity: 1 }}
                         className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-2"
                       >
                         <div className="flex-none flex items-center gap-2 text-foreground/20 mr-2">
                           <Star size={12} className="fill-current" />
                           <span className="text-[9px] font-black uppercase tracking-[3px]">Quick Access</span>
                         </div>
                         {favorites.map(s => (
                           <motion.button
                             key={s.stationuuid}
                             layoutId={`fav-${s.stationuuid}`}
                             onClick={() => playStation(s)}
                             className={`flex-none w-10 h-10 rounded-xl overflow-hidden border transition-all ${currentStation?.stationuuid === s.stationuuid ? 'border-white/40 ring-1 ring-white/20' : 'border-white/10 opacity-60 hover:opacity-100'}`}
                             style={{ background: `${accentColor}20` }}
                           >
                             <img src={s.favicon} className="w-full h-full object-cover" onError={e => e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M4.9 19.1C1 15.2 1 8.8 4.9 4.9'/%3E%3Cpath d='M7.8 16.2C5.4 13.8 5.4 10.2 7.8 7.8'/%3E%3Ccircle cx='12' cy='12' r='2'/%3E%3Cpath d='M16.2 7.8C18.6 10.2 18.6 13.8 16.2 16.2'/%3E%3Cpath d='M19.1 4.9C23 8.8 23 15.2 19.1 19.1'/%3E%3C/svg%3E"} />
                           </motion.button>
                         ))}
                         <button 
                           onClick={() => setFavorites([])}
                           className="flex-none p-2 text-foreground/20 hover:text-red-500 transition-colors"
                         >
                           <X size={14} />
                         </button>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <DesktopRadioTuner 
                     station={currentStation} 
                     isPlaying={isPlaying} 
                     buffering={buffering} 
                     accentColor={accentColor} 
                     onToggle={() => playStation(currentStation)}
                     signalStrength={signalStrength}
                     audioRef={audioRef}
                   />
                </motion.div>
              </div>
            )
          )}
        </AnimatePresence>

        {/* ── Search & Filter Panel ── */}
        <div className="px-6 mb-8 mt-2 relative z-20">
           <div className="flex flex-col xl:flex-row gap-6">
              {/* Ultra Modern Search */}
              <div className="relative flex-1 group">
                 <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl transition-all group-focus-within:border-white/30 group-focus-within:bg-white/[0.06]" />
                 <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-foreground/70 transition-colors" />
                 <input 
                    type="text" 
                    placeholder="Search over 50,000 global stations..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-[72px] bg-transparent pl-16 pr-8 text-foreground text-[17px] font-medium placeholder-white/20 outline-none relative z-10"
                 />
                 {searchQuery && (
                   <button onClick={() => setSearchQuery("")} className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground z-10 transition-colors">
                     <X size={20} />
                   </button>
                 )}
              </div>
              
              {/* Premium Genre Bubbles */}
              <div className="flex-none flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 xl:pb-0">
                {GENRES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setActiveGenre(g)}
                    className={`flex-none px-7 h-[72px] rounded-3xl text-[14px] font-bold tracking-wide transition-all border ${
                      activeGenre.id === g.id
                        ? "text-black border-transparent shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                        : "border-white/10 bg-white/5 text-foreground/60 hover:text-foreground hover:bg-white/10 hover:border-white/20"
                    }`}
                    style={activeGenre.id === g.id ? { background: g.color, boxShadow: `0 10px 30px ${g.color}30` } : {}}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
           </div>
        </div>

        {/* ── Station List Grid ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-[100px]">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading || isSearching ? (
                <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4">
                  <div className="relative">
                     <Loader size={48} className="text-white/10 animate-spin" />
                     <div className="absolute inset-0 blur-xl bg-orange-500/20 rounded-full animate-pulse" />
                  </div>
                  <p className="text-foreground/20 text-[14px] font-black uppercase tracking-[4px] animate-pulse">Syncing Signal...</p>
                </div>
              ) : displayList.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4">
                  <Wifi size={48} className="text-white/5" />
                  <p className="text-white/10 text-[14px] font-black uppercase tracking-[4px]">No Transmissions Found</p>
                </div>
              ) : (
                displayList.map(station => (
                  <StationCard
                    key={station.stationuuid}
                    station={station}
                    isActive={currentStation?.stationuuid === station.stationuuid}
                    isPlaying={isPlaying && currentStation?.stationuuid === station.stationuuid}
                    accentColor={accentColor}
                    onClick={() => playStation(station)}
                    onFavorite={toggleFavorite}
                  />
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
