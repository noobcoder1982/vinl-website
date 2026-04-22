import React, { useRef, useEffect, useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Play } from "lucide-react";

// ── CONTEXT ──
const HeroDitheringContext = createContext({});
export const useHeroDithering = () => useContext(HeroDitheringContext);

// ── ICONS ──
export function NextjsIcon({ className }) {
  return (
    <svg viewBox="0 0 128 128" className={className} fill="currentColor">
      <path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm33.3 92.7L60.7 48.4l-5.4 7.2L85 92.7H75.8L46.9 54.3v38.4H37.3V35.3h9.6L77 73.7v-38.4h9.6v57.4h6.7z" />
    </svg>
  );
}
export function AISDKIcon({ className }) { return <Zap className={className} />; }

// ── ROOT ──
export function HeroDitheringRoot({ 
  children, title, subtitle, description, techStack, ctaProps,
  desktopShaderProps = { colorFront: "#00FFCC", scale: 1.0, speed: 0.5 },
  className = ""
}) {
  return (
    <HeroDitheringContext.Provider value={{ title, subtitle, description, techStack, ctaProps, desktopShaderProps }}>
      <section className={`relative w-full min-h-[90vh] flex flex-col justify-center overflow-hidden bg-black py-24 ${className}`}>
        <div className="absolute inset-0 z-[2] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        {children}
      </section>
    </HeroDitheringContext.Provider>
  );
}

export function HeroDitheringContainer({ children, className = "" }) {
  return <div className={`relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center px-6 md:px-12 ${className}`}>{children}</div>;
}

export function HeroDitheringContent({ children, className = "" }) {
  return <div className={`flex flex-col text-center lg:text-left ${className}`}>{children}</div>;
}

export function HeroDitheringHeading({ className = "" }) {
  const { title, subtitle } = useHeroDithering();
  return (
    <div className={`mb-10 ${className}`}>
      {subtitle && <span className="text-primary text-[10px] font-black uppercase tracking-[10px] mb-8 block">{subtitle}</span>}
      <h1 className="text-7xl md:text-[8vw] font-black italic tracking-[-0.08em] uppercase leading-[0.75] text-white">{title}</h1>
    </div>
  );
}

export function HeroDitheringDescription({ className = "" }) {
  const { description } = useHeroDithering();
  return <p className={`max-w-xl text-[18px] md:text-[24px] font-medium text-white/20 uppercase tracking-[4px] mb-16 leading-relaxed mx-auto lg:mx-0 ${className}`}>{description}</p>;
}

export function HeroDitheringActions({ className = "" }) {
  const { ctaProps } = useHeroDithering();
  return (
    <div className={`flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-8 mb-16 ${className}`}>
      <button className="h-24 px-16 rounded-[32px] bg-white text-black text-[16px] font-black uppercase tracking-[4px] hover:scale-105 transition-all shadow-2xl flex items-center gap-4">
        {ctaProps?.label} <ArrowRight size={24} />
      </button>
      <button className="h-24 px-16 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-2xl text-white text-[16px] font-black uppercase tracking-[4px] hover:bg-white/10 transition-all">Docs</button>
    </div>
  );
}

export function HeroDitheringBadges({ className = "" }) {
  const { techStack = [] } = useHeroDithering();
  return (
    <div className={`flex flex-wrap justify-center lg:justify-start gap-6 ${className}`}>
      {techStack.map((tech, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl">
          {tech.icon && <tech.icon className="w-5 h-5 text-white/50" />}
          <span className="text-[11px] font-black uppercase tracking-[3px] text-white/40">{tech.name} <span className="opacity-20">{tech.version}</span></span>
        </div>
      ))}
    </div>
  );
}

// ── OPTIMIZED BLACK HOLE DITHER SHADER ──
export function HeroDitheringVisual({ className = "" }) {
  const canvasRef = useRef(null);
  const { desktopShaderProps } = useHeroDithering();

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vsSource = `attribute vec4 aPos; void main() { gl_Position = aPos; }`;
    const fsSource = `
      precision mediump float;
      uniform float uTime;
      uniform vec2 uRes;
      uniform vec3 uColor;
      uniform float uScale;
      uniform float uSpeed;

      float bayer4x4(vec2 p) {
        vec2 f = floor(mod(p, 4.0));
        float m[16];
        m[0]=0.0; m[1]=8.0; m[2]=2.0; m[3]=10.0;
        m[4]=12.0;m[5]=4.0; m[6]=14.0;m[7]=6.0;
        m[8]=3.0; m[9]=11.0;m[10]=1.0;m[11]=9.0;
        m[12]=15.0;m[13]=7.0;m[14]=13.0;m[15]=5.0;
        int i = int(f.x) + int(f.y)*4;
        if(i==0)return m[0]/16.0; if(i==1)return m[1]/16.0; if(i==2)return m[2]/16.0; if(i==3)return m[3]/16.0;
        if(i==4)return m[4]/16.0; if(i==5)return m[5]/16.0; if(i==6)return m[6]/16.0; if(i==7)return m[7]/16.0;
        if(i==8)return m[8]/16.0; if(i==9)return m[9]/16.0; if(i==10)return m[10]/16.0; if(i==11)return m[11]/16.0;
        return m[12]/16.0;
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
        uv *= uScale;
        float r = length(uv);
        float a = atan(uv.y, uv.x);
        
        // ── BLACK HOLE VORTEX LOGIC ──
        float swirl = a + (3.0 / (r + 0.15)) - (uTime * uSpeed * 4.0);
        float v = sin(12.0 * swirl + log(r + 0.05) * 8.0);
        v = (v + 1.0) * 0.5;
        
        // Dark Event Horizon
        float core = smoothstep(0.2, 0.4, r);
        v *= core;

        // Dithering (Coarse 2px steps for performance)
        float threshold = bayer4x4(gl_FragCoord.xy / 2.0);
        float final = step(threshold, v * (1.2 - r));
        
        gl_FragColor = vec4(uColor * final, 1.0);
      }
    `;

    const program = gl.createProgram();
    const compile = (s, t) => { const sh = gl.createShader(t); gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    gl.attachShader(program, compile(vsSource, gl.VERTEX_SHADER));
    gl.attachShader(program, compile(fsSource, gl.FRAGMENT_SHADER));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "uTime");
    const uRes = gl.getUniformLocation(program, "uRes");
    const uCol = gl.getUniformLocation(program, "uColor");
    const uScl = gl.getUniformLocation(program, "uScale");
    const uSpd = gl.getUniformLocation(program, "uSpeed");

    const rgb = (h) => [parseInt(h.slice(1,3),16)/255, parseInt(h.slice(3,5),16)/255, parseInt(h.slice(5,7),16)/255];

    const render = (t) => {
      // ── LOW POLY OPTIMIZATION: Render at 0.5x resolution and scale up ──
      const scale = 0.5; 
      canvas.width = canvas.clientWidth * scale;
      canvas.height = canvas.clientHeight * scale;
      gl.viewport(0, 0, canvas.width, canvas.height);
      
      gl.uniform1f(uTime, t * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform3fv(uCol, rgb(desktopShaderProps.colorFront || "#00FFCC"));
      gl.uniform1f(uScl, desktopShaderProps.scale || 1.0);
      gl.uniform1f(uSpd, desktopShaderProps.speed || 0.5);
      
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }, [desktopShaderProps]);

  return (
    <div className={`relative aspect-square w-full rounded-full overflow-hidden border border-white/5 bg-black shadow-[0_0_80px_rgba(0,0,0,1)] ${className}`}>
      {/* image-rendering: pixelated ensures the 0.5x scale looks crunchy and low-poly, not blurry */}
      <canvas ref={canvasRef} className="w-full h-full block" style={{ imageRendering: 'pixelated' }} />
      <div className="absolute inset-0 pointer-events-none rounded-full border-[16px] border-black/60 shadow-inner" />
    </div>
  );
}

export function HeroDitheringMobileVisual() { return null; }
export function HeroDithering() { return <HeroDitheringRoot />; }
