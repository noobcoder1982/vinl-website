import { useState, useEffect } from "react";
import { Mail, Check, X, Users, Clock, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { inviteService } from "../services/inviteService";

export function InboxView({ onJoinRoom, onBack }) {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvites();
  }, []);

  const loadInvites = async () => {
    setLoading(true);
    const data = await inviteService.getMyInvites();
    setInvites(data);
    setLoading(false);
  };

  const handleAccept = async (invite) => {
    await inviteService.updateInviteStatus(invite._id, "accepted");
    onJoinRoom(invite.roomCode);
    // Delete the invite locally after joining
    setInvites(prev => prev.filter(i => i._id !== invite._id));
  };

  const handleDecline = async (inviteId) => {
    await inviteService.updateInviteStatus(inviteId, "declined");
    await inviteService.deleteInvite(inviteId);
    setInvites(prev => prev.filter(i => i._id !== inviteId));
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto no-scrollbar bg-[#020204]">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                <Mail size={20} className="text-indigo-400" />
             </div>
             <h1 className="text-white text-4xl font-black tracking-tighter">Your Mailbox.</h1>
          </div>
          <p className="text-white/40 text-sm font-medium uppercase tracking-[3px]">System Messages & Invites</p>
        </header>

        <div className="flex flex-col gap-4 mt-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
               <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Searching records...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="py-20 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-2">
                  <Mail size={32} />
               </div>
               <h3 className="text-white/40 font-black text-xl">Inbox is Empty</h3>
               <p className="text-white/20 text-xs max-w-xs">When your teammates invite you to a Blend room, they will appear here.</p>
            </div>
          ) : (
            <AnimatePresence>
              {invites.map((invite) => (
                <motion.div
                  key={invite._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="group p-6 rounded-[32px] bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] transition-all flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-indigo-500 flex-none shadow-xl border border-white/10 relative">
                     {invite.fromUser?.profilePicture ? (
                        <img src={invite.fromUser.profilePicture} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white font-black text-2xl">
                           {invite.fromUser?.username?.charAt(0).toUpperCase()}
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                        <Users size={12} /> {invite.type === 'blend' ? 'SYNERGY BLEND' : 'LIVE SESSION'}
                     </p>
                     <h3 className="text-white text-lg font-bold">
                        Invite from <span className="text-indigo-400">@{invite.fromUser?.username}</span>
                     </h3>
                     <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                           <Clock size={12} /> JUST NOW
                        </span>
                        <span className="text-white/10 text-[10px] uppercase font-black tracking-widest">• ROOM: {invite.roomCode}</span>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                     <button 
                        onClick={() => handleAccept(invite)}
                        className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-400 transition-colors active:scale-95"
                     >
                        Join Room <ArrowRight size={14} />
                     </button>
                     <button 
                        onClick={() => handleDecline(invite._id)}
                        className="w-12 h-12 bg-white/5 text-white/30 rounded-2xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                     >
                        <X size={20} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
