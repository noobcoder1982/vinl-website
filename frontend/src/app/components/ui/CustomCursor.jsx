import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkVisibility = () => {
      const isTouchDevice = 
        window.matchMedia("(pointer: coarse)").matches || 
        ('ontouchstart' in window) || 
        navigator.maxTouchPoints > 0;
      const isMobileViewport = window.innerWidth < 768;
      
      setIsVisible(!isTouchDevice && !isMobileViewport);
    };

    checkVisibility();
    window.addEventListener('resize', checkVisibility);

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleHover = (e) => {
      const target = e.target;
      const isInteractive = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        target.classList.contains('cursor-pointer');
        
      setIsHovered(isInteractive);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('resize', checkVisibility);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      animate={{
        scale: isHovered ? 5 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
    />
  );
};
