import React, { useRef, useState, useEffect } from "react";
import { 
  motion, 
  AnimatePresence, 
  animate
} from "motion/react";
import { ArrowRight, Check, X, MousePointer2 } from "lucide-react";
import { 
  WordsPullUp, 
  WordsPullUpMultiStyle, 
  WordsBlurReveal,
  ScrollRevealText 
} from "./ui/prisma-animations";
import { AuthView } from "./AuthView";

export function LandingView({ onAuthSuccess }) {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [showAuth, setShowAuth] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const isManualScroll = useRef(false);
  const navItems = ["Home", "About", "Discover", "Pricing", "Get Started"];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Responsive Scroll Observation
  useEffect(() => {
    const container = containerRef.current;
    if (!container || isMobile) return;

    const handleScroll = () => {
      if (isManualScroll.current) return; // Prevent jitter during programmatic scroll
      
      const containerRect = container.getBoundingClientRect();
      let closestIndex = 0;
      let minDiff = Infinity;

      navItems.forEach((item, index) => {
        const id = item.toLowerCase().replace(" ", "-");
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const diff = Math.abs(rect.left - containerRect.left);
            
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = index;
          }
        }
      });

      const sectionId = navItems[closestIndex].toLowerCase().replace(" ", "-");
      if (activeSection !== sectionId) {
        setActiveSection(sectionId);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSection, isMobile]);

  const scrollToSection = (id) => {
    const container = containerRef.current;
    if (!container || isMobile) return;
    const targetSection = document.getElementById(id);
    if (!targetSection) return;

    isManualScroll.current = true;
    setActiveSection(id);
    
    const targetScroll = targetSection.offsetLeft;
    animate(container.scrollLeft, targetScroll, {
      type: "spring",
      stiffness: 500,
      damping: 38,
      mass: 0.5,
      onUpdate: (latest) => {
        container.scrollLeft = latest;
      },
      onComplete: () => {
        isManualScroll.current = false;
      }
    });
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
            className="fixed inset-0 z-[3000] bg-black"
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

      {isMobile ? (
        <MobileLandingLayout 
          billingCycle={billingCycle}
          setBillingCycle={setBillingCycle}
          setShowAuth={setShowAuth}
        />
      ) : (
        <>
          {/* ── ERGONOMIC BOTTOM NAVBAR ── */}
          <div className="fixed bottom-5 sm:bottom-10 left-1/2 -translate-x-1/2 z-[2000] flex justify-center w-[calc(100%-2rem)] sm:w-auto">
            <nav className="bg-white/5 backdrop-blur-xl rounded-full px-1.5 py-1.5 sm:px-2 sm:py-2 flex items-center gap-0.5 sm:gap-1 border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] max-w-full overflow-x-auto no-scrollbar">
              {navItems.map((item) => {
                const id = item.toLowerCase().replace(" ", "-");
                const isActive = activeSection === id;
                
                    return (
                      <button 
                        key={item} 
                        onClick={() => scrollToSection(id)}
                        className={`text-[8px] sm:text-[11px] font-black uppercase tracking-[1px] sm:tracking-[3px] transition-all duration-300 relative px-3 py-2 sm:px-6 sm:py-3 rounded-full whitespace-nowrap cursor-none ${
                          isActive ? "text-black z-10" : "opacity-40 hover:opacity-100 text-primary"
                        }`}
                      >
                        {item}
                        {isActive && (
                          <motion.div 
                            layoutId="activeNavTab"
                            className="absolute inset-0 bg-primary rounded-full -z-10"
                            transition={{ 
                              type: "spring", 
                              stiffness: 500, 
                              damping: 38,
                              mass: 0.5
                            }}
                          />
                        )}
                      </button>
                    );
              })}
            </nav>
          </div>

          {/* ── RESPONSIVE SCROLL CONTAINER ── */}
          <div 
            ref={containerRef}
            className="flex flex-col md:flex-row h-full w-full overflow-y-auto md:overflow-y-hidden overflow-x-hidden md:overflow-x-auto snap-y md:snap-x snap-mandatory no-scrollbar"
            style={{ scrollBehavior: 'smooth' }}
          >
            
            {/* PAGE 1: HERO */}
            <section id="home" className="w-full md:w-screen h-full md:h-screen flex-shrink-0 snap-start md:snap-center relative overflow-hidden">
              <div className="absolute inset-0 p-3 sm:p-4 md:p-10">
                <div className="relative h-full w-full rounded-[1.5rem] sm:rounded-[2rem] md:rounded-[3rem] overflow-hidden">
                  <img 
                    src="/hero_sunset.jpg" 
                    alt="Cinematic Sunset"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 z-10 noise-overlay opacity-[0.6] mix-blend-overlay pointer-events-none" />
                  <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none" />
                  
                  <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-12 md:p-24">
                    <WordsPullUp 
                      text="Vinl" 
                      showAsterisk={true}
                      className="text-[18vw] sm:text-[24vw] font-bold tracking-[-0.06em] leading-[0.8] py-4"
                    />
                    <div className="mt-6 md:mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
                      <p className="text-primary/60 text-[10px] sm:text-xs md:text-sm uppercase tracking-[4px] sm:tracking-[8px] font-bold max-w-sm">
                        Synchronized. Lossless. Immersive. <br className="hidden sm:inline" />The ultimate sonic experience.
                      </p>
                      <button 
                        onClick={() => scrollToSection("about")}
                        className="group flex items-center bg-primary rounded-full px-6 py-3 md:px-8 md:py-4 gap-3 md:gap-4 transition-all hover:scale-105 active:scale-95 cursor-none"
                      >
                        <span className="text-black font-black text-[10px] md:text-xs uppercase tracking-[3px] md:tracking-[4px]">Explore Story</span>
                        <ArrowRight className="text-black w-4 h-4 md:w-5 md:h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PAGE 2: ABOUT (THE CREATOR) - HYBRID TYPOGRAPHY */}
            <section id="about" className="w-full md:w-screen min-h-full md:h-screen flex-shrink-0 snap-start md:snap-center bg-black flex items-center justify-center p-4 sm:p-10 md:p-20 py-20 md:py-20">
               <div className="relative w-full min-h-full md:h-full max-w-7xl mx-auto rounded-[2rem] md:rounded-[4rem] bg-[#0A0A0A] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 sm:p-12 md:p-32 group py-16 md:py-32">
                  <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
                  
                  <div className="absolute top-6 sm:top-12 left-1/2 -translate-x-1/2">
                     <span className="text-primary text-[10px] font-black uppercase tracking-[6px] opacity-40">The Visionary</span>
                  </div>

                  <div className="text-center relative z-10 max-w-5xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="mb-6"
                    >
                      <h2 className="text-[12vw] sm:text-[8vw] md:text-[6vw] font-bold tracking-tighter leading-none text-[#E1E0CC]">
                        Abhijeet <span className="font-serif italic text-primary/80 ml-2">Panda</span>
                      </h2>
                    </motion.div>

                    <WordsBlurReveal 
                      text="This began as a college project, but it was always the dream. I wanted to bridge the gap between the soul of vinyl and the power of AI music."
                      className="text-lg sm:text-2xl md:text-4xl font-bold tracking-tight leading-[1.3] mb-6 md:mb-10 text-center justify-center"
                    />

                    <div className="max-w-2xl mx-auto">
                      <p className="text-[#DEDBC8]/40 text-xs sm:text-base md:text-lg font-medium leading-relaxed">
                        I've always wanted to build a <span className="text-primary italic font-serif">vinyl music player</span>, but never could until now. As someone who loves making <span className="text-primary italic font-serif">AI music</span>, I wanted a unique, immersive space to experience it. Vinl. is the result of that obsession—a high-fidelity synchronization of past and future soundscapes.
                      </p>
                    </div>
                  </div>

                  <div className="relative mt-8 md:mt-0 md:absolute md:bottom-12 md:left-1/2 -translate-x-1/2">
                     <button onClick={() => scrollToSection("discover")} className="flex flex-col items-center gap-2 text-primary/40 hover:text-primary transition-all group cursor-none">
                        <span className="uppercase text-[9px] font-black tracking-[4px]">Next Node</span>
                        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                           <ArrowRight size={16} className="rotate-90" />
                        </motion.div>
                     </button>
                  </div>
               </div>
            </section>

            {/* PAGE 3: DISCOVER (FEATURES) */}
            <section id="discover" className="w-full md:w-screen min-h-full md:h-screen flex-shrink-0 snap-start md:snap-center bg-[#050505] flex items-center justify-center p-4 sm:p-10 py-20 md:py-10">
               {/* Background Mesh Node */}
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg width="100%" height="100%" className="w-full h-full">
                     <pattern id="nodeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                        <circle cx="1" cy="1" r="1" fill="#DEDBC8" />
                     </pattern>
                     <rect width="100%" height="100%" fill="url(#nodeGrid)" />
                  </svg>
               </div>

               <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-20 items-center relative z-10">
                  {/* Cinematic Anchor (Left) */}
                  <div className="lg:col-span-5 space-y-6 md:space-y-8">
                     <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, ease: "circOut" }}
                     >
                        <span className="text-primary text-[10px] font-black uppercase tracking-[6px] md:tracking-[8px] mb-4 md:mb-6 block opacity-40">Feature Architecture</span>
                        <h2 className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter text-[#E1E0CC] leading-[0.85] mb-6 md:mb-8">
                           The Core<br />
                           <span className="font-serif italic text-primary/80">Ecosystem.</span>
                        </h2>
                        <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed max-w-sm uppercase tracking-wider">
                           Engineered for precision. Built for synergy. Explore the technical nodes that define the next era of sonic flow.
                        </p>
                     </motion.div>
                  </div>

                  {/* System Stack (Right) */}
                  <div className="lg:col-span-7 grid grid-cols-1 gap-4">
                     {[
                        { 
                           id: "01", 
                           title: "Neural Acoustics", 
                           tag: "Studio Master",
                           desc: "Experience 32-bit studio-master fidelity with zero-latency neural reconstruction protocols.",
                           color: "primary"
                        },
                        { 
                           id: "02", 
                           title: "Quantum Synergy", 
                           tag: "Social Protocol",
                           desc: "Real-time synchronization engine ensuring perfectly aligned listening nodes across the global network.",
                           color: "blue-500"
                        },
                        { 
                           id: "03", 
                           title: "Edge Architecture", 
                           tag: "Persistence Node",
                           desc: "High-performance edge-caching architecture ensuring library persistence even in zero-uplink zones.",
                           color: "orange-500"
                        }
                     ].map((feature, i) => (
                        <motion.div 
                           key={i}
                           initial={{ opacity: 0, y: 30 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           transition={{ duration: 0.8, delay: i * 0.2, ease: "circOut" }}
                           whileHover={{ x: 20 }}
                           className="group relative p-5 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 cursor-default flex items-center justify-between gap-4"
                        >
                           <div className="flex items-center gap-4 sm:gap-10">
                              <span className="text-2xl sm:text-4xl font-black text-white/5 group-hover:text-primary/20 transition-colors duration-500">{feature.id}</span>
                              <div className="space-y-1">
                                 <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <h4 className="text-lg sm:text-2xl font-bold text-[#E1E0CC] tracking-tight">{feature.title}</h4>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 text-white/40`}>{feature.tag}</span>
                                 </div>
                                 <p className="text-white/40 text-[10px] sm:text-xs font-medium max-w-md">{feature.desc}</p>
                              </div>
                           </div>
                           
                           <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-white/5 flex-shrink-0 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                           </div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* PAGE 4: PRICING (NETWORK SYNTHESIS) */}
            <section id="pricing" className="w-full md:w-screen min-h-full md:h-screen flex-shrink-0 snap-start md:snap-center bg-black flex items-center justify-center p-4 sm:p-10 md:p-20 py-24 md:py-20 overflow-y-auto">
               <div className="max-w-7xl w-full">
                  {/* Header & Toggle */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 md:mb-12 gap-6 md:gap-8">
                     <div>
                        <span className="text-primary text-[10px] font-black uppercase tracking-[6px] mb-3 md:mb-4 opacity-40">System Access</span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-[#E1E0CC]">Creative <span className="font-serif italic text-primary/80">Access.</span></h2>
                     </div>
                     
                     <div className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center gap-1 backdrop-blur-xl">
                        <button 
                           onClick={() => setBillingCycle('monthly')}
                           className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-none ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                           Monthly
                        </button>
                        <button 
                           onClick={() => setBillingCycle('yearly')}
                           className={`px-4 py-2 sm:px-6 sm:py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all cursor-none ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                        >
                           Yearly
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                     {/* FREE NODE */}
                     <motion.div 
                        whileHover={{ y: -10 }}
                        className="group relative p-6 sm:p-8 rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 flex flex-col transition-all duration-500 overflow-hidden"
                     >
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-cyan-500/20 to-teal-500/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                           <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[4px] mb-6 block">Baseline</span>
                           <h3 className="text-4xl font-black text-[#E1E0CC] mb-2 tracking-tight">Free</h3>
                           <div className="flex items-baseline gap-1 mb-8">
                              <span className="text-3xl font-bold text-[#E1E0CC]">£00</span>
                              <span className="text-[10px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                           </div>

                           <button onClick={() => setShowAuth(true)} className="w-full py-4 rounded-full border border-white/10 text-white text-[9px] font-black uppercase tracking-[3px] hover:bg-white hover:text-black transition-all mb-8 cursor-none">
                              Cancel
                           </button>

                           <div className="space-y-4 pt-8 border-t border-white/5">
                              <p className="text-[9px] font-black uppercase tracking-[2px] text-white/20 mb-4">Baseline includes:</p>
                              {[
                                { text: "Standard Fidelity Audio", included: true },
                                { text: "Single Social Sync", included: true },
                                { text: "Basic Library Node", included: true },
                                { text: "Community Access", included: true },
                                { text: "Email Support", included: false },
                                { text: "Studio Master Node", included: false }
                              ].map((feat, i) => (
                                 <div key={i} className={`flex items-center gap-3 ${feat.included ? 'opacity-100' : 'opacity-20'}`}>
                                    {feat.included ? <div className="w-3 h-3 rounded-full bg-green-500/20 flex items-center justify-center text-[8px] text-green-500">✓</div> : <div className="text-[10px]">✕</div>}
                                    <span className="text-white/60 text-[9px] font-bold uppercase tracking-[1px]">{feat.text}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </motion.div>

                     {/* PRO NODE */}
                     <motion.div 
                        whileHover={{ y: -10 }}
                        className="group relative p-6 sm:p-8 rounded-[1.5rem] bg-white/[0.03] border border-blue-500/30 flex flex-col transition-all duration-500 overflow-hidden shadow-[0_30px_60px_rgba(59,130,246,0.1)] md:scale-105 z-20"
                     >
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-blue-600/40 to-indigo-600/5 blur-3xl opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                           <span className="text-blue-400 text-[9px] font-black uppercase tracking-[4px] mb-6 block">Standard Node</span>
                           <h3 className="text-4xl font-black text-[#E1E0CC] mb-2 tracking-tight">Pro</h3>
                           <div className="flex items-baseline gap-1 mb-8">
                              <span className="text-3xl font-bold text-[#E1E0CC]">{billingCycle === 'monthly' ? '£9.99' : '£99.99'}</span>
                              <span className="text-[10px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                              {billingCycle === 'yearly' && <span className="ml-2 text-[8px] text-blue-400 font-black uppercase bg-blue-500/10 px-2 py-0.5 rounded-full">Save 15%</span>}
                           </div>

                           <button onClick={() => setShowAuth(true)} className="w-full py-4 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-[3px] shadow-lg shadow-blue-600/20 hover:scale-105 transition-all mb-8 cursor-none">
                              Initialize Node
                           </button>

                           <div className="space-y-4 pt-8 border-t border-white/10">
                              <p className="text-[9px] font-black uppercase tracking-[2px] text-white/40 mb-4">Pro includes:</p>
                              {[
                                { text: "High Fidelity Lossless", included: true },
                                { text: "Infinite Social Sync", included: true },
                                { text: "Studio Sync™ Plus", included: true },
                                { text: "AI Discovery Master", included: true },
                                { text: "Priority Uplink", included: true },
                                { text: "Enterprise Synthesis", included: false }
                              ].map((feat, i) => (
                                 <div key={i} className={`flex items-center gap-3 ${feat.included ? 'opacity-100' : 'opacity-20'}`}>
                                    {feat.included ? <div className="w-3 h-3 rounded-full bg-blue-500/20 flex items-center justify-center text-[8px] text-blue-400">✓</div> : <div className="text-[10px]">✕</div>}
                                    <span className="text-white/80 text-[9px] font-bold uppercase tracking-[1px]">{feat.text}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </motion.div>

                     {/* ULTRA NODE */}
                     <motion.div 
                        whileHover={{ y: -10 }}
                        className="group relative p-6 sm:p-8 rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 flex flex-col transition-all duration-500 overflow-hidden"
                     >
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-orange-500/20 to-red-500/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                        <div className="relative z-10">
                           <span className="text-orange-400 text-[9px] font-black uppercase tracking-[4px] mb-6 block">Master Node</span>
                           
                           <div className="h-10 flex items-center mb-2">
                              <svg viewBox="0 0 160 50" className="w-32 h-auto overflow-visible">
                                 <text 
                                    x="0" 
                                    y="35" 
                                    fill="#FFE24B" 
                                    className="font-normal"
                                    style={{ 
                                      fontFamily: "'Playwrite US Trad', cursive",
                                      fontSize: "42px",
                                      filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.3))",
                                      transform: "skewX(-15deg)" 
                                    }}
                                 >
                                    ultra
                                 </text>
                              </svg>
                           </div>

                           <div className="flex items-baseline gap-1 mb-8">
                              <span className="text-3xl font-bold text-[#E1E0CC]">{billingCycle === 'monthly' ? '£19.99' : '£199.99'}</span>
                              <span className="text-[10px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                              {billingCycle === 'yearly' && <span className="ml-2 text-[8px] text-orange-400 font-black uppercase bg-orange-500/10 px-2 py-0.5 rounded-full">Save 15%</span>}
                           </div>

                           <div className="w-full py-4 rounded-full border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[3px] text-center bg-white/5 cursor-default mb-8">
                              Coming Soon
                           </div>

                           <div className="space-y-4 pt-8 border-t border-white/5">
                              <p className="text-[9px] font-black uppercase tracking-[2px] text-white/20 mb-4">Ultra includes:</p>
                              {[
                                { text: "Master Tape Fidelity", included: true },
                                { text: "Neural Sync Architecture", included: true },
                                { text: "Infinite Synthesis", included: true },
                                { text: "Studio-Grade Master", included: true },
                                { text: "Direct Uplink Node", included: true },
                                { text: "Custom Enterprise", included: true }
                              ].map((feat, i) => (
                                 <div key={i} className={`flex items-center gap-3 ${feat.included ? 'opacity-100' : 'opacity-20'}`}>
                                    {feat.included ? <div className="w-3 h-3 rounded-full bg-orange-500/20 flex items-center justify-center text-[8px] text-orange-400">✓</div> : <div className="text-[10px]">✕</div>}
                                    <span className="text-white/60 text-[9px] font-bold uppercase tracking-[1px]">{feat.text}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </motion.div>
                  </div>

                  {/* Tailored Synthesis Banner */}
                  <div className="p-6 sm:p-10 rounded-[1.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 group hover:border-primary/40 transition-all duration-500">
                     <div>
                        <span className="text-primary text-[9px] font-black uppercase tracking-[4px] mb-2 block opacity-60">Custom Architecture</span>
                        <h4 className="text-2xl sm:text-3xl font-bold text-[#E1E0CC] mb-3 md:mb-4 tracking-tighter">Tailored Synthesis</h4>
                        <p className="text-white/40 text-xs font-medium max-w-xl">If you require custom network parameters, dedicated uplink infrastructure, or specific studio-grade synthesis nodes, our architects can build a bespoke package for your creative hub.</p>
                     </div>
                     <button className="w-full lg:w-auto px-8 py-4 sm:px-10 sm:py-5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-[4px] hover:scale-105 transition-all shadow-xl shadow-primary/10 whitespace-nowrap text-center cursor-none">
                        Customize Node
                     </button>
                  </div>
               </div>
            </section>



            {/* PAGE 5: GET STARTED (SYSTEM GATEWAY) */}
            <section id="get-started" className="w-full md:w-screen min-h-full md:h-screen flex-shrink-0 snap-start md:snap-center bg-black flex flex-col items-center justify-center p-4 sm:p-10 py-20 relative overflow-hidden">
               {/* Portal Background */}
               <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[800px] sm:h-[800px] bg-primary/5 blur-[100px] sm:blur-[150px] rounded-full animate-pulse" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-primary/10 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] border border-primary/5 rounded-full" />
               </div>

               <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-4">
                  <motion.div
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ duration: 1.5, ease: "circOut" }}
                     className="mb-8 md:mb-12 relative w-full"
                  >
                     <span className="text-primary text-[10px] font-black uppercase tracking-[8px] md:tracking-[10px] mb-6 md:mb-8 block opacity-40">Final Synthesis</span>
                     <h2 className="text-[6rem] sm:text-[10rem] md:text-[18rem] font-bold tracking-tighter leading-none text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">V</h2>
                     <h2 className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-[#E1E0CC] relative">
                        Initialize<br />
                        <span className="font-serif italic text-primary/80">Synthesis.</span>
                     </h2>
                  </motion.div>

                  <p className="text-white/40 text-xs sm:text-sm font-medium leading-relaxed max-w-xs sm:max-w-md uppercase tracking-[3px] sm:tracking-[4px] mb-12 md:mb-16">
                     Your node is ready for deployment. Connect to the global synergy protocol.
                  </p>

                  <motion.button 
                     onClick={() => setShowAuth(true)}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="group relative bg-primary text-black px-12 py-5 sm:px-16 sm:py-7 rounded-full font-black text-xs uppercase tracking-[4px] sm:tracking-[6px] shadow-[0_20px_50px_rgba(222,219,200,0.15)] overflow-hidden cursor-none"
                  >
                     <span className="relative z-10">Initialize Node</span>
                     <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </motion.button>

                  <div className="mt-20 md:mt-32 flex flex-col items-center gap-6">
                     <div className="flex items-center gap-6 sm:gap-10 opacity-20">
                        <span className="text-[9px] font-black uppercase tracking-[3px] sm:tracking-[4px] hover:text-white transition-all cursor-pointer">Protocol</span>
                        <span className="text-[9px] font-black uppercase tracking-[3px] sm:tracking-[4px] hover:text-white transition-all cursor-pointer">Network</span>
                        <span className="text-[9px] font-black uppercase tracking-[3px] sm:tracking-[4px] hover:text-white transition-all cursor-pointer">Archive</span>
                     </div>
                     <div className="h-[1px] w-20 bg-white/10" />
                     <p className="text-[7px] sm:text-[8px] font-black uppercase tracking-[4px] sm:tracking-[6px] text-white/10">© 2026 Vinl Creative Hub. Global Nodes Active.</p>
                  </div>
               </div>
            </section>

          </div>
        </>
      )}

      {/* ── CUSTOM SCROLLBAR HIDER ── */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

    </div>
  );
}

function MobileLandingLayout({ billingCycle, setBillingCycle, setShowAuth }) {
  const [showPreloader, setShowPreloader] = useState(true);
  const [isPreloaderOpening, setIsPreloaderOpening] = useState(false);

  const handlePreloaderComplete = () => {
    setIsPreloaderOpening(true);
  };

  const handleAnimationComplete = () => {
    setShowPreloader(false);
  };

  return (
    <div className={`w-full h-full overflow-x-hidden bg-[#030303] text-[#E1E0CC] no-scrollbar scroll-smooth font-['Almarai'] pb-20 ${showPreloader ? 'h-screen overflow-hidden' : 'overflow-y-auto'}`}>
      
      {showPreloader && (
        <MobilePreloader 
          isOpening={isPreloaderOpening} 
          onComplete={handlePreloaderComplete}
          onAnimationComplete={handleAnimationComplete} 
        />
      )}
      
      {/* ── STICKY GLASSMorphic HEADER ── */}
      <header className="sticky top-0 z-[1000] bg-[#030303]/70 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black italic tracking-tighter leading-none text-white">Vinl.</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          </div>
          <span className="text-[7px] font-black uppercase tracking-[2px] text-primary/60 mt-1">Synergy Protocol Active</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden xs:flex flex-col items-end font-mono text-[7px] text-white/30 tracking-wider">
            <span>UPLINK: ACTIVE</span>
            <span>NODES: 4,921</span>
          </div>
          <button 
            onClick={() => setShowAuth(true)}
            className="px-5 py-2 rounded-full bg-primary text-black text-[9px] font-black uppercase tracking-[2px] transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/10 border border-primary/20"
          >
            Enter
          </button>
        </div>
      </header>

      {/* ── MOBILE HERO & TACTILE VINYL CONTROLLER ── */}
      <section className="px-4 py-4 w-full">
        <div className="relative w-full rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/5 p-6 flex flex-col items-center text-center overflow-hidden">
          {/* Neon mesh backing */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          
          <span className="text-primary text-[8px] font-black uppercase tracking-[6px] opacity-60 mb-2">Creative Music Sync</span>
          
          <h1 className="text-[14vw] font-black tracking-[-0.06em] leading-[0.85] py-2 text-white">
            Vinl<span className="text-primary">*</span>
          </h1>
          
          <p className="text-[#DEDBC8]/60 text-[10px] uppercase tracking-[4px] leading-relaxed max-w-xs mt-2 mb-4">
            Synchronized. Lossless. Immersive. <br />The ultimate sonic experience.
          </p>

          {/* Realistic Interactive Rotating Vinyl Component */}
          <InteractiveVinyl />

          <div className="w-full flex flex-col gap-2 mt-4">
            <button 
              onClick={() => setShowAuth(true)}
              className="w-full py-4 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-[3px] shadow-lg shadow-primary/5 transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Initialize Node</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            
            <p className="text-[7px] font-mono text-white/20 uppercase tracking-widest mt-1">
              Tap the vinyl record above to start/stop playback simulation
            </p>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE VISIONARY (ABOUT) ── */}
      <section className="px-4 py-4 w-full">
        <InteractiveVisionarySection />
      </section>

      {/* ── INTERACTIVE SYSTEM NODE SPECIFICATION (FEATURES) ── */}
      <section className="px-4 py-6 w-full relative">
        <div className="mb-6">
          <span className="text-primary text-[8px] font-black uppercase tracking-[4px] opacity-50 block mb-1">Feature Architecture</span>
          <h2 className="text-3xl font-bold tracking-tighter text-[#E1E0CC] leading-[0.9]">
            The Core <span className="font-serif italic text-primary/80">Ecosystem.</span>
          </h2>
          <p className="text-white/40 text-[9px] font-medium leading-relaxed max-w-xs uppercase tracking-wider mt-1.5">
            Engineered for precision. Tap tabs to inspect sub-specifications.
          </p>
        </div>

        {/* Tab feature browser */}
        <InteractiveFeatureBrowser />
      </section>

      {/* ── SYNERGY PRICING ACCESS ── */}
      <section className="px-4 py-6 w-full">
        <div className="flex flex-col gap-4 mb-8">
           <div>
              <span className="text-primary text-[8px] font-black uppercase tracking-[4px] opacity-50 block mb-1">System Access</span>
              <h2 className="text-3xl font-bold tracking-tighter text-[#E1E0CC]">Creative <span className="font-serif italic text-primary/80">Access.</span></h2>
           </div>
           
           {/* Capsule Toggle Switch */}
           <div className="bg-white/5 p-1 rounded-full border border-white/5 flex items-center gap-1 self-start relative">
              <button 
                 onClick={() => setBillingCycle('monthly')}
                 className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                   billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/40'
                 }`}
              >
                 Monthly
              </button>
              <button 
                 onClick={() => setBillingCycle('yearly')}
                 className={`px-5 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                   billingCycle === 'yearly' ? 'bg-white text-black' : 'text-white/40'
                 }`}
              >
                 Yearly
              </button>
           </div>
        </div>

        <div className="flex flex-col gap-6">
           {/* FREE NODE */}
           <div className="relative p-6 rounded-[2rem] bg-[#0A0A0A] border border-white/5 overflow-hidden flex flex-col gap-5 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 blur-2xl opacity-40" />
              <div className="relative z-10 flex flex-col gap-4">
                 <div>
                    <span className="text-cyan-400 text-[8px] font-black uppercase tracking-[3px] block mb-1.5 font-mono">Baseline Node</span>
                    <h3 className="text-3xl font-black text-[#E1E0CC] tracking-tight">Free</h3>
                    <div className="flex items-baseline gap-1 mt-1">
                       <span className="text-3xl font-bold text-[#E1E0CC]">£00</span>
                       <span className="text-[8px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                    </div>
                 </div>

                 <button onClick={() => setShowAuth(true)} className="w-full py-3.5 rounded-full border border-white/10 text-white text-[9px] font-black uppercase tracking-[2px] hover:bg-white hover:text-black transition-all font-bold">
                    Initialize Free
                 </button>

                 <div className="space-y-3 pt-5 border-t border-white/5">
                    {[
                      { text: "Standard Fidelity Audio", included: true },
                      { text: "Single Social Sync", included: true },
                      { text: "Basic Library Node", included: true },
                      { text: "Community Access", included: true }
                    ].map((feat, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-green-500/20 flex items-center justify-center text-[7px] text-green-500">✓</div>
                          <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.5px]">{feat.text}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* PRO NODE */}
           <div className="relative p-6 rounded-[2rem] bg-white/[0.01] border-2 border-blue-500/30 overflow-hidden flex flex-col gap-5 shadow-[0_20px_50px_rgba(59,130,246,0.05)]">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600/20 to-indigo-600/5 blur-2xl opacity-60" />
              <div className="relative z-10 flex flex-col gap-4">
                 <div className="flex justify-between items-start">
                    <div>
                       <span className="text-blue-400 text-[8px] font-black uppercase tracking-[3px] block mb-1.5 font-mono">Standard Node</span>
                       <h3 className="text-3xl font-black text-[#E1E0CC] tracking-tight">Pro</h3>
                       <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-bold text-[#E1E0CC]">{billingCycle === 'monthly' ? '£9.99' : '£99.99'}</span>
                          <span className="text-[8px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                       </div>
                    </div>
                    {billingCycle === 'yearly' && <span className="text-[7px] text-blue-400 font-black uppercase bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">Save 15%</span>}
                 </div>

                 <button onClick={() => setShowAuth(true)} className="w-full py-4 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-[2px] shadow-lg shadow-blue-600/20 transition-all font-bold font-sans">
                    Initialize Pro Node
                 </button>

                 <div className="space-y-3 pt-5 border-t border-white/5">
                    {[
                      { text: "High Fidelity Lossless", included: true },
                      { text: "Infinite Social Sync", included: true },
                      { text: "Studio Sync™ Plus", included: true },
                      { text: "AI Discovery Master", included: true },
                      { text: "Priority Uplink Node", included: true }
                    ].map((feat, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-blue-500/20 flex items-center justify-center text-[7px] text-blue-400">✓</div>
                          <span className="text-white/80 text-[9px] font-bold uppercase tracking-[0.5px]">{feat.text}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* ULTRA NODE */}
           <div className="relative p-6 rounded-[2rem] bg-[#0A0A0A] border border-white/5 overflow-hidden flex flex-col gap-5 shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-orange-500/10 to-red-500/5 blur-2xl opacity-40" />
              <div className="relative z-10 flex flex-col gap-4">
                 <div>
                    <span className="text-orange-400 text-[8px] font-black uppercase tracking-[3px] block mb-1.5 font-mono">Master Node</span>
                    <div className="h-8 flex items-center mb-1.5 font-sans">
                      <svg viewBox="0 0 160 50" className="w-20 h-auto overflow-visible">
                         <text 
                            x="0" 
                            y="35" 
                            fill="#FFE24B" 
                            className="font-normal"
                            style={{ 
                              fontFamily: "'Playwrite US Trad', cursive",
                              fontSize: "36px",
                              filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.3))",
                              transform: "skewX(-15deg)" 
                            }}
                         >
                            ultra
                         </text>
                      </svg>
                    </div>
                    <div className="flex items-baseline gap-1">
                       <span className="text-3xl font-bold text-[#E1E0CC]">{billingCycle === 'monthly' ? '£19.99' : '£199.99'}</span>
                       <span className="text-[8px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                    </div>
                 </div>

                 <div className="w-full py-3.5 rounded-full border border-white/10 text-white/40 text-[9px] font-black uppercase tracking-[2px] text-center bg-white/5 font-bold">
                    Coming Soon
                 </div>

                 <div className="space-y-3 pt-5 border-t border-white/5">
                    {[
                      { text: "Master Tape Fidelity", included: true },
                      { text: "Neural Sync Architecture", included: true },
                      { text: "Infinite Synthesis", included: true },
                      { text: "Studio-Grade Master", included: true },
                      { text: "Direct Uplink Node", included: true }
                    ].map((feat, i) => (
                       <div key={i} className="flex items-center gap-3">
                          <div className="w-3.5 h-3.5 rounded-full bg-orange-500/20 flex items-center justify-center text-[7px] text-orange-400">✓</div>
                          <span className="text-white/60 text-[9px] font-bold uppercase tracking-[0.5px]">{feat.text}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ── STUNNING DEPLOYMENT MODULE (GET STARTED TERMINAL) ── */}
      <section className="px-4 py-8 w-full text-center relative overflow-hidden flex flex-col items-center">
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-primary/5 blur-[85px] rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] border border-primary/10 rounded-full" />
         </div>

         <div className="relative z-10 space-y-8 max-w-sm flex flex-col items-center w-full">
            <div className="relative w-full">
               <span className="text-primary text-[9px] font-black uppercase tracking-[6px] opacity-50 block mb-4 font-mono">Final Handshake</span>
               <h2 className="text-[10rem] font-bold text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">V</h2>
               <h2 className="text-4xl font-bold tracking-tighter text-[#E1E0CC] relative">
                  Initialize<br />
                  <span className="font-serif italic text-primary/80">Synthesis.</span>
               </h2>
            </div>

            {/* Simulated Live Core Terminal Compilation */}
            <InteractiveTerminal onTrigger={() => setShowAuth(true)} />

            <button 
               onClick={() => setShowAuth(true)}
               className="bg-primary text-black px-12 py-4 rounded-full font-black text-[10px] uppercase tracking-[3px] shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95"
            >
               Deploy Gateway
            </button>

            <div className="pt-12 flex flex-col items-center gap-4 w-full">
               <div className="flex items-center gap-6 opacity-30 text-[8px] font-black uppercase tracking-[3px]">
                  <span>Protocol</span>
                  <span>Network</span>
                  <span>Archive</span>
               </div>
               <div className="h-[1px] w-12 bg-white/10" />
               <p className="text-[7px] font-black uppercase tracking-[2px] text-white/15 font-sans">© 2026 Vinl Creative Hub. Global Nodes Active.</p>
            </div>
         </div>
      </section>

    </div>
  );
}

// ── CUSTOM INLINE AWARDS-WORTHY HELPERS ──

function InteractiveVinyl() {
  const [isPlaying, setIsPlaying] = useState(true);
  
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-6" onClick={() => setIsPlaying(!isPlaying)}>
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse bg-gradient-to-r from-primary/5 to-transparent blur-sm" />
      
      <motion.div
        animate={isPlaying ? { rotate: 360 } : {}}
        transition={isPlaying ? { repeat: Infinity, duration: 8, ease: "linear" } : {}}
        className="w-44 h-44 rounded-full bg-[#0d0d0d] shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] border-4 border-[#1c1c1c] flex items-center justify-center relative cursor-pointer"
      >
        <div className="absolute inset-2 rounded-full border border-black/60 opacity-80" />
        <div className="absolute inset-4 rounded-full border border-black/60 opacity-70" />
        <div className="absolute inset-8 rounded-full border border-[#1a1a1a] opacity-90" />
        <div className="absolute inset-12 rounded-full border border-black/80" />
        <div className="absolute inset-16 rounded-full border border-[#222] opacity-50" />
        
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 pointer-events-none rounded-full" />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -rotate-45 pointer-events-none rounded-full" />
        
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] relative">
          <div className="w-4 h-4 rounded-full bg-[#0a0a0a] border border-primary" />
          <span className="absolute text-[8px] font-black text-black uppercase tracking-[1px] bottom-1.5 font-mono">VINL</span>
        </div>
      </motion.div>
      
      <motion.div
        animate={isPlaying ? { rotate: [15, 17, 15] } : { rotate: -15 }}
        transition={isPlaying ? { repeat: Infinity, duration: 4, ease: "easeInOut" } : { duration: 0.5 }}
        style={{ transformOrigin: "top right" }}
        className="absolute top-0 right-4 w-16 h-24 pointer-events-none z-20"
      >
        <svg viewBox="0 0 100 150" className="w-full h-full text-white/40 drop-shadow-md">
          <path d="M 90,10 Q 50,50 40,110" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <rect x="28" y="105" width="24" height="12" rx="3" fill="#FFE24B" transform="rotate(-15 40 110)" />
          <circle cx="90" cy="10" r="10" fill="#222" stroke="currentColor" strokeWidth="2" />
        </svg>
      </motion.div>

      <AnimatePresence>
        {isPlaying && (
          <>
            <motion.span
              initial={{ opacity: 0, y: 40, x: -25, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -40, x: -50, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0 }}
              className="absolute left-6 text-primary/40 text-xs pointer-events-none"
            >
              ♫
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, x: 25, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -50, x: 45, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.2 }}
              className="absolute right-6 text-primary/30 text-xs pointer-events-none"
            >
              ♬
            </motion.span>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function InteractiveVisionarySection() {
  const [revealed, setRevealed] = useState(false);

  return (
    <div 
      className="relative w-full rounded-[2rem] bg-[#0A0A0A] border border-white/5 overflow-hidden p-7 flex flex-col gap-5 shadow-2xl cursor-pointer"
      onClick={() => setRevealed(!revealed)}
    >
      <div className="absolute inset-0 bg-[#00ffcc]/[0.02] pointer-events-none" />
      
      <div className="flex justify-between items-start">
        <div>
          <span className="text-primary text-[8px] font-black uppercase tracking-[4px] opacity-40 block mb-1">The Visionary</span>
          <h2 className="text-2xl font-bold tracking-tighter text-[#E1E0CC]">
            Abhijeet <span className="font-serif italic text-primary/80">Panda</span>
          </h2>
        </div>
        <motion.div
          animate={revealed ? { rotate: 45 } : { rotate: 0 }}
          className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10"
        >
          <span className="text-primary text-[11px] font-black">+</span>
        </motion.div>
      </div>

      <p className="text-[#E1E0CC] text-xs font-bold tracking-tight leading-[1.4] italic pl-3 border-l-2 border-primary/40">
        "This began as a college project, but it was always the dream. I wanted to bridge the gap between the soul of vinyl and the power of AI music."
      </p>

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="text-[#DEDBC8]/40 text-[11px] font-medium leading-relaxed mb-4 mt-2 font-sans">
              I've always wanted to build a <span className="text-primary italic font-serif font-serif">vinyl music player</span>, but never could until now. As someone who loves making <span className="text-primary italic font-serif">AI music</span>, I wanted a unique, immersive space to experience it. Vinl. is the result of that obsession—a high-fidelity synchronization of past and future soundscapes.
            </p>
            <div className="h-10 border-t border-white/5 pt-3 flex justify-between items-center">
              <span className="font-mono text-[7px] text-white/20 uppercase tracking-widest">Handshake Verified</span>
              <span className="font-serif italic text-[11px] text-primary/60 tracking-wider">A. Panda</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && (
        <span className="text-[7px] font-black uppercase tracking-widest text-primary/40 animate-pulse mt-1 block">
          Tap to expand visionary details
        </span>
      )}
    </div>
  );
}

function InteractiveFeatureBrowser() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    { 
       id: "01", 
       title: "Neural Acoustics", 
       tag: "Studio Master",
       desc: "Experience 32-bit studio-master fidelity with zero-latency neural reconstruction protocols.",
       metric: "32-bit / 192kHz",
       status: "99.98% Fidelity"
    },
    { 
       id: "02", 
       title: "Quantum Synergy", 
       tag: "Social Protocol",
       desc: "Real-time synchronization engine ensuring perfectly aligned listening nodes across the global network.",
       metric: "12ms Latency Sync",
       status: "Global Relays Active"
    },
    { 
       id: "03", 
       title: "Edge Architecture", 
       tag: "Persistence Node",
       desc: "High-performance edge-caching architecture ensuring library persistence even in zero-uplink zones.",
       metric: "Offline Decoupling",
       status: "Local Cache Ready"
    }
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {features.map((feat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveFeature(idx)}
            className={`px-4 py-2 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
              activeFeature === idx 
                ? 'bg-primary border-primary text-black' 
                : 'bg-white/5 border-white/5 text-white/50 hover:text-white'
            }`}
          >
            {feat.title}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFeature}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="relative p-6 rounded-3xl bg-[#090909] border border-white/5 flex flex-col justify-between overflow-hidden shadow-2xl min-h-[180px]"
        >
          <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <span className="text-[9px] font-black text-primary/30 font-mono">Node {features[activeFeature].id}</span>
              <h4 className="text-lg font-bold text-[#E1E0CC] tracking-tight mt-1">{features[activeFeature].title}</h4>
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-primary/20 text-primary bg-primary/5">
              {features[activeFeature].tag}
            </span>
          </div>

          <p className="relative z-10 text-white/40 text-xs leading-relaxed mb-6 font-medium font-sans">
            {features[activeFeature].desc}
          </p>

          <div className="relative z-10 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
            <div>
              <span className="text-[7px] font-black uppercase tracking-widest text-white/25 block">Core Spec</span>
              <span className="text-[10px] font-black text-white/70 tracking-wider mt-1 block uppercase">{features[activeFeature].metric}</span>
            </div>
            <div>
              <span className="text-[7px] font-black uppercase tracking-widest text-white/25 block">Protocol Status</span>
              <span className="text-[10px] font-black text-green-400 tracking-wider mt-1 block uppercase">{features[activeFeature].status}</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function InteractiveTerminal({ onTrigger }) {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("idle");

  const fullLogs = [
    "Establishing handshake with synergy network...",
    "Local Node IP: 127.0.0.1 (DEV_MODE)",
    "Syncing lossless audio pipelines...",
    "Configuring 32-bit neural reconstructor...",
    "Nodes connected: 4,921 active users",
    "Ping latency: 12ms",
    "Creative Synthesis Gateway READY."
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullLogs.length) {
        const nextLog = fullLogs[index];
        setLogs(prev => [...prev, nextLog]);
        index++;
      } else {
        setStatus("ready");
        clearInterval(interval);
      }
    }, 700);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#050505] border border-white/5 rounded-2xl p-4 font-mono text-[9px] text-left space-y-1.5 shadow-inner">
      <div className="flex items-center gap-1.5 border-b border-white/5 pb-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-red-500/60" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
        <div className="w-2 h-2 rounded-full bg-green-500/60" />
        <span className="text-white/30 text-[8px] ml-2 tracking-wider">VINL SYSTEM CORE</span>
      </div>
      
      <div className="h-28 overflow-y-auto space-y-1 no-scrollbar scroll-smooth">
        {logs.map((log, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className={log && log.includes("READY") ? "text-primary font-bold animate-pulse" : "text-white/50"}
          >
            <span className="text-primary/40 mr-1">&gt;</span> {log}
          </motion.p>
        ))}
      </div>

      <div className="pt-2 border-t border-white/5 mt-2 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
          <span className="text-[8px] text-white/30 uppercase tracking-widest">{status === 'ready' ? 'System Active' : 'Compiling Nodes'}</span>
        </div>
        
        {status === 'ready' && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onTrigger}
            className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-colors"
          >
            Deploy Node
          </motion.button>
        )}
      </div>
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

function MobilePreloader({ isOpening, onComplete, onAnimationComplete }) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("INITIALIZING NODE");

  useEffect(() => {
    const duration = 2200; // 2.2 seconds loading
    const interval = 20;
    const steps = duration / interval;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      const currentPercent = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setPercent(currentPercent);
      
      if (currentPercent >= 100) {
        setPhase("HANDSHAKE ACTIVE");
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 300);
      } else {
        if (currentPercent > 70) {
          setPhase("SYNCHRONIZING GLOBAL NODES");
        } else if (currentPercent > 35) {
          setPhase("DECODING STUDIO MASTER");
        }
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[5000] flex flex-col justify-between overflow-hidden bg-transparent">
      {/* Top Curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={isOpening ? { y: "-100%" } : { y: 0 }}
        transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
        onAnimationComplete={() => {
          if (isOpening) onAnimationComplete();
        }}
        className="w-full h-1/2 bg-[#050505] border-b border-primary/10 relative flex flex-col justify-end"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
        
        {/* Split Typography Top Half */}
        <div className="w-full h-[50px] overflow-hidden flex items-end justify-center select-none translate-y-[2px]">
          <h1 className="text-[72px] font-black italic tracking-tighter text-white leading-none translate-y-[36px]">
            VINL.
          </h1>
        </div>
      </motion.div>

      {/* Bottom Curtain */}
      <motion.div
        initial={{ y: 0 }}
        animate={isOpening ? { y: "100%" } : { y: 0 }}
        transition={{ duration: 1.2, ease: [0.85, 0, 0.15, 1] }}
        className="w-full h-1/2 bg-[#050505] border-t border-primary/10 relative flex flex-col justify-start"
      >
        <div className="absolute inset-0 bg-noise opacity-[0.02] pointer-events-none" />
        
        {/* Split Typography Bottom Half */}
        <div className="w-full h-[50px] overflow-hidden flex items-start justify-center select-none -translate-y-[2px]">
          <h1 className="text-[72px] font-black italic tracking-tighter text-white leading-none -translate-y-[36px]">
            VINL.
          </h1>
        </div>

        {/* System Info & Percentage Indicator */}
        <div className="mt-12 flex flex-col items-center gap-2 font-mono text-[9px] tracking-[2px] w-full text-center px-6">
          <span className="text-primary/70 uppercase animate-pulse">{phase}</span>
          <span className="text-white/40 font-bold text-lg mt-1">
            {percent.toString().padStart(3, '0')}%
          </span>
        </div>
      </motion.div>
      
      {/* Floating Center Badge that splits */}
      <AnimatePresence>
        {!isOpening && (
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#030303] border border-white/10 flex items-center justify-center z-20 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
