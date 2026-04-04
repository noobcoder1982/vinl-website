import { useState, useEffect } from "react";
import { Mail, Check, X, Users, Clock, ArrowRight, ArrowUpRight, CheckCircle2, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { inviteService } from "../services/inviteService";

export function InboxView({ onJoinRoom, onBack }) {
  const [activeTab, setActiveTab] = useState("received"); // "received" | "sent"
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [actionType, setActionType] = useState(null); // "accept" | "decline"
  const [showToast, setShowToast] = useState(null);

  useEffect(() => {
    loadInvites();
  }, [activeTab]);

  const loadInvites = async () => {
    setLoading(true);
    let data = [];
    if (activeTab === "received") {
      data = await inviteService.getMyInvites();
    } else {
      data = await inviteService.getSentInvites();
    }
    setInvites(data);
    setLoading(false);
  };

  const handleAction = async (invite, type) => {
    setActioningId(invite._id);
    setActionType(type);

    // Wait for animation to start
    setTimeout(async () => {
      const status = type === "accept" ? "accepted" : "declined";
      await inviteService.updateInviteStatus(invite._id, status);
      
      if (invite.type === 'follow' && status === 'accepted') {
         setShowToast(`Accepted follow from @${invite.fromUser?.username}`);
         setTimeout(() => setShowToast(null), 3000);
      }
      
      if (invite.type !== 'follow' && status === 'accepted') {
         onJoinRoom(invite.roomCode);
      }

      // Remove from list after animation delay
      setInvites(prev => prev.filter(i => i._id !== invite._id));
      setActioningId(null);
      setActionType(null);
    }, 600);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 md:p-10 pb-[140px] md:pb-10 overflow-y-auto no-scrollbar bg-[#020204] relative">
      <div className="max-w-2xl mx-auto w-full flex flex-col gap-8">
        <header className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
                  <Mail size={20} className="text-indigo-400" />
               </div>
               <h1 className="text-white text-4xl font-black tracking-tighter">Your Mailbox.</h1>
            </div>
          </div>

          <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
            <button 
               onClick={() => setActiveTab("received")}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "received" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
            >
               Received
            </button>
            <button 
               onClick={() => setActiveTab("sent")}
               className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "sent" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"}`}
            >
               Requests Sent
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
               <div className="w-12 h-12 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
               <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">Syncing Records...</p>
            </div>
          ) : invites.length === 0 ? (
            <div className="py-20 rounded-[40px] border-2 border-dashed border-white/5 flex flex-col items-center gap-4 text-center">
               <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-2">
                  {activeTab === "received" ? <Mail size={32} /> : <ArrowUpRight size={32} />}
               </div>
               <h3 className="text-white/40 font-black text-xl">{activeTab === "received" ? "Inbox is Empty" : "No Sent Requests"}</h3>
               <p className="text-white/20 text-xs max-w-xs">{activeTab === "received" ? "When your teammates invite you, they will appear here." : "Start a Blend or Follow someone to see requests here."}</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {invites.map((invite) => (
                <motion.div
                  key={invite._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    x: actioningId === invite._id ? (actionType === "accept" ? -100 : 100) : 0,
                    boxShadow: actioningId === invite._id ? (actionType === "accept" ? "0 0 40px rgba(34, 197, 94, 0.2)" : "0 0 40px rgba(239, 68, 68, 0.2)") : "none",
                    borderColor: actioningId === invite._id ? (actionType === "accept" ? "rgba(34, 197, 94, 0.5)" : "rgba(239, 68, 68, 0.5)") : "rgba(255, 255, 255, 0.1)"
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: actionType === "accept" ? -500 : 500,
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
                  }}
                  className="group p-6 rounded-[32px] bg-white/[0.03] border border-white/10 transition-all flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
                >
                  <div className={`w-16 h-16 rounded-2xl overflow-hidden shadow-xl border border-white/10 relative flex-none ${invite.type === 'follow' ? 'bg-purple-500/20' : 'bg-indigo-500/20'}`}>
                     {(invite.received ? invite.fromUser : invite.toUser)?.profilePicture ? (
                        <img src={(invite.received ? invite.fromUser : invite.toUser).profilePicture} className="w-full h-full object-cover" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40 font-black text-2xl">
                           {(invite.received ? invite.fromUser : invite.toUser)?.username?.charAt(0).toUpperCase()}
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                     <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#111]" />
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 flex items-center justify-center md:justify-start gap-2">
                        {invite.type === 'follow' ? <UserPlus size={12} /> : <Users size={12} />}
                        {invite.type === 'follow' ? 'FOLLOW REQUEST' : 'SYNERGY BLEND'}
                     </p>
                     <h3 className="text-white text-lg font-bold">
                        {invite.received ? 'From' : 'To'} <span className="text-indigo-400">@{(invite.received ? invite.fromUser : invite.toUser)?.username}</span>
                     </h3>
                     <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
                        <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                           <Clock size={12} /> {new Date(invite.createdAt).toLocaleDateString()}
                        </span>
                        {invite.roomCode && (
                          <span className="text-white/10 text-[10px] uppercase font-black tracking-widest">• ROOM: {invite.roomCode}</span>
                        )}
                     </div>
                  </div>

                  {invite.received ? (
                    <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                      <button 
                          onClick={() => handleAction(invite, "accept")}
                          className="flex-1 md:flex-none px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-400 transition-colors active:scale-95"
                      >
                          {invite.type === 'follow' ? 'Accept Follow' : 'Join Room'}
                      </button>
                      <button 
                          onClick={() => handleAction(invite, "decline")}
                          className="w-12 h-12 bg-white/5 text-white/30 rounded-2xl flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 transition-all active:scale-95"
                      >
                          <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="px-6 py-3 rounded-2xl border border-white/5 bg-white/[0.02] text-[10px] font-black text-white/20 uppercase tracking-widest">
                       {invite.status === 'pending' ? 'Pending Action' : 'Completed'}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 px-8 py-4 bg-green-500 text-white rounded-[24px] shadow-2xl flex items-center gap-4 z-[999]"
          >
             <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <CheckCircle2 size={20} />
             </div>
             <p className="font-black text-sm uppercase tracking-widest">{showToast}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
