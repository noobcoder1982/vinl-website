import React, { useRef, useContext, createContext } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const DockContext = createContext({ mouseX: null });

export function Dock({ children, className = "" }) {
  const mouseX = useMotionValue(Infinity);

  return (
    <DockContext.Provider value={{ mouseX }}>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`flex items-end gap-3 px-6 py-4 rounded-[40px] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${className}`}
      >
        {children}
      </motion.div>
    </DockContext.Provider>
  );
}

export function DockCard({ children, id, className = "" }) {
  const ref = useRef(null);
  const { mouseX } = useContext(DockContext);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [56, 92, 56]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 15 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={`relative flex items-center justify-center aspect-square ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function DockCardInner({ children, id, onClick, className = "" }) {
  return (
    <div 
      onClick={onClick}
      className={`group relative w-full h-full rounded-2xl overflow-visible flex items-center justify-center cursor-pointer transition-all duration-300 ${className}`}
    >
      {/* ── CYBER INDUSTRIAL GLASS BACKGROUND ── */}
      <div className="absolute inset-0 rounded-2xl bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.08] group-hover:border-primary/40 transition-all shadow-inner" />
      
      {/* Icon Content */}
      <div className="relative z-10 flex items-center justify-center text-white/40 group-hover:text-primary transition-colors">
        {children}
      </div>

      {/* Dynamic Primary Glow */}
      <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 rounded-3xl" />
      
      {/* Tooltip (Pro-Max Style) */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg bg-black border border-white/10 text-[9px] font-black uppercase tracking-[2px] text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-none translate-y-2 group-hover:translate-y-0 whitespace-nowrap">
        {id}
      </div>
    </div>
  );
}

export function DockDivider({ className = "" }) {
  return (
    <div className={`w-[1px] h-10 bg-white/10 mx-2 self-center ${className}`} />
  );
}
