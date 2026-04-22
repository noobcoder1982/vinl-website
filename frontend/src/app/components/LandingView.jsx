import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Check, X, MousePointer2 } from "lucide-react";
import { 
  WordsPullUp, 
  WordsPullUpMultiStyle, 
  ScrollRevealText 
} from "./ui/prisma-animations";
import { AuthView } from "./AuthView";

export function LandingView({ onAuthSuccess }) {
  const [showAuth, setShowAuth] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const containerRef = useRef(null);
  const navItems = ["Home", "About", "Discover", "Pricing", "Contact"];

  // Horizontal Scroll Observation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.offsetWidth;
      const index = Math.round(scrollLeft / width);
      const sectionId = navItems[index].toLowerCase();
      if (activeSection !== sectionId) {
        setActiveSection(sectionId);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (id) => {
    const container = containerRef.current;
    if (!container) return;
    const index = navItems.findIndex(item => item.toLowerCase() === id);
    if (index !== -1) {
      container.scrollTo({
        left: index * container.offsetWidth,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="bg-black text-[#E1E0CC] h-screen w-screen overflow-hidden font-['Almarai'] relative">
      
      {/* ── AUTH OVERLAY ── */}
      <AnimatePresence>
        {showAuth && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] bg-black/80 backdrop-blur-3xl"
          >
            <AuthView 
              onAuthSuccess={(user) => {
                setShowAuth(false);
                onAuthSuccess(user);
              }}
              onBack={() => setShowAuth(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HORIZONTAL NAVBAR ── */}
      <div className="fixed top-0 left-0 right-0 z-[2000] flex justify-center p-6">
        <nav className="bg-black/40 backdrop-blur-md rounded-full px-10 py-4 flex items-center gap-10 border border-white/5">
          {navItems.map((item) => {
            const id = item.toLowerCase();
            const isActive = activeSection === id;
            
            return (
              <button 
                key={item} 
                onClick={() => scrollToSection(id)}
                className={`text-[10px] sm:text-xs font-black uppercase tracking-[4px] transition-all duration-500 relative ${
                  isActive ? "text-primary opacity-100 scale-110" : "opacity-30 hover:opacity-100"
                }`}
              >
                {item}
                {isActive && (
                  <motion.div 
                    layoutId="activeNavTab"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-primary"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── HORIZONTAL SCROLL CONTAINER ── */}
      <div 
        ref={containerRef}
        className="flex h-screen w-screen overflow-x-auto overflow-y-hidden snap-x snap-mandatory no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        
        {/* PAGE 1: HERO */}
        <section id="home" className="w-screen h-screen flex-shrink-0 snap-center relative overflow-hidden">
          <div className="absolute inset-0 p-4 md:p-10">
            <div className="relative h-full w-full rounded-[3rem] overflow-hidden">
              <img 
                src="/hero_sunset.jpg" 
                alt="Cinematic Sunset"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-10 noise-overlay opacity-[0.6] mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 z-20 p-12 md:p-24">
                <WordsPullUp 
                  text="Vinl" 
                  showAsterisk={true}
                  className="text-[24vw] font-bold tracking-[-0.06em] leading-[0.8] py-4"
                />
                <div className="mt-12 flex items-center justify-between">
                  <p className="text-primary/60 text-xs sm:text-sm uppercase tracking-[8px] font-bold max-w-sm">
                    Synchronized. Lossless. Immersive. <br />The ultimate sonic experience.
                  </p>
                  <button 
                    onClick={() => scrollToSection("about")}
                    className="group flex items-center bg-primary rounded-full px-8 py-4 gap-4 transition-all hover:scale-105 active:scale-95"
                  >
                    <span className="text-black font-black text-xs uppercase tracking-[4px]">Explore Story</span>
                    <ArrowRight className="text-black" size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 2: ABOUT (THE CREATOR) - CINEMATIC CARD UI */}
        <section id="about" className="w-screen h-screen flex-shrink-0 snap-center bg-black flex items-center justify-center p-10 md:p-20">
           <div className="relative w-full h-full max-w-7xl mx-auto rounded-[4rem] bg-[#0A0A0A] border border-white/5 overflow-hidden flex items-center justify-center p-12 md:p-32 group">
              <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
              <div className="absolute top-12 left-1/2 -translate-x-1/2">
                 <span className="text-primary text-[10px] font-black uppercase tracking-[15px] opacity-40">The Architect</span>
              </div>

              <div className="text-center relative z-10">
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter leading-[1.1] mb-12 text-[#E1E0CC]"
                >
                  Abhijeet Panda.
                </motion.h2>

                <WordsPullUpMultiStyle 
                  segments={[
                    { text: "This began as a college project,", className: "font-normal text-primary/80" },
                    { text: " but it was always the dream.", className: "font-serif italic opacity-40" },
                    { text: " I wanted to bridge the gap between the soul of vinyl and AI music.", className: "font-normal" }
                  ]}
                  className="text-xl sm:text-3xl md:text-5xl font-bold tracking-tight leading-[1.3] mb-16 max-w-4xl mx-auto"
                />

                <p className="text-[#DEDBC8]/30 text-xs sm:text-sm md:text-lg uppercase tracking-[6px] font-bold leading-relaxed max-w-3xl mx-auto">
                   I've always wanted to build a vinyl music player, but never could until now. As someone who loves making AI music, I wanted a unique, immersive space to experience it. Vinl. is the result of that obsession.
                </p>
              </div>

              <div className="absolute bottom-12 right-12">
                 <button onClick={() => scrollToSection("discover")} className="flex items-center gap-4 text-primary/40 hover:text-primary transition-all uppercase text-[10px] font-black tracking-[4px]">
                    Next Node <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        </section>

        {/* PAGE 3: DISCOVER (FEATURES) */}
        <section id="discover" className="w-screen h-screen flex-shrink-0 snap-center bg-[#050505] flex items-center justify-center p-10">
           <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard number="01" title="High Fidelity" desc="Lossless audio streaming with 24-bit studio quality as the baseline." />
              <FeatureCard number="02" title="Smart Sync" desc="Real-time social synchronization. Listen with friends in perfect harmony." />
              <FeatureCard number="03" title="Offline Mode" desc="Take your library anywhere. High-performance caching for global nodes." />
           </div>
        </section>

        {/* PAGE 4: PRICING */}
        <section id="pricing" className="w-screen h-screen flex-shrink-0 snap-center bg-black flex items-center justify-center p-10">
           <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="p-16 rounded-[3rem] bg-[#0A0A0A] border border-white/5 flex flex-col items-center text-center">
                 <span className="text-primary text-[10px] font-black uppercase tracking-[10px] mb-8">Node Alpha</span>
                 <h3 className="text-5xl font-bold text-[#E1E0CC] mb-4">Free</h3>
                 <p className="text-white/30 text-xs uppercase tracking-[4px] mb-12">Standard Fidelity</p>
                 <button onClick={() => setShowAuth(true)} className="w-full py-6 rounded-full border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[5px] hover:bg-primary hover:text-black transition-all">Join Network</button>
              </div>
              <div className="p-16 rounded-[3rem] bg-primary/5 border border-primary/20 flex flex-col items-center text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 bg-primary text-black text-[9px] font-black px-6 py-2 rounded-bl-2xl uppercase tracking-widest">Recommended</div>
                 <span className="text-primary text-[10px] font-black uppercase tracking-[10px] mb-8">Node Prime</span>
                 <h3 className="text-5xl font-bold text-[#E1E0CC] mb-4">$9.99</h3>
                 <p className="text-white/30 text-xs uppercase tracking-[4px] mb-12">Ultra Fidelity + Studio Sync</p>
                 <button onClick={() => setShowAuth(true)} className="w-full py-6 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-[5px] hover:scale-105 transition-all">Ascend Now</button>
              </div>
           </div>
        </section>

        {/* PAGE 5: CONTACT */}
        <section id="contact" className="w-screen h-screen flex-shrink-0 snap-center bg-[#050505] flex flex-col items-center justify-center p-10">
           <span className="text-primary text-[11px] font-black uppercase tracking-[20px] mb-12">Connect</span>
           <h1 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter mb-20 text-[#E1E0CC]">Get Started.</h1>
           <button 
             onClick={() => setShowAuth(true)}
             className="bg-primary text-black px-12 py-6 rounded-full font-black text-sm uppercase tracking-[8px] hover:scale-110 transition-all mb-24"
           >
             Create Account
           </button>
           <div className="flex flex-col items-center gap-4 opacity-20">
              <h4 className="text-3xl font-bold italic">Vinl.</h4>
              <p className="text-[10px] font-black uppercase tracking-[10px]">© 2026 Sonic Evolution</p>
           </div>
        </section>

      </div>

      {/* ── CUSTOM SCROLLBAR HIDER ── */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
}

function FeatureCard({ number, title, desc }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-16 rounded-[3rem] bg-[#0A0A0A] border border-white/5 group hover:border-primary/20 transition-all shadow-2xl h-[500px] flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
         <span className="text-[11px] font-black text-primary/30 group-hover:text-primary transition-colors">({number})</span>
         <ArrowRight size={20} className="-rotate-45 opacity-20 group-hover:opacity-100 transition-all text-primary" />
      </div>
      <div>
        <h4 className="text-4xl font-bold uppercase tracking-tighter mb-6 text-[#E1E0CC]">{title}</h4>
        <p className="text-gray-500 text-[11px] font-black uppercase tracking-[3px] leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}
