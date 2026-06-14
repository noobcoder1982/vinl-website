import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Mail, MapPin, Calendar, Edit3, LogOut, Trash2, 
  ShieldCheck, CheckCircle2, AlertCircle, Loader2, 
  ChevronLeft, Camera, Sparkles, Disc, Heart, ListMusic, 
  Settings, ShieldAlert, BadgeInfo 
} from "lucide-react";
import { authService } from "../services/authService";
import { CustomDatePicker } from "./CustomDatePicker";

export function ProfileView({ 
  user, 
  onUpdate, 
  onLogout, 
  onNavChange, 
  likedCount = 0, 
  playlistsCount = 0 
}) {
  const [activeTab, setActiveTab] = useState("details"); // "details", "stats", "security"
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    bio: user?.bio || "",
    location: user?.location || "",
    birthday: user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : "",
    avatarUrl: user?.avatarUrl || ""
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await authService.updateProfile(formData);
    if (result.success) {
      setSuccess("Profile updated successfully!");
      onUpdate(result.user);
      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    const result = await authService.deleteAccount();
    if (result.success) {
      onLogout();
    } else {
      setError(result.message);
      setShowDeleteConfirm(false);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size too large (max 2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Fallback Dicebear avatar URL matching MobileHomeView
  const getAvatarSource = () => {
    if (formData.avatarUrl) return formData.avatarUrl;
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${user?.username || 'Guest'}`;
  };

  // Estimate synergy level based on activities
  const getSynergyRank = () => {
    const totalScore = likedCount * 3 + playlistsCount * 5 + (formData.bio ? 2 : 0);
    if (totalScore >= 30) return "Master Selector";
    if (totalScore >= 15) return "Vibe Curator";
    if (totalScore >= 5) return "Groove Builder";
    return "Synergy Initiate";
  };

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-y-auto no-scrollbar pb-32 relative select-none">
      
      {/* Immersive Ambient Glow Background */}
      <div className="absolute top-0 left-0 w-full h-[350px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none -z-10" />
      <div className="absolute top-[-5%] right-[-10%] w-[100%] h-[30vh] bg-[#981D26]/10 blur-[130px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-[20%] left-[-15%] w-[80%] h-[25vh] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-[150] h-16 flex items-center justify-between px-6 bg-background/60 backdrop-blur-2xl border-b border-white/[0.04]">
        <button 
          onClick={() => onNavChange ? onNavChange("home") : null}
          className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </button>
        <h2 className="text-foreground text-sm font-black uppercase tracking-[4px]">Profile Hub</h2>
        <button 
          onClick={onLogout}
          className="w-10 h-10 rounded-full bg-red-500/5 border border-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/10 active:scale-95 transition-all"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </header>

      <div className="w-full max-w-lg mx-auto px-6 pt-6 flex flex-col gap-6">
        
        {/* Profile Card with Skeuomorphic Grooved Vinyl Avatar */}
        <div className="relative p-6 rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-3xl flex flex-col items-center text-center overflow-hidden shadow-2xl">
          {/* Radial flare overlay */}
          <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] to-transparent pointer-events-none" />
          
          {/* Grooved Vinyl Record Rotating Container */}
          <div className="relative w-40 h-40 mb-4 group cursor-pointer">
            {/* Spinning background vinyl grooves */}
            <div 
              className="absolute inset-0 rounded-full border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.8)] animate-spin-slow"
              style={{
                background: "repeating-radial-gradient(circle, #08080c 0px, #08080c 2px, #16161c 3px, #08080c 5px)",
                animationDuration: '20s'
              }}
            >
              {/* Shiny reflection mask on vinyl */}
              <div 
                className="absolute inset-0 rounded-full opacity-35"
                style={{
                  background: "conic-gradient(from 0deg, transparent 0, #333 45deg, transparent 90deg, #333 135deg, transparent 180deg, #333 225deg, transparent 270deg, #333 315deg, transparent 360deg)"
                }}
              />
            </div>

            {/* User Avatar - centered inside record label */}
            <div 
              onClick={() => isEditing && document.getElementById('avatar-upload-mobile').click()}
              className="absolute inset-[26%] rounded-full overflow-hidden border-4 border-[#08080c] shadow-inner bg-gradient-to-tr from-indigo-950 to-purple-950 flex items-center justify-center group-hover:scale-105 transition-transform duration-500 relative z-10"
            >
              <img 
                src={getAvatarSource()} 
                alt={user?.username} 
                className="w-[110%] h-[110%] object-cover group-hover:brightness-75 transition-all duration-300" 
              />
              
              {isEditing && (
                <div className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={16} className="text-white animate-bounce-slow" />
                  <span className="text-[7px] text-white font-black uppercase tracking-[2px]">Edit</span>
                </div>
              )}
            </div>

            {/* Tiny gold badge icon for verified synergy */}
            <div className="absolute bottom-1 right-2 z-20 w-8 h-8 rounded-full bg-amber-500 border-2 border-[#08080c] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
              <ShieldCheck size={16} className="text-black fill-current" />
            </div>

            <input 
              id="avatar-upload-mobile"
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>

          {/* User Meta Data */}
          <h2 className="text-foreground text-3xl font-black tracking-[-1.5px] uppercase mt-2 mb-1 flex items-center gap-2">
            {user?.username}
          </h2>
          <p className="text-foreground/40 text-[10px] tracking-[2px] font-bold uppercase mb-4">{user?.email}</p>

          <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase tracking-widest shadow-md">
            <Sparkles size={11} className="fill-current" />
            {getSynergyRank()}
          </div>
        </div>

        {/* Dynamic User Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center text-center shadow-sm">
            <Heart size={16} className="text-rose-500 mb-1 animate-pulse" />
            <span className="text-foreground text-lg font-black tracking-tight">{likedCount}</span>
            <span className="text-foreground/30 text-[8px] font-bold uppercase tracking-[2px]">Favorites</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center text-center shadow-sm">
            <ListMusic size={16} className="text-indigo-400 mb-1" />
            <span className="text-foreground text-lg font-black tracking-tight">{playlistsCount}</span>
            <span className="text-foreground/30 text-[8px] font-bold uppercase tracking-[2px]">Vaults</span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center text-center shadow-sm">
            <Disc size={16} className="text-cyan-400 mb-1 animate-spin-slow" />
            <span className="text-foreground text-lg font-black tracking-tight">Level {Math.max(1, Math.floor((likedCount + playlistsCount) / 3))}</span>
            <span className="text-foreground/30 text-[8px] font-bold uppercase tracking-[2px]">Resonance</span>
          </div>
        </div>

        {/* Tab Navigator */}
        <div className="relative p-1 rounded-2xl bg-white/[0.02] border border-white/5 flex w-full relative overflow-hidden z-20">
          {[
            { id: "details", label: "Details", icon: <User size={13} /> },
            { id: "stats", label: "Vault Info", icon: <BadgeInfo size={13} /> },
            { id: "security", label: "Security", icon: <Settings size={13} /> }
          ].map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsEditing(false);
                }}
                className={`relative flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-300 z-10
                  ${isTabActive ? 'text-black' : 'text-foreground/40 hover:text-foreground'}`}
              >
                {isTabActive && (
                  <motion.div 
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-white rounded-xl -z-10 shadow-lg shadow-black/20"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center gap-2.5 overflow-hidden"
            >
              <AlertCircle size={16} />
              <span className="font-bold uppercase tracking-wide">{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-xs flex items-center gap-2.5 overflow-hidden"
            >
              <CheckCircle2 size={16} />
              <span className="font-bold uppercase tracking-wide">{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Tabs Container */}
        <div className="w-full relative min-h-[300px]">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: Profile Details */}
            {activeTab === "details" && (
              <motion.div
                key="tab-details"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                {/* Form header toggles */}
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-foreground/40 text-[9px] font-black uppercase tracking-[3px]">Details Profile Summary</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-all
                      ${isEditing 
                        ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20 scale-102' 
                        : 'bg-white/[0.04] border border-white/10 text-foreground/60 hover:text-foreground hover:bg-white/[0.08]'
                      }`}
                  >
                    <Edit3 size={11} />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </button>
                </div>

                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                  {/* Username Field */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <label className="text-foreground/30 text-[8px] font-black uppercase tracking-[2px]">Username</label>
                    <div className="relative flex items-center">
                      <User size={14} className="absolute left-0 text-white/20" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full bg-transparent pl-6 text-sm font-bold text-foreground outline-none border-b border-transparent focus:border-white/25 disabled:opacity-75 transition-all"
                      />
                    </div>
                  </div>

                  {/* Location Field */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <label className="text-foreground/30 text-[8px] font-black uppercase tracking-[2px]">Location</label>
                    <div className="relative flex items-center">
                      <MapPin size={14} className="absolute left-0 text-white/20" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        placeholder={isEditing ? "e.g. London, UK" : "Earth"}
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-transparent pl-6 text-sm font-bold text-foreground outline-none border-b border-transparent focus:border-white/25 disabled:opacity-75 transition-all"
                      />
                    </div>
                  </div>

                  {/* Custom Date Picker (Birthday) */}
                  <div className="p-1 rounded-2xl bg-white/[0.01] border border-white/5">
                    <CustomDatePicker 
                      label="Birthday"
                      disabled={!isEditing}
                      value={formData.birthday}
                      onChange={(date) => setFormData({...formData, birthday: date})}
                    />
                  </div>

                  {/* Bio Field */}
                  <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                    <label className="text-foreground/30 text-[8px] font-black uppercase tracking-[2px]">Bio Description</label>
                    <textarea 
                      disabled={!isEditing}
                      placeholder={isEditing ? "Add your story..." : "No bio details yet."}
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      className="w-full bg-transparent text-sm font-bold text-foreground outline-none resize-none h-20 disabled:opacity-75 transition-all scrollbar-none"
                    />
                  </div>

                  {/* Avatar URL text field (only shown in editing mode) */}
                  {isEditing && (
                    <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                      <label className="text-foreground/30 text-[8px] font-black uppercase tracking-[2px]">Profile Photo URL (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="Paste image link or upload by tapping vinyl center"
                        value={formData.avatarUrl?.startsWith('data:image') ? 'Uploaded Local File' : formData.avatarUrl}
                        onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                        className="w-full bg-transparent text-xs font-bold text-foreground/80 outline-none"
                      />
                    </div>
                  )}

                  {/* Submit Update */}
                  {isEditing && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 mt-2">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex-1 h-12 rounded-2xl bg-white text-black font-black uppercase tracking-wider text-[11px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl"
                      >
                        {loading && <Loader2 size={14} className="animate-spin" />}
                        Save Changes
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setFormData({
                            username: user?.username || "",
                            email: user?.email || "",
                            bio: user?.bio || "",
                            location: user?.location || "",
                            birthday: user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : "",
                            avatarUrl: user?.avatarUrl || ""
                          });
                          setIsEditing(false);
                        }}
                        className="px-6 h-12 bg-white/[0.04] border border-white/10 rounded-2xl text-foreground font-black uppercase tracking-wider text-[11px] active:scale-95 transition-all"
                      >
                        Dismiss
                      </button>
                    </motion.div>
                  )}
                </form>
              </motion.div>
            )}

            {/* TAB 2: Vault Statistics Details */}
            {activeTab === "stats" && (
              <motion.div
                key="tab-stats"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-foreground/40 text-[9px] font-black uppercase tracking-[3px] px-1">Vault Recap</h3>
                
                {/* Vault details list */}
                <div className="flex flex-col gap-3">
                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center">
                        <Heart size={15} className="text-rose-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-black uppercase tracking-wide">Favorite Anthems</span>
                        <span className="text-foreground/40 text-[9px] font-bold uppercase tracking-wider">Liked tracks in storage</span>
                      </div>
                    </div>
                    <span className="text-foreground text-sm font-black font-mono">{likedCount} Tracks</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                        <ListMusic size={15} className="text-indigo-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-black uppercase tracking-wide">Custom Grooves</span>
                        <span className="text-foreground/40 text-[9px] font-bold uppercase tracking-wider">Playlists constructed</span>
                      </div>
                    </div>
                    <span className="text-foreground text-sm font-black font-mono">{playlistsCount} Vaults</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        <Disc size={15} className="text-cyan-400" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-black uppercase tracking-wide">Verification Synergy</span>
                        <span className="text-foreground/40 text-[9px] font-bold uppercase tracking-wider">Account synchronization status</span>
                      </div>
                    </div>
                    <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest">Active Synergy</span>
                  </div>
                </div>

                {/* Privacy Card */}
                <div className="p-5 rounded-3xl bg-white/[0.01] border border-white/5 backdrop-blur-md mt-2 flex flex-col gap-2">
                  <h4 className="text-foreground/45 text-[9px] font-black uppercase tracking-[2px] flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Security & Data Integrity
                  </h4>
                  <p className="text-foreground/45 text-[10px] uppercase tracking-wide leading-relaxed">
                    All listening records, custom vaults, bio notes, and birthdays are processed directly inside your local environment and synced over secured channels. We do not distribute your data.
                  </p>
                </div>
              </motion.div>
            )}

            {/* TAB 3: Security & Deletion */}
            {activeTab === "security" && (
              <motion.div
                key="tab-security"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-4"
              >
                <h3 className="text-foreground/40 text-[9px] font-black uppercase tracking-[3px] px-1">Security Settings</h3>

                {/* Email Display (Read only / Managed) */}
                <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-white/[0.01] border border-white/5">
                  <label className="text-foreground/30 text-[8px] font-black uppercase tracking-[2px]">Authorized Email</label>
                  <div className="flex items-center gap-2">
                    <Mail size={13} className="text-white/20" />
                    <span className="text-sm font-bold text-foreground/80">{user?.email}</span>
                  </div>
                </div>

                {/* Danger Zone Card */}
                <div className="p-6 rounded-3xl bg-red-950/15 border border-red-500/10 flex flex-col gap-4 shadow-lg">
                  <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert size={18} className="animate-pulse" />
                    <h4 className="text-sm font-black uppercase tracking-wider">Erasure Protocol</h4>
                  </div>
                  <p className="text-foreground/40 text-[10px] uppercase tracking-wide leading-relaxed">
                    Account purging is immediate and permanent. It deletes your personal details, custom playlists, and favorite anthems permanently.
                  </p>

                  {!showDeleteConfirm ? (
                    <button 
                      onClick={() => setShowDeleteConfirm(true)}
                      className="w-full py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all duration-300"
                    >
                      Initialize Account Purge
                    </button>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="flex flex-col gap-3 pt-2"
                    >
                      <span className="text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                        Confirm Permanent Erasure?
                      </span>
                      <div className="flex gap-3">
                        <button 
                          onClick={handleDeleteAccount}
                          disabled={loading}
                          className="flex-1 py-3 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                          {loading && <Loader2 size={12} className="animate-spin" />}
                          Confirm Purge
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-6 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-foreground/60 text-[10px] font-black uppercase tracking-widest hover:bg-white/[0.08] transition-all"
                        >
                          Abort
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
