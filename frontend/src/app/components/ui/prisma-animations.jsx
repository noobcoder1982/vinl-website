import React, { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

/**
 * WordsBlurReveal: Reveals words with a blur + fade + slide effect.
 */
export function WordsBlurReveal({ text, className = "", delayOffset = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");
  
  return (
    <motion.div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
          animate={isInView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ 
            duration: 1, 
            delay: delayOffset + (i * 0.06), 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}

/**
 * WordsPullUp: Splits text by spaces, each word slides up from y:20 to 0.
 */
export function WordsPullUp({ text, className = "", showAsterisk = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const words = text.split(" ");
  
  return (
    <motion.div ref={ref} className={`flex flex-wrap ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="relative overflow-hidden mr-[0.25em] inline-flex py-2">
          <motion.span
            initial={{ y: "100%" }}
            animate={isInView ? { y: 0 } : { y: "100%" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {word}
            {showAsterisk && i === words.length - 1 && (
              <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em] font-normal leading-none">*</span>
            )}
          </motion.span>
        </span>
      ))}
    </motion.div>
  );
}

/**
 * WordsPullUpMultiStyle: Takes an array of segments {text, className}.
 */
export function WordsPullUpMultiStyle({ segments, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Pre-process all segments into individual words with their respective classes
  const allWords = segments.flatMap(segment => 
    segment.text.split(" ").map(word => ({ text: word, className: segment.className }))
  );

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`}>
      {allWords.map((wordObj, i) => (
        <span key={i} className="relative overflow-hidden mr-[0.25em] inline-flex py-2">
          <motion.span
            initial={{ y: "100%", opacity: 0, filter: "blur(5px)" }}
            animate={isInView ? { y: 0, opacity: 1, filter: "blur(0px)" } : {}}
            transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={`inline-block ${wordObj.className || ""}`}
          >
            {wordObj.text}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

/**
 * AnimatedLetter: Individual character reveal based on scroll position.
 */
export function AnimatedLetter({ character, index, totalChars, scrollYProgress }) {
  const charProgress = index / totalChars;
  const start = charProgress - 0.1;
  const end = charProgress + 0.05;
  
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {character === " " ? "\u00A0" : character}
    </motion.span>
  );
}

/**
 * ScrollRevealText: Wrapper for the character-based scroll reveal.
 */
export function ScrollRevealText({ text, className = "" }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.2"]
  });

  const chars = text.split("");

  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => (
        <AnimatedLetter 
          key={i} 
          character={char} 
          index={i} 
          totalChars={chars.length} 
          scrollYProgress={scrollYProgress} 
        />
      ))}
    </p>
  );
}
