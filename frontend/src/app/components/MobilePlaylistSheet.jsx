import { motion, AnimatePresence } from "motion/react";
import { X, Play, Plus, GripVertical, Sparkles, Music2 } from "lucide-react";
import { useState } from "react";

export function MobilePlaylistSheet({ isOpen, onClose, queue, onSongSelect, songs }) {
  const [recommendations] = useState(songs.slice(0, 10));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[250]"
          />
          
          {/* Sheet */}
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#111] rounded-t-[48px] border-t border-white/10 z-[300] flex flex-col overflow-hidden shadow-3xl select-none"
          >
            {/* Header / Grab Handle */}
            <div className="flex flex-col items-center pt-3 pb-6 flex-none">
               <div className="w-12 h-1.5 bg-white/10 rounded-full mb-6" />
               <div className="w-full flex items-center justify-between px-8">
                  <div className="flex flex-col">
                     <h3 className="text-white text-2xl font-black italic tracking-tighter">Current Sync Queue</h3>
                     <p className="text-white/20 text-[10px] font-black uppercase tracking-[4px] mt-1">{queue.length} Tracks Loaded</p>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                     <X size={20} />
                  </button>
               </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-6 flex flex-col gap-10 pb-20">
               
               {/* ACTIVE QUEUE */}
               <div className="flex flex-col gap-4">
                  {queue.length === 0 ? (
                     <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[40px] gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                           <Music2 size={32} className="text-white/10" />
                        </div>
                        <p className="text-white/20 text-xs font-black uppercase tracking-widest">Queue is currently air</p>
                     </div>
                  ) : (
                     queue.map((s, i) => (
                        <motion.div 
                           key={s.id + i}
                           initial={{ x: -20, opacity: 0 }}
                           animate={{ x: 0, opacity: 1 }}
                           transition={{ delay: i * 0.05 }}
                           className="flex items-center gap-4 p-4 rounded-[28px] bg-white/[0.03] border border-white/5 group active:bg-white/10 transition-all"
                        >
                           <GripVertical size={18} className="text-white/10 cursor-grab" />
                           <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                              <img src={s.imageUrl} className="w-full h-full object-cover" />
                           </div>
                           <div className="flex-1 truncate">
                              <h4 className="text-white font-black text-lg truncate uppercase tracking-tighter italic leading-tight">{s.title}</h4>
                              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{s.artist}</p>
                           </div>
                           <button onClick={() => onSongSelect(s)} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center shadow-xl active:scale-90 transition-all">
                              <Play size={16} className="fill-current ml-0.5" />
                           </button>
                        </motion.div>
                     ))
                  )}
               </div>

               {/* RECOMMENDATIONS - THE FEED */}
               <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4 px-2">
                     <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <Sparkles size={18} className="text-indigo-400" />
                     </div>
                     <div>
                        <h4 className="text-white font-black uppercase tracking-[2px] leading-none">Synergy Discovery</h4>
                        <p className="text-white/20 text-[9px] font-black uppercase tracking-widest mt-1">Matched Tracks from the Network</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                     {recommendations.map((s, i) => (
                        <button 
                           key={s.id}
                           onClick={() => onSongSelect(s)}
                           className="flex items-center gap-4 p-4 rounded-[28px] border border-white/[0.05] hover:bg-white/5 transition-all group group-active:scale-95"
                        >
                           <img src={s.imageUrl} className="w-14 h-14 rounded-2xl object-cover shadow-lg border border-white/10" />
                           <div className="flex-1 truncate text-left">
                              <p className="text-white text-base font-black truncate uppercase tracking-tight">{s.title}</p>
                              <p className="text-white/30 text-[9px] font-bold uppercase tracking-widest">{s.artist}</p>
                           </div>
                           <Plus size={20} className="text-white/20 group-active:text-white transition-colors" />
                        </button>
                     ))}
                  </div>
               </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
