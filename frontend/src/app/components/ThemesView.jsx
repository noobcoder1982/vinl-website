import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Leaf, Zap, Moon, Sun, Check, ExternalLink, Sparkles, Disc, Lock, Smartphone, Monitor } from 'lucide-react';

export function ThemesView({ currentTheme, onThemeChange, accentColor, onAccentChange }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const globalThemes = [
    { id: 'dark', name: 'Deep Space', icon: Moon, color: 'bg-[#0a0a0a]', desc: 'Default dark mode for late night focus.' },
    { id: 'eco', name: 'Nature Haven', icon: Leaf, color: 'bg-[#061e18]', desc: 'Organic green tones for a calming experience.' },
    { id: 'neon', name: 'Cyber Neon', icon: Zap, color: 'bg-[#020617]', desc: 'Vibrant cyan and glow for a futuristic vibe.' },
    { id: 'white', name: 'Minimal White', icon: Sun, color: 'bg-white', desc: 'Premium light interface with custom accents.' },
    { id: 'brutalist', name: 'Retro Brutalist', icon: Sparkles, color: 'bg-[#F1A512]', desc: 'Hard edges with a classic 80s arcade palette.' },
  ];

  const mobileOnlyThemes = [
    { id: 'f4', name: 'Tape Deck', icon: Disc, color: 'bg-[#d6ccbd]', desc: 'Authentic warm-beige Nagra-style spooler with live mechanical physics.' },
    { id: 'studio', name: 'Reel One', icon: Sparkles, color: 'bg-black', desc: 'Obsidian industrial spindles with a floating cloud-white chassis.' },
  ];

  const renderThemeCard = (theme, isLocked = false) => {
    const Icon = theme.icon;
    const isActive = currentTheme === theme.id;
    
    return (
      <motion.div
        key={theme.id}
        layout
        onClick={() => !isLocked && onThemeChange(theme.id)}
        className={`group relative rounded-[24px] border transition-all overflow-hidden ${
          isLocked ? 'bg-foreground/[0.02] border-white/5 cursor-not-allowed opacity-60' :
          isActive ? 'bg-card border-primary ring-1 ring-primary/20 shadow-2xl cursor-pointer' : 'bg-card/40 border-border hover:bg-card/60 cursor-pointer'
        }`}
      >
        {isActive && !isLocked && <div className={`absolute top-0 right-0 w-[300px] h-[300px] opacity-[0.04] blur-[50px] pointer-events-none ${theme.color}`} />}
        
        <div className="flex items-center justify-between p-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${
              isActive && !isLocked ? 'bg-primary border-primary' : 'bg-foreground/5 border-border'
            }`}>
              {isLocked ? <Lock size={18} className="text-foreground/20" /> : <Icon size={20} className={isActive ? 'text-background' : 'text-foreground/60'} />}
            </div>
            <div className="flex flex-col">
               <h3 className={`text-xl font-black transition-colors ${isActive && !isLocked ? 'text-foreground' : 'text-foreground/60'}`}>
                  {theme.name}
               </h3>
               {isLocked && <span className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Mobile Sync Required</span>}
            </div>
          </div>
          
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
             isActive && !isLocked ? 'border-primary bg-primary' : 'border-border bg-transparent group-hover:border-foreground/40'
          }`}>
            {isActive && !isLocked && <Check size={12} strokeWidth={4} className="text-background" />}
            {isLocked && <Lock size={10} className="text-foreground/20" />}
          </div>
        </div>

        <AnimatePresence>
          {(isActive && !isLocked) && (
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
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto no-scrollbar relative bg-background">
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
           <p className="text-foreground/40 text-[18px] font-medium max-w-xl italic">
             Customize your workspace ambiance. Each theme adapts the entire interface to suit your mood.
           </p>
        </div>

        {/* Global Section */}
        <div className="flex flex-col gap-4">
           <h2 className="text-foreground/20 text-[10px] font-black uppercase tracking-[5px] px-2 mb-2 italic">Standard Experience</h2>
           {globalThemes.map(t => renderThemeCard(t))}
        </div>

        {/* Mobile Specific Section */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-2 mb-2">
              <h2 className="text-primary text-[10px] font-black uppercase tracking-[5px] italic">Mobile Specific Player Themes</h2>
              {!isMobile && (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 border border-primary/20 rounded-full">
                    <Lock size={8} className="text-primary" />
                    <span className="text-[8px] font-black text-primary uppercase">Locked for PC</span>
                 </div>
              )}
           </div>

           {!isMobile && (
              <div className="px-6 py-4 bg-primary/5 border border-primary/10 rounded-2xl mb-2">
                 <p className="text-primary text-xs font-black uppercase tracking-tight italic">
                    Exclusive Feature Detected: To unlock these elite player chassis, please access Vinl. from your smartphone.
                 </p>
              </div>
           )}

           {mobileOnlyThemes.map(t => renderThemeCard(t, !isMobile))}
        </div>

        {/* Info Card */}
        <div className="p-8 rounded-[40px] bg-card border border-border flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-none">
             {isMobile ? <Smartphone size={32} /> : <Monitor size={32} />}
          </div>
          <div>
            <h4 className="text-foreground font-black text-lg mb-1 uppercase tracking-tight italic">Synergy Persistence</h4>
            <p className="text-foreground/40 text-sm font-medium leading-relaxed">
              {isMobile 
                ? "Your mobile-exclusive player themes are now synced. Switch themes to see your chassis transform in real-time."
                : "Your preferences are saved across the network. Local atmospheres remain unlocked for Desktop, but player-specific chassis require a mobile handshake."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
