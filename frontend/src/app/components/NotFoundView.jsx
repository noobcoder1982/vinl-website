import { motion } from "motion/react";
import { Disc, AlertTriangle, ChevronLeft, RefreshCcw, Home } from "lucide-react";

export function NotFoundView({ onBack, onHome }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative font-['Outfit'] select-none px-6">
      
      {/* Immersive Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative z-10 flex flex-col items-center gap-8 text-center"
      >
        {/* glitched vinyl disc icon */}
        <div className="relative group">
            <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 0.5, repeat: Infinity, ease: "linear", repeatDelay: 4 }}
               className="w-32 h-32 rounded-full border-4 border-red-500/30 flex items-center justify-center relative overflow-hidden bg-black shadow-2xl"
            >
               <Disc size={64} className="text-red-500 opacity-60 animate-pulse" />
               <div className="absolute inset-0 bg-gradient-to-tr from-black/60 to-transparent" />
               
               {/* "Disconnection" crack line */}
               <div className="absolute top-0 left-1/2 w-[2px] h-full bg-red-500/40 rotate-12 -translate-x-1/2" />
            </motion.div>
            
            <div className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-red-500 text-black flex items-center justify-center shadow-lg border-2 border-black rotate-12">
               <AlertTriangle size={24} />
            </div>
        </div>

        <div className="flex flex-col gap-2 max-w-[400px]">
            <span className="text-red-500 text-[10px] font-black uppercase tracking-[8px] animate-pulse">Error 404 • Signal Lost</span>
            <h1 className="text-white text-[56px] font-black tracking-tighter leading-none mb-4">You're in the Static.</h1>
            <p className="text-white/40 text-[15px] font-medium leading-relaxed uppercase tracking-widest px-4">
                The wavelength you're looking for was skipped. The needle hit a void.
            </p>
        </div>

        <div className="flex items-center gap-4 mt-8">
            <button 
                onClick={onBack}
                className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-bold hover:text-white hover:bg-white/10 transition-all active:scale-95"
            >
                <ChevronLeft size={20} />
                <span>Go Back</span>
            </button>
            
            <button 
                onClick={onHome}
                className="flex items-center gap-3 px-8 py-3 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
            >
                <Home size={20} />
                <span>Return Base</span>
            </button>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-12 left-12 flex flex-col gap-1 opacity-20">
         <div className="w-12 h-[1px] bg-red-500" />
         <div className="w-8 h-[1px] bg-red-500" />
      </div>

    </div>
  );
}
