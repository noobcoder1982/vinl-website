import { useState } from "react";
import { X, Mail, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { authService } from "../services/authService";

export function AuthView({ onAuthSuccess, onBack }) {
  const [tab, setTab] = useState("signup");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let result;
      if (tab === "signup") {
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        result = await authService.signup(fullName || "User", formData.email, formData.password);
      } else {
        result = await authService.login(formData.email, formData.password);
      }

      if (result.success) {
        onAuthSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="w-full h-[100dvh] flex items-center justify-center relative p-0 overflow-y-auto no-scrollbar cursor-none"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://i.pinimg.com/736x/07/50/90/0750901c24da79fd06b0e7e23bf61ff0.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full h-fit md:h-auto md:max-w-[420px] p-[24px] md:p-[40px] md:rounded-[40px] bg-neutral-950/95 flex flex-col gap-[20px] md:gap-[32px] overflow-hidden cursor-none"
      >
        {/* Close button */}
        <button
          onClick={onBack}
          type="button"
          className="absolute top-[20px] right-[20px] md:top-[28px] md:right-[28px] w-[36px] md:w-[32px] h-[36px] md:h-[32px] rounded-full bg-white/10 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all active:scale-90 z-30 cursor-none"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Tab switcher */}
        <div className="flex items-center gap-[4px] bg-white/5 rounded-full p-[4px] self-start border border-white/5 mt-6 md:mt-0">
          <button
            type="button"
            onClick={() => setTab("signup")}
            className={`px-[20px] py-[10px] md:px-[24px] md:py-[10px] rounded-full text-[12px] md:text-[14px] font-black transition-all uppercase tracking-widest cursor-none ${
              tab === "signup"
                ? "bg-white text-black shadow-lg"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Join
          </button>
          <button
            type="button"
            onClick={() => setTab("signin")}
            className={`px-[20px] py-[10px] md:px-[24px] md:py-[10px] rounded-full text-[12px] md:text-[14px] font-black transition-all uppercase tracking-widest cursor-none ${
              tab === "signin"
                ? "bg-white text-black shadow-lg"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            Login
          </button>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
           <span className="text-purple-400 text-[9px] font-black uppercase tracking-[4px] block">Premium Access</span>
           <h1
             className="text-white text-[32px] md:text-[36px] font-black leading-tight tracking-tighter"
             style={{ fontFamily: "Outfit, sans-serif" }}
           >
             {tab === "signup" ? "Create." : "Welcome."}
           </h1>
        </div>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="flex items-center gap-2 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[12px] overflow-hidden"
            >
              <AlertCircle size={14} className="flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-[12px] md:gap-[16px] w-full">
          <motion.div 
            layout 
            className="flex flex-col gap-[12px] md:gap-[16px]"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {tab === "signup" ? (
                <motion.div 
                  key="signup-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-[12px] md:gap-[16px] w-full"
                >
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-[10px] w-full">
                  <input
                    type="text"
                    placeholder="First"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full h-[50px] md:h-[56px] rounded-[14px] md:rounded-[18px] bg-white/[0.08] border border-white/[0.1] text-white text-[14px] md:text-[15px] px-[16px] outline-none placeholder-white/30 focus:border-white/30 transition-all cursor-none"
                  />
                  <input
                    type="text"
                    placeholder="Last"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full h-[50px] md:h-[56px] rounded-[14px] md:rounded-[18px] bg-white/[0.08] border border-white/[0.1] text-white text-[14px] md:text-[15px] px-[16px] outline-none placeholder-white/30 focus:border-white/30 transition-all cursor-none"
                  />
                </div>

                {/* Email */}
                <div className="relative group">
                  <Mail size={16} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/70 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[50px] md:h-[56px] rounded-[14px] md:rounded-[18px] bg-white/[0.08] border border-white/[0.1] text-white text-[14px] md:text-[15px] pl-[48px] pr-[16px] outline-none placeholder-white/30 focus:border-white/30 transition-all cursor-none"
                  />
                </div>
                
                {/* Password */}
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-[50px] md:h-[56px] rounded-[14px] md:rounded-[18px] bg-white/[0.08] border border-white/[0.1] text-white text-[14px] md:text-[15px] px-[16px] outline-none placeholder-white/30 focus:border-white/30 transition-all cursor-none"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="signin-fields"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-[12px] md:gap-[16px] w-full"
              >
                <div className="relative group">
                  <Mail size={16} className="absolute left-[16px] top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/70 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-[50px] md:h-[56px] rounded-[14px] md:rounded-[18px] bg-white/[0.08] border border-white/[0.1] text-white text-[14px] md:text-[15px] pl-[48px] pr-[16px] outline-none placeholder-white/30 focus:border-white/30 transition-all cursor-none"
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-[50px] md:h-[56px] rounded-[14px] md:rounded-[18px] bg-white/[0.08] border border-white/[0.1] text-white text-[14px] md:text-[15px] px-[16px] outline-none placeholder-white/30 focus:border-white/30 transition-all cursor-none"
                />
              </motion.div>
            )}
            </AnimatePresence>
          </motion.div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] md:h-[64px] rounded-[18px] md:rounded-[22px] text-[15px] md:text-[17px] font-black text-black mt-[8px] hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-3 bg-white cursor-none"
            style={{ 
              opacity: loading ? 0.7 : 1 
            }}
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {tab === "signup" ? (loading ? "Joining..." : "Join Now") : (loading ? "Entering..." : "Secure Login")}
          </button>

          {/* FAKE LOGIN / GUEST BYPASS (Only for Local/Dev) */}
          {(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && (
             <button
               type="button"
               onClick={() => onAuthSuccess({ username: "Guest_User", email: "guest@vinl.local", role: "developer" })}
               className="w-full h-[56px] rounded-[18px] border-2 border-primary/20 text-primary text-[12px] font-black uppercase tracking-[4px] hover:bg-primary hover:text-black transition-all mt-4 cursor-none"
             >
                Dev Bypass: Guest Access
             </button>
          )}
        </form>

        {/* Footer */}
        <p className="text-white/20 text-[10px] text-center px-4 leading-[1.6] mb-8 md:mb-0">
          Secure, encrypted, and designed for your privacy.<br/>
          By entering, you agree to our Terms.
        </p>
      </motion.div>
    </div>
  );
}
