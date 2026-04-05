import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, Leaf, Zap, Moon, Sun, Check, ExternalLink, 
  Sparkles, Disc, Lock, Smartphone, Monitor, ChevronRight,
  Plus, X, Hash
} from 'lucide-react';
import { ElectricBorder } from './ui/ElectricBorder';

// ── COLOR UTILITIES ──
const hexToHsv = (hex) => {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, v = max;
  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0;
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToHex = (h, s, v) => {
  s /= 100; v /= 100;
  let i = Math.floor(h / 60) % 6;
  let f = h / 60 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);
  let r, g, b;
  switch (i) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  const toHex = x => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// ── CUSTOM PRECISION COLOR PICKER COMPONENT ──
function CustomPrecisionPicker({ color, onChange, onClose }) {
  const [hsv, setHsv] = useState(() => hexToHsv(color));
  const sAreaRef = useRef(null);
  const hBarRef = useRef(null);

  const handleHueChange = (e) => {
    const rect = hBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const h = (x / rect.width) * 360;
    const newHsv = { ...hsv, h };
    setHsv(newHsv);
    onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
  };

  const handleSatValChange = (e) => {
    const rect = sAreaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    const s = (x / rect.width) * 100;
    const v = 100 - (y / rect.height) * 100;
    const newHsv = { ...hsv, s, v };
    setHsv(newHsv);
    onChange(hsvToHex(newHsv.h, newHsv.s, newHsv.v));
  };

  const startDragHue = (e) => {
    handleHueChange(e);
    const move = (me) => handleHueChange(me);
    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  };

  const startDragSatVal = (e) => {
    handleSatValChange(e);
    const move = (me) => handleSatValChange(me);
    const stop = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', stop);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="bg-card/95 backdrop-blur-3xl border border-white/10 rounded-[28px] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.6)] w-[240px] flex flex-col gap-4 relative overflow-hidden group"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute inset-0 bg-primary/5 opacity-50 pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
         <span className="text-[9px] font-black uppercase tracking-[2px] opacity-30 italic font-mono">Color_Pulse</span>
         <button onClick={onClose} className="w-6 h-6 rounded-lg bg-foreground/5 hover:bg-foreground/10 flex items-center justify-center transition-colors">
            <X size={12} />
         </button>
      </div>

      {/* Saturation/Value Area */}
      <div 
        ref={sAreaRef}
        onMouseDown={startDragSatVal}
        className="relative w-full aspect-square rounded-xl overflow-hidden cursor-crosshair border border-white/5"
        style={{ backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        <motion.div 
           className="absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-xl -translate-x-1/2 translate-y-1/2 pointer-events-none z-10"
           style={{ left: `${hsv.s}%`, bottom: `${hsv.v}%`, backgroundColor: color }}
        />
      </div>

      {/* Hue Slider */}
      <div 
        ref={hBarRef}
        onMouseDown={startDragHue}
        className="h-3 w-full rounded-full cursor-pointer relative border border-white/5"
        style={{ background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)' }}
      >
        <motion.div 
           className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white shadow-xl pointer-events-none"
           style={{ left: `calc(${hsv.h / 360 * 100}%)`, marginLeft: '-8px', backgroundColor: `hsl(${hsv.h}, 100%, 50%)` }}
        />
      </div>

      {/* Hex Output */}
      <div className="flex items-center gap-3 p-2.5 bg-foreground/5 rounded-xl border border-white/5 relative z-10">
         <span className="font-mono text-xs font-black uppercase tracking-tighter text-primary">HEX</span>
         <input 
            type="text" 
            value={color.toUpperCase()} 
            readOnly
            className="bg-transparent flex-1 font-mono font-black uppercase tracking-wider text-[11px] outline-none"
         />
         <div className="w-5 h-5 rounded shadow-inner" style={{ backgroundColor: color }} />
      </div>

       <button 
         onClick={onClose}
         className="w-full py-2.5 bg-primary text-background font-black uppercase tracking-widest text-[9px] rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all relative z-10 shadow-[0_5px_15px_rgba(var(--theme-accent-rgb),0.3)]"
      >
         Finish Calibration
      </button>
    </motion.div>
  );
}

const NEON_PRESETS = [
  { id: 'cyan', color: '#00ffcc', label: 'Cyber Blue' },
  { id: 'pink', color: '#ff0055', label: 'Neon Pink' },
  { id: 'green', color: '#adff2f', label: 'Acid Green' },
  { id: 'purple', color: '#9d4edd', label: 'Electric Purple' },
  { id: 'orange', color: '#ff5e00', label: 'Sunset Orange' },
];

const STARK_PRESETS = [
  { id: 'obsidian', color: '#111111', label: 'Obsidian' },
  { id: 'red', color: '#ff3366', label: 'Studio Red' },
  { id: 'cobalt', color: '#3b82f6', label: 'Cobalt' },
  { id: 'emerald', color: '#10b981', label: 'Emerald' },
  { id: 'gold', color: '#fbbf24', label: 'Deep Gold' },
];

function ColorChanger({ presets, currentAccent, onAccentChange, title }) {
  const [showPicker, setShowPicker] = useState(false);
  const containerRef = useRef(null);

  return (
    <div className="flex flex-col gap-4 w-full relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[3px] opacity-30">{title}</span>
        <span className="text-[10px] font-black font-mono opacity-20">{currentAccent.toUpperCase()}</span>
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {presets.map((p) => (
          <motion.button
            key={p.id}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onAccentChange(p.color)}
            className={`flex-none w-8 h-8 rounded-lg border-2 transition-all relative
              ${currentAccent.toLowerCase() === p.color.toLowerCase() ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-transparent hover:border-border'}
            `}
            style={{ backgroundColor: p.color }}
            title={p.label}
          >
            {currentAccent.toLowerCase() === p.color.toLowerCase() && (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${p.color === '#ffffff' ? 'bg-black' : 'bg-white'}`} />
               </div>
            )}
          </motion.button>
        ))}
        
        {/* Custom Color Trigger */}
        <motion.button 
           whileHover={{ scale: 1.15 }}
           whileTap={{ scale: 0.9 }}
           onClick={() => setShowPicker(!showPicker)}
           className={`relative w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors flex-none
              ${showPicker ? 'border-primary bg-primary/10' : 'border-dashed border-border hover:border-primary'}
           `}
        >
           <Plus size={14} className={showPicker ? 'text-primary' : 'opacity-30'} />
        </motion.button>
      </div>

      {/* ── CONTEXTUAL POPOVER PICKER ── */}
      <AnimatePresence>
         {showPicker && (
            <div className="absolute bottom-full left-0 mb-4 z-[100]">
               <CustomPrecisionPicker 
                  color={currentAccent} 
                  onChange={onAccentChange} 
                  onClose={() => setShowPicker(false)} 
               />
               {/* Arrow */}
               <div className="absolute -bottom-2 left-4 w-4 h-4 bg-card border-r border-b border-white/10 rotate-45" />
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

export function ThemesView({ currentTheme, onThemeChange, accentColor, onAccentChange }) {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredTheme, setHoveredTheme] = useState(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const themes = [
    { 
      id: 'dark', 
      name: 'DEEP SPACE', 
      icon: Moon, 
      color: 'bg-[#0a0a0a]', 
      glow: '#3b82f6',
      desc: 'Obsidian-grade interface optimized for late-night focused sessions.',
    },
    { 
      id: 'eco', 
      name: 'NATURE HAVEN', 
      icon: Leaf, 
      color: 'bg-[#061e18]', 
      glow: '#10b981',
      desc: 'Organic chlorophyll tones designed for a restorative, grounding ambiance.',
    },
    { 
      id: 'neon', 
      name: 'CYBER NEON', 
      icon: Zap, 
      color: 'bg-[#020617]', 
      glow: accentColor, 
      desc: 'High-energy illumination inspired by futuristic data centers. Fully polychromatic.',
    },
    { 
      id: 'white', 
      name: 'STARK GALLERY', 
      icon: Sun, 
      color: 'bg-white', 
      glow: accentColor,
      desc: 'Surgical minimalist white providing maximum contrast for your custom accent.',
    },
    { 
      id: 'brutalist', 
      name: 'RETRO BRUTALIST', 
      icon: Sparkles, 
      color: 'bg-[#F1A512]', 
      glow: '#F1A512',
      desc: 'Unapologetic orange and sharp edges. A tribute to 80s arcade hardware.',
    },
  ];

  const eliteMobileThemes = [
    { id: 'f4', name: 'TAPE DECK', icon: Disc, color: 'bg-[#d6ccbd]', desc: 'Authentic warm-beige Nagra-style spooler with live physics.' },
    { id: 'studio', name: 'REEL ONE', icon: Sparkles, color: 'bg-black', desc: 'Obsidian industrial spindles with a floating cloud-white chassis.' },
  ];

  const activeThemeObj = themes.find(t => t.id === currentTheme) || themes[0];

  return (
    <div className="w-full h-full bg-background text-foreground overflow-y-auto no-scrollbar scroll-smooth relative p-6 md:p-12 pb-32">
      
      {/* ── ATMOSPHERIC BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
           animate={{ 
             backgroundColor: (hoveredTheme || activeThemeObj).glow,
             opacity: hoveredTheme ? 0.08 : 0.03
           }}
           transition={{ duration: 0.8 }}
           className="absolute inset-0 blur-[80px] scale-110 will-change-[background-color,opacity]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-[1000px] mx-auto flex flex-col gap-16">
        
        {/* Header Section */}
        <header className="flex flex-col gap-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                 <Palette size={18} className="text-primary" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[5px] text-primary">Station Ambiance_Control</span>
           </div>
           
           <div className="flex flex-col gap-2">
              <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                 The <span className="text-primary">Atmospheres.</span>
              </h1>
              <p className="text-lg md:text-xl font-bold opacity-30 max-w-xl italic uppercase tracking-tight">
                 Customize your workspace resonance. Every atmosphere adapts the entire ecosystem to your creative flow.
              </p>
           </div>
        </header>

        {/* Global Themes Grid */}
        <section className="flex flex-col gap-8">
           <div className="flex items-center gap-4">
              <h2 className="text-sm font-black uppercase tracking-[4px] text-foreground/30">Standard Operating Environments</h2>
              <div className="h-[1px] flex-1 bg-border/20" />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => {
                 const isActive = currentTheme === theme.id;
                 const Icon = theme.icon;
                 
                 const CardWrapper = isActive ? ElectricBorder : 'div';
                 const wrapperProps = isActive ? { 
                    color: theme.glow, 
                    speed: 4, 
                    chaos: 5, 
                    intensity: 15,
                    className: "rounded-[32px] overflow-hidden" 
                 } : { className: "rounded-[32px] overflow-hidden border border-border/40 hover:border-border transition-all bg-card/40 backdrop-blur-3xl group" };

                 return (
                    <div 
                      key={theme.id}
                      onMouseEnter={() => setHoveredTheme(theme)}
                      onMouseLeave={() => setHoveredTheme(null)}
                      onClick={() => onThemeChange(theme.id)}
                      className="cursor-pointer"
                    >
                       <CardWrapper {...wrapperProps}>
                          <div className={`p-8 flex flex-col gap-8 relative h-full ${isActive ? 'bg-card' : ''}`}>
                             <div className="flex items-center justify-between">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500
                                   ${isActive ? 'bg-primary text-background' : 'bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10'}
                                `}>
                                   <Icon size={24} />
                                </div>
                                {isActive && (
                                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                      <Check size={12} className="text-primary" />
                                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">Active</span>
                                   </motion.div>
                                )}
                             </div>

                             <div className="flex flex-col gap-2">
                                <h3 className={`text-3xl font-black italic uppercase tracking-tighter ${isActive ? 'text-foreground' : 'text-foreground/40'}`}>
                                   {theme.name}
                                </h3>
                                <p className="text-sm font-bold opacity-30 leading-relaxed max-w-[280px]">
                                   {theme.desc}
                                </p>
                             </div>

                             {/* Theme Specific Interaction (Color Changer) */}
                             <AnimatePresence>
                                {isActive && (theme.id === 'white' || theme.id === 'neon') && (
                                   <motion.div 
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      exit={{ y: 20, opacity: 0 }}
                                      className="pt-6 border-t border-border/40"
                                      onClick={(e) => e.stopPropagation()}
                                   >
                                      <ColorChanger 
                                         presets={theme.id === 'white' ? STARK_PRESETS : NEON_PRESETS}
                                         currentAccent={accentColor}
                                         onAccentChange={onAccentChange}
                                         title="Accent_Resonance"
                                      />
                                   </motion.div>
                                )}
                             </AnimatePresence>
                          </div>
                       </CardWrapper>
                    </div>
                 );
              })}
           </div>
        </section>

        {/* Elite Mobile Themes Barrier */}
        <section className="flex flex-col gap-10 pt-10 border-t border-border/20">
           <div className="flex md:flex-row flex-col items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-[5px] text-amber-500">Elite Hardware Synchronization</span>
                 </div>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">Mobile Exclusive Chassis</h2>
              </div>
              
              {!isMobile && (
                 <div className="flex items-center gap-4 px-6 py-3 bg-amber-500/5 border border-amber-500/20 rounded-full">
                    <Lock size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Locked for PC Terminal</span>
                 </div>
              )}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60">
              {eliteMobileThemes.map((theme) => (
                 <div key={theme.id} className="p-8 rounded-[32px] border border-border/20 bg-foreground/[0.02] flex flex-col gap-6 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-8">
                       <Lock size={20} className="text-foreground/10" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/40">
                       <theme.icon size={24} />
                    </div>
                    <div className="flex flex-col gap-2">
                       <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground/40">{theme.name}</h3>
                       <p className="text-sm font-medium opacity-20 leading-relaxed max-w-[260px]">{theme.desc}</p>
                    </div>
                    <div className="pt-6 border-t border-border/10">
                       <span className="text-[9px] font-black uppercase tracking-[3px] opacity-10 italic">Requires Smartphone Handshake</span>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* Persistence Summary */}
        <div className="p-10 rounded-[40px] bg-card/60 backdrop-blur-3xl border border-border/60 flex md:flex-row flex-col items-center gap-10">
           <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-none border border-primary/20">
              {isMobile ? <Smartphone size={36} /> : <Monitor size={36} />}
           </div>
           <div className="flex flex-col gap-2">
              <h4 className="text-xl font-black italic uppercase tracking-tighter">Persistence Protocol Active</h4>
              <p className="text-base font-bold opacity-30 leading-relaxed">
                 {isMobile 
                   ? "Every aesthetic choice you make is synchronized across your personal neural network. Tap any chassis to reconfigure your studio playback engine."
                   : "Terminal-level atmospheres are fully unlocked. However, high-fidelity mechanical chassis (Tape Deck, Reel One) are purpose-built for touch interfaces and require a mobile mobile-specific uplink."
                 }
              </p>
           </div>
        </div>

      </div>
    </div>
  );
}
