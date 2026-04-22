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
  const containerRef = useRef(null);
  const isManualScroll = useRef(false);
  const navItems = ["Home", "About", "Discover", "Pricing", "Get Started"];

  // Horizontal Scroll Observation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isManualScroll.current) return; // Prevent jitter during programmatic scroll
      const scrollLeft = container.scrollLeft;
      const width = container.offsetWidth;
      const index = Math.round(scrollLeft / width);
      const sectionId = navItems[index].toLowerCase().replace(" ", "-");
      if (activeSection !== sectionId) {
        setActiveSection(sectionId);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  const scrollToSection = (id) => {
    const container = containerRef.current;
    if (!container) return;
    const index = navItems.findIndex(item => item.toLowerCase().replace(" ", "-") === id);
    if (index !== -1) {
      isManualScroll.current = true;
      setActiveSection(id);
      
      const targetScroll = index * container.offsetWidth;
      
      // Match the pill physics (Snappy)
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

      {/* ── ERGONOMIC BOTTOM NAVBAR ── */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[2000] flex justify-center">
        <nav className="bg-white/5 backdrop-blur-xl rounded-full px-2 py-2 flex items-center gap-1 border border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const id = item.toLowerCase().replace(" ", "-");
            const isActive = activeSection === id;
            
                return (
                  <button 
                    key={item} 
                    onClick={() => scrollToSection(id)}
                    className={`text-[10px] sm:text-[11px] font-black uppercase tracking-[3px] transition-all duration-300 relative px-6 py-3 rounded-full ${
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

        {/* PAGE 2: ABOUT (THE CREATOR) - HYBRID TYPOGRAPHY */}
        <section id="about" className="w-screen h-screen flex-shrink-0 snap-center bg-black flex items-center justify-center p-10 md:p-20">
           <div className="relative w-full h-full max-w-7xl mx-auto rounded-[4rem] bg-[#0A0A0A] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-12 md:p-32 group">
              <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none" />
              
              <div className="absolute top-12 left-1/2 -translate-x-1/2">
                 <span className="text-primary text-[10px] font-black uppercase tracking-[6px] opacity-40">The Visionary</span>
              </div>

              <div className="text-center relative z-10 max-w-5xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h2 className="text-[8vw] md:text-[6vw] font-bold tracking-tighter leading-none text-[#E1E0CC]">
                    Abhijeet <span className="font-serif italic text-primary/80 ml-2">Panda</span>
                  </h2>
                </motion.div>

                <WordsBlurReveal 
                  text="This began as a college project, but it was always the dream. I wanted to bridge the gap between the soul of vinyl and the power of AI music."
                  className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-[1.2] mb-10 text-center justify-center"
                />

                <div className="max-w-2xl mx-auto">
                  <p className="text-[#DEDBC8]/40 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
                    I've always wanted to build a <span className="text-primary italic font-serif">vinyl music player</span>, but never could until now. As someone who loves making <span className="text-primary italic font-serif">AI music</span>, I wanted a unique, immersive space to experience it. Vinl. is the result of that obsession—a high-fidelity synchronization of past and future soundscapes.
                  </p>
                </div>
              </div>

              <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                 <button onClick={() => scrollToSection("discover")} className="flex flex-col items-center gap-2 text-primary/40 hover:text-primary transition-all group">
                    <span className="uppercase text-[9px] font-black tracking-[4px]">Next Node</span>
                    <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                       <ArrowRight size={16} className="rotate-90" />
                    </motion.div>
                 </button>
              </div>
           </div>
        </section>

        {/* PAGE 3: DISCOVER (FEATURES) */}
        <section id="discover" className="w-screen h-screen flex-shrink-0 snap-center bg-[#050505] flex items-center justify-center p-10">
           {/* Background Mesh Node */}
           <div className="absolute inset-0 opacity-10 pointer-events-none">
              <svg width="100%" height="100%" className="w-full h-full">
                 <pattern id="nodeGrid" width="100" height="100" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" fill="#DEDBC8" />
                 </pattern>
                 <rect width="100%" height="100%" fill="url(#nodeGrid)" />
              </svg>
           </div>

           <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
              {/* Cinematic Anchor (Left) */}
              <div className="lg:col-span-5 space-y-8">
                 <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: "circOut" }}
                 >
                    <span className="text-primary text-[10px] font-black uppercase tracking-[8px] mb-6 block opacity-40">Feature Architecture</span>
                    <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#E1E0CC] leading-[0.85] mb-8">
                       The Core<br />
                       <span className="font-serif italic text-primary/80">Ecosystem.</span>
                    </h2>
                    <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm uppercase tracking-wider">
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
                       className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 cursor-default flex items-center justify-between"
                    >
                       <div className="flex items-center gap-10">
                          <span className="text-4xl font-black text-white/5 group-hover:text-primary/20 transition-colors duration-500">{feature.id}</span>
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <h4 className="text-2xl font-bold text-[#E1E0CC] tracking-tight">{feature.title}</h4>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/10 text-white/40`}>{feature.tag}</span>
                             </div>
                             <p className="text-white/40 text-xs font-medium max-w-md">{feature.desc}</p>
                          </div>
                       </div>
                       
                       <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                       </div>
                    </motion.div>
                 ))}
              </div>
           </div>
        </section>

        {/* PAGE 4: PRICING (NETWORK SYNTHESIS) */}
        <section id="pricing" className="w-screen h-screen flex-shrink-0 snap-center bg-black flex items-center justify-center p-10 md:p-20 overflow-y-auto">
           <div className="max-w-7xl w-full">
              {/* Header & Toggle */}
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                 <div>
                    <span className="text-primary text-[10px] font-black uppercase tracking-[6px] mb-4 opacity-40">System Access</span>
                    <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-[#E1E0CC]">Creative <span className="font-serif italic text-primary/80">Access.</span></h2>
                 </div>
                 
                 <div className="bg-white/5 p-1 rounded-full border border-white/10 flex items-center gap-1 backdrop-blur-xl">
                    <button 
                       onClick={() => setBillingCycle('monthly')}
                       className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${billingCycle === 'monthly' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                    >
                       Monthly
                    </button>
                    <button 
                       onClick={() => setBillingCycle('yearly')}
                       className={`px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${billingCycle === 'yearly' ? 'bg-white text-black' : 'text-white/40 hover:text-white'}`}
                    >
                       Yearly
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {/* FREE NODE */}
                 <motion.div 
                    whileHover={{ y: -10 }}
                    className="group relative p-8 rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 flex flex-col transition-all duration-500 overflow-hidden"
                 >
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-cyan-500/20 to-teal-500/5 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                    <div className="relative z-10">
                       <span className="text-cyan-400 text-[9px] font-black uppercase tracking-[4px] mb-6 block">Baseline</span>
                       <h3 className="text-4xl font-black text-[#E1E0CC] mb-2 tracking-tight">Free</h3>
                       <div className="flex items-baseline gap-1 mb-8">
                          <span className="text-3xl font-bold text-[#E1E0CC]">£00</span>
                          <span className="text-[10px] text-white/20 uppercase tracking-widest">/ {billingCycle === 'monthly' ? 'Month' : 'Year'}</span>
                       </div>

                       <button onClick={() => setShowAuth(true)} className="w-full py-4 rounded-full border border-white/10 text-white text-[9px] font-black uppercase tracking-[3px] hover:bg-white hover:text-black transition-all mb-8">
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
                    className="group relative p-8 rounded-[1.5rem] bg-white/[0.03] border border-blue-500/30 flex flex-col transition-all duration-500 overflow-hidden shadow-[0_30px_60px_rgba(59,130,246,0.1)] scale-105 z-20"
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

                       <button onClick={() => setShowAuth(true)} className="w-full py-4 rounded-full bg-blue-600 text-white text-[9px] font-black uppercase tracking-[3px] shadow-lg shadow-blue-600/20 hover:scale-105 transition-all mb-8">
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
                    className="group relative p-8 rounded-[1.5rem] bg-[#0A0A0A] border border-white/5 flex flex-col transition-all duration-500 overflow-hidden"
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
              <div className="p-10 rounded-[1.5rem] bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 flex flex-col md:flex-row justify-between items-center gap-8 group hover:border-primary/40 transition-all duration-500">
                 <div>
                    <span className="text-primary text-[9px] font-black uppercase tracking-[4px] mb-2 block opacity-60">Custom Architecture</span>
                    <h4 className="text-3xl font-bold text-[#E1E0CC] mb-4 tracking-tighter">Tailored Synthesis</h4>
                    <p className="text-white/40 text-xs font-medium max-w-xl">If you require custom network parameters, dedicated uplink infrastructure, or specific studio-grade synthesis nodes, our architects can build a bespoke package for your creative hub.</p>
                 </div>
                 <button className="px-10 py-5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-[4px] hover:scale-105 transition-all shadow-xl shadow-primary/10 whitespace-nowrap">
                    Customize Node
                 </button>
              </div>
           </div>
        </section>

        {/* PAGE 5: GET STARTED (SYSTEM GATEWAY) */}
        <section id="get-started" className="w-screen h-screen flex-shrink-0 snap-center bg-black flex flex-col items-center justify-center p-10 relative overflow-hidden">
           {/* Portal Background */}
           <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-primary/10 rounded-full" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full" />
           </div>

           <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1.5, ease: "circOut" }}
                 className="mb-12"
              >
                 <span className="text-primary text-[10px] font-black uppercase tracking-[10px] mb-8 block opacity-40">Final Synthesis</span>
                 <h2 className="text-[10rem] md:text-[18rem] font-bold tracking-tighter leading-none text-white/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">V</h2>
                 <h2 className="text-7xl md:text-9xl font-bold tracking-tighter text-[#E1E0CC] relative">
                    Initialize<br />
                    <span className="font-serif italic text-primary/80">Synthesis.</span>
                 </h2>
              </motion.div>

              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-md uppercase tracking-[4px] mb-16">
                 Your node is ready for deployment. Connect to the global synergy protocol.
              </p>

              <motion.button 
                 onClick={() => setShowAuth(true)}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="group relative bg-primary text-black px-16 py-7 rounded-full font-black text-xs uppercase tracking-[6px] shadow-[0_20px_50px_rgba(222,219,200,0.15)] overflow-hidden"
              >
                 <span className="relative z-10">Initialize Node</span>
                 <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </motion.button>

              <div className="mt-32 flex flex-col items-center gap-6">
                 <div className="flex items-center gap-10 opacity-20">
                    <span className="text-[9px] font-black uppercase tracking-[4px] hover:text-white transition-all cursor-pointer">Protocol</span>
                    <span className="text-[9px] font-black uppercase tracking-[4px] hover:text-white transition-all cursor-pointer">Network</span>
                    <span className="text-[9px] font-black uppercase tracking-[4px] hover:text-white transition-all cursor-pointer">Archive</span>
                 </div>
                 <div className="h-[1px] w-20 bg-white/10" />
                 <p className="text-[8px] font-black uppercase tracking-[6px] text-white/10">© 2026 Vinl Creative Hub. Global Nodes Active.</p>
              </div>
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
