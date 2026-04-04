import { useState, useEffect } from "react";
import { X, Send, Twitter, Link as LinkIcon, UserPlus, UserCheck, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authService } from "../services/authService";

export function InviteModal({ isOpen, onClose, roomCode }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const inviteLink = `${window.location.origin}/?view=blend&room=${roomCode}`;
  const shareText = `Join my Synergy Blend session! Build a live playlist with me: ${inviteLink}`;

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      authService.getUsers().then(res => {
        setUsers(res || []);
        setLoading(false);
      });
    }
  }, [isOpen]);

  const handleShareWA = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const handleShareTW = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredUsers = users.filter(u => u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-[40px] shadow-3xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="p-8 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-white text-2xl font-black tracking-tight">Invite Synergy.</h2>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">Blend Room: {roomCode}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Quick Share Grid */}
            <div className="px-8 py-6 grid grid-cols-3 gap-4 border-b border-white/5">
               <button onClick={handleShareWA} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] group-hover:bg-[#25D366] group-hover:text-white transition-all shadow-lg">
                    <Send size={24} />
                  </div>
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">WhatsApp</span>
               </button>
               <button onClick={handleShareTW} className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-2xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2] group-hover:bg-[#1DA1F2] group-hover:text-white transition-all shadow-lg">
                    <Twitter size={24} />
                  </div>
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Twitter</span>
               </button>
               <button onClick={copyLink} className="flex flex-col items-center gap-2 group">
                  <div className={`w-14 h-14 rounded-2xl ${copied ? 'bg-green-500 text-white' : 'bg-white/5 border border-white/10 text-white/60'} flex items-center justify-center transition-all shadow-lg`}>
                    <LinkIcon size={24} />
                  </div>
                  <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{copied ? 'Copied!' : 'Copy Link'}</span>
               </button>
            </div>

            {/* User Discovery */}
            <div className="flex-1 overflow-hidden flex flex-col p-8 gap-6">
               <div className="relative group">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Discover listeners..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 text-white text-sm outline-none focus:border-indigo-500/50 transition-all"
                  />
               </div>

               <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-20">
                       <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                       <span className="text-[10px] font-black uppercase tracking-widest">Scanning Network...</span>
                    </div>
                  ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
                      <div key={u._id} className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 group hover:bg-white/[0.06] transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-800 flex items-center justify-center shadow-lg overflow-hidden shrink-0">
                           {u.avatarUrl ? <img src={u.avatarUrl} className="w-full h-full object-cover" /> : <span className="text-white font-black text-xs uppercase">{u.username.charAt(0)}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-white font-bold leading-none mb-1">{u.username}</p>
                           <p className="text-white/20 text-[10px] font-black uppercase tracking-widest leading-none">{u.followers?.length || 0} Synergy Units</p>
                        </div>
                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95">
                           Invite
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-20 text-center">
                       <Users size={40} className="mb-4" />
                       <p className="text-xs font-bold uppercase tracking-widest">No Synergy Contacts Found</p>
                    </div>
                  )}
               </div>
            </div>

            {/* Bottom Footer */}
            <div className="p-8 bg-white/[0.02] text-center border-t border-white/5">
                <p className="text-white/20 text-[9px] font-black uppercase tracking-[5px]">Network Privacy Protocol Active</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
