import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Mail, MapPin, Calendar, Edit3, LogOut, Trash2, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { authService } from "../services/authService";
import { CustomDatePicker } from "./CustomDatePicker";

export function ProfileView({ user, onUpdate, onLogout }) {
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

  return (
    <div className="w-full h-full flex flex-col p-[30px] overflow-y-auto no-scrollbar relative">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[5%] left-[5%] w-[300px] h-[300px] bg-violet-900/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-foreground text-5xl font-black tracking-tighter mb-2" style={{ fontFamily: "Outfit, sans-serif" }}>
              My Profile
            </h1>
            <p className="text-foreground/40 font-medium">Manage your personal information and account settings</p>
          </div>
          <button 
            onClick={onLogout}
            className="px-6 py-3 rounded-full bg-card/5 border border-white/10 text-foreground/60 text-sm font-bold flex items-center gap-2 hover:bg-card/10 hover:text-foreground transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Avatar & Summary */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="p-8 rounded-[32px] bg-card/5 border border-white/10 backdrop-blur-xl flex flex-col items-center text-center">
              <div 
                className={`w-36 h-36 rounded-[48px] relative ${!formData.avatarUrl ? 'bg-gradient-to-tr from-indigo-600 to-violet-800' : 'bg-card/5'} flex items-center justify-center border-4 border-white/10 shadow-2xl mb-6 group overflow-hidden transition-all duration-500`}
                onClick={() => isEditing && document.getElementById('avatar-upload').click()}
              >
                {formData.avatarUrl ? (
                  <img src={formData.avatarUrl} alt={user?.username} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <span className="text-foreground text-4xl font-black uppercase tracking-tighter">{user?.username?.charAt(0)}</span>
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                    <div className="flex flex-col items-center gap-2">
                       <Edit3 size={24} className="text-foreground" />
                       <span className="text-[10px] text-foreground font-black uppercase tracking-widest">Upload</span>
                    </div>
                  </div>
                )}
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden" 
                />
              </div>
              <h2 className="text-foreground text-2xl font-bold mb-1 tracking-tight">{user?.username}</h2>
              <p className="text-foreground/40 text-sm mb-6">{user?.email}</p>
              
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-950/20">
                <ShieldCheck size={14} className="fill-current" />
                Verified Synergy
              </div>
            </div>

            <div className="p-6 rounded-[24px] bg-card/5 border border-white/10 backdrop-blur-md">
              <h3 className="text-foreground/40 text-[10px] font-bold uppercase tracking-[2px] mb-4">Privacy Note</h3>
              <p className="text-foreground/60 text-xs leading-relaxed">
                Your profile details (bio, birthday, location) are strictly private and used only to personalize your experience. We never share this data with 3rd parties.
              </p>
            </div>
          </div>

          {/* Right Column: Settings Form */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="p-8 rounded-[32px] bg-card/5 border border-white/10 backdrop-blur-xl shadow-2xl relative z-20">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-foreground text-xl font-bold flex items-center gap-3">
                  <User size={20} className="text-indigo-400" />
                  Personal Details
                </h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`p-3 rounded-2xl transition-all ${isEditing ? 'bg-indigo-500 text-foreground shadow-lg shadow-indigo-500/20' : 'bg-card/5 text-foreground/40 hover:text-foreground hover:bg-card/10 border border-white/10'}`}
                >
                  <Edit3 size={18} />
                </button>
              </div>

              {/* Status Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3 overflow-hidden">
                    <AlertCircle size={18} />
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-6 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-sm flex items-center gap-3 overflow-hidden">
                    <CheckCircle2 size={18} />
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-foreground/40 text-[10px] font-black uppercase tracking-wider ml-1">Username</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full h-12 bg-card/5 border border-white/10 rounded-xl pl-12 pr-4 text-foreground text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-foreground/40 text-[10px] font-black uppercase tracking-wider ml-1">Email</label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="email" 
                        disabled={!isEditing}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 bg-card/5 border border-white/10 rounded-xl pl-12 pr-4 text-foreground text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-foreground/40 text-[10px] font-black uppercase tracking-wider ml-1">Bio (Private)</label>
                  <textarea 
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="w-full h-32 bg-card/5 border border-white/10 rounded-xl p-4 text-foreground text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50 resize-none shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-foreground/40 text-[10px] font-black uppercase tracking-wider ml-1">Location</label>
                    <div className="relative group">
                      <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-indigo-400 transition-colors" />
                      <input 
                        type="text" 
                        disabled={!isEditing}
                        placeholder="e.g. London, UK"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full h-12 bg-card/5 border border-white/10 rounded-xl pl-12 pr-4 text-foreground text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50 shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <CustomDatePicker 
                      label="Birthday"
                      disabled={!isEditing}
                      value={formData.birthday}
                      onChange={(date) => setFormData({...formData, birthday: date})}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-foreground/40 text-[10px] font-black uppercase tracking-wider ml-1">Profile Photo URL (Optional)</label>
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    placeholder="or upload by clicking the avatar above"
                    value={formData.avatarUrl?.startsWith('data:image') ? 'Local File Selected' : formData.avatarUrl}
                    onChange={(e) => setFormData({...formData, avatarUrl: e.target.value})}
                    className="w-full h-12 bg-card/5 border border-white/10 rounded-xl px-4 text-foreground text-sm outline-none focus:border-indigo-500/50 focus:bg-white/[0.08] transition-all disabled:opacity-50"
                  />
                </div>

                {isEditing && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 mt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex-1 h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl text-foreground font-black uppercase tracking-widest text-[12px] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-950/20"
                    >
                      {loading && <Loader2 size={18} className="animate-spin" />}
                      Finalize Update
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="px-8 h-14 bg-card/5 border border-white/10 rounded-2xl text-foreground/60 font-black uppercase tracking-widest text-[12px] hover:bg-card/10 transition-all"
                    >
                      Dismiss
                    </button>
                  </motion.div>
                )}
              </form>
            </div>

            {/* Danger Zone */}
            <div className="p-8 rounded-[32px] bg-red-950/20 border border-red-500/10 backdrop-blur-xl mb-20 shadow-lg relative z-10">
              <h3 className="text-red-500 text-xl font-bold flex items-center gap-3 mb-4 tracking-tight">
                <Trash2 size={20} />
                Erasure Protocol
              </h3>
              <p className="text-foreground/40 text-sm mb-6 leading-relaxed">
                Deleting your account will permanently remove all your data, playlists, and listening history. This action cannot be undone.
              </p>
              
              {!showDeleteConfirm ? (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold hover:bg-red-500 hover:text-foreground transition-all"
                >
                  Delete My Account
                </button>
              ) : (
                <div className="flex flex-col gap-4">
                  <p className="text-red-500 text-xs font-bold uppercase tracking-widest">Are you absolutely sure?</p>
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-red-600 text-foreground text-sm font-bold hover:bg-red-700 transition-all flex items-center gap-2"
                    >
                      {loading && <Loader2 size={16} className="animate-spin" />}
                      Yes, Delete Permanently
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-3 rounded-xl bg-card/5 text-foreground/60 text-sm font-bold hover:bg-card/10 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
