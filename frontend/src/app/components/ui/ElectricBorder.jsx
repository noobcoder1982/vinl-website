import React, { useState } from "react";
import { motion } from "motion/react";

/**
 * ElectricBorder - A high-fidelity wrapper component that provides 
 * a dynamic, chaotic 'electric' glowing border.
 * 
 * @param {React.ReactNode} children - The content to wrap
 * @param {string} color - Base glow color (primary by default)
 * @param {number} speed - Animation speed in seconds (default 4)
 * @param {number} intensity - Glow blur intensity (default 10)
 * @param {number} thickness - Border thickness (default 2)
 * @param {number} chaos - Turbulence distortion scale (default 5)
 * @param {string} className - Additional classes for the outer wrapper
 */
export const ElectricBorder = ({ 
  children, 
  color = "var(--primary)", 
  speed = 4, 
  intensity = 15, 
  thickness = 2, 
  chaos = 5,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Generate a unique filter ID to avoid collisions
  const filterId = React.useId().replace(/:/g, "");

  return (
    <div 
      className={`relative group/electric ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ── SVG TURBULENCE FILTER (Optimized) ── */}
      <svg className="absolute w-0 h-0 invisible">
        <defs>
          <filter id={`electric-glow-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
               type="fractalNoise" 
               baseFrequency="0.015 0.04" 
               numOctaves="1" 
               result="noise"
            />
            <feDisplacementMap 
               in="SourceGraphic" 
               in2="noise" 
               scale={isHovered ? chaos * 1.5 : chaos} 
            />
          </filter>
        </defs>
      </svg>

      {/* ── BACKGROUND GLOW SPREAD ── */}
      <div 
        className="absolute -inset-[15px] opacity-0 group-hover/electric:opacity-20 transition-opacity duration-1000 blur-[30px] pointer-events-none will-change-[opacity,filter]"
        style={{ backgroundColor: color }}
      />

      {/* ── ANIMATED ELECTRIC RIM ── */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none will-change-[filter]"
        style={{ 
          filter: `url(#electric-glow-${filterId})`,
          padding: `${thickness}px`
        }}
      >
        <div 
          className="absolute inset-[1px] rounded-[inherit] overflow-hidden"
          style={{ padding: `${thickness}px` }}
        >
          {/* Rotating Conic Gradient */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ 
              duration: isHovered ? speed * 0.6 : speed, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-[-200%] bg-[conic-gradient(from_0deg,transparent_0deg,var(--glow-color)_40deg,transparent_100deg,var(--glow-color)_140deg,transparent_200deg,var(--glow-color)_260deg,transparent_360deg)] will-change-transform"
            style={{ 
               '--glow-color': color,
               filter: `blur(${intensity / 4}px)`
            }}
          />
        </div>

        {/* Outer Soft Glow Layer */}
        <div 
          className="absolute inset-0 rounded-[inherit] opacity-40 transition-all duration-500 will-change-[opacity,box-shadow]"
          style={{ 
             boxShadow: `0 0 ${intensity}px ${color}`,
             border: `${thickness}px solid ${color}`,
             opacity: isHovered ? 0.8 : 0.4
          }}
        />
      </div>

      {/* ── INNER MASK & CONTENT ── */}
      <div className="relative z-10 w-full h-full rounded-[inherit] overflow-hidden bg-background">
        <motion.div 
          animate={isHovered ? { scale: 1.01 } : { scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full h-full will-change-transform"
        >
          {children}
        </motion.div>
      </div>

      <style>{`
        .group\\/electric {
          border-radius: inherit;
        }
      `}</style>
    </div>
  );
};
