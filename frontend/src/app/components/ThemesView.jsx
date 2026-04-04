import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Leaf, Zap, Moon, Sun, Check, ExternalLink, Sparkles, Disc } from 'lucide-react';

export function ThemesView({ currentTheme, onThemeChange, accentColor, onAccentChange }) {
  const themes = [
    { id: 'dark', name: 'Deep Space', icon: Moon, color: 'bg-[#0a0a0a]', desc: 'Default dark mode for late night focus.' },
    { id: 'eco', name: 'Nature Haven', icon: Leaf, color: 'bg-[#061e18]', desc: 'Organic green tones for a calming experience.' },
    { id: 'neon', name: 'Cyber Neon', icon: Zap, color: 'bg-[#020617]', desc: 'Vibrant cyan and glow for a futuristic vibe.' },
    { id: 'white', name: 'Minimal White', icon: Sun, color: 'bg-white', desc: 'Premium light interface with custom accents.' },
    { id: 'brutalist', name: 'Retro Brutalist', icon: Sparkles, color: 'bg-[#F1A512]', desc: 'Hard edges with a classic 80s arcade palette.' },
    { id: 'f4', name: 'F4 Tape Deck', icon: Disc, color: 'bg-[#d6ccbd]', desc: 'Analog tape machine UI, exclusively engineered for mobile screens.' },
  ];

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto no-scrollbar relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto w-full flex flex-col gap-10">
        <div>
           <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 w-fit mb-4">
              <Palette size={14} className="text-primary" />
              <span className="text-primary text-[10px] font-black uppercase tracking-widest">Personalization</span>
           </div>
           <h1 className="text-foreground text-[48px] md:text-[64px] font-black tracking-tighter leading-[0.9] mb-4">
             Atmospheres.
           </h1>
           <p className="text-foreground/40 text-[18px] font-medium max-w-xl">
             Customize your workspace ambiance. Each theme adapts the entire interface to suit your mood.
           </p>
        </div>

        <div className="flex flex-col gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isActive = currentTheme === theme.id;
            
            return (
              <motion.div
                key={theme.id}
                layout
                onClick={() => onThemeChange(theme.id)}
                className={`group relative rounded-[24px] border transition-all cursor-pointer overflow-hidden ${
                  isActive ? 'bg-card border-primary ring-1 ring-primary/20 shadow-2xl' : 'bg-card/40 border-border hover:bg-card/60'
                }`}
              >
                {isActive && <div className={`absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.04] blur-[50px] pointer-events-none ${theme.color}`} />}
                
                {/* Always visible header */}
                <div className="flex items-center justify-between p-6 relative z-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
                      isActive ? 'bg-primary border-primary' : 'bg-foreground/5 border-border'
                    }`}>
                      <Icon size={20} className={isActive ? 'text-background' : 'text-foreground/60'} />
                    </div>
                    <h3 className={`text-xl font-black transition-colors ${isActive ? 'text-foreground' : 'text-foreground/60'}`}>{theme.name}</h3>
                  </div>
                  
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                     isActive ? 'border-primary bg-primary' : 'border-border bg-transparent group-hover:border-foreground/40'
                  }`}>
                    {isActive && <Check size={12} strokeWidth={4} className="text-background" />}
                  </div>
                </div>

                {/* Expandable Content section */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 relative z-10"
                    >
                      <p className="text-foreground/40 text-sm leading-relaxed pl-[68px]">
                        {theme.desc}
                      </p>
                      
                      {theme.id === 'white' && (
                        <div className="pt-6 border-t border-border mt-6 ml-[68px]">
                             <p className="text-foreground text-[10px] font-black uppercase tracking-widest mb-4">Custom Accent Color</p>
                             <div className="flex items-center gap-4">
                                <div 
                                  className="w-12 h-12 rounded-2xl border border-border overflow-hidden relative cursor-pointer group"
                                  style={{ backgroundColor: accentColor }}
                                >
                                   <input 
                                     type="color" 
                                     value={accentColor}
                                     onChange={(e) => onAccentChange(e.target.value)}
                                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                   />
                                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                      <ExternalLink size={16} className={accentColor === '#ffffff' ? 'text-black' : 'text-white'} />
                                   </div>
                                </div>
                                <div className="flex-1">
                                   <p className="text-foreground font-bold text-sm uppercase tracking-tight">{accentColor}</p>
                                   <p className="text-foreground/20 text-[10px] font-medium uppercase tracking-[2px]">Tap to change</p>
                                </div>
                             </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Info Card */}
        <div className="p-8 rounded-[40px] bg-foreground/5 border border-border flex flex-col md:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-none">
             <Zap size={32} />
          </div>
          <div>
            <h4 className="text-foreground font-bold text-lg mb-1">Theme Persistence</h4>
            <p className="text-foreground/40 text-sm leading-relaxed">
              Your preferences are saved locally on this device. The system will automatically restore your chosen atmosphere on the next session.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
