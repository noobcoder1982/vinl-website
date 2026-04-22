/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { HomeView } from "./components/HomeView";
import { AuthView } from "./components/AuthView";
import { AlbumsView } from "./components/AlbumsView";
import { ProfileView } from "./components/ProfileView";
import { FullscreenPlayerView } from "./components/FullscreenPlayerView";
import { DiscoverView } from "./components/DiscoverView";
import { RadioView } from "./components/RadioView";
import { AlbumDetailsView } from "./components/AlbumDetailsView";
import { ThemesView } from "./components/ThemesView";
import { PLAYLISTS } from "./data";
import { songService } from "./services/songService";
import { authService } from "./services/authService";
import { inviteService } from "./services/inviteService";
import { AnimatePresence, motion } from "motion/react";
import { Compass, Radio, Disc, Sparkles, LogOut, LogIn, Search } from "lucide-react";
import { FastAverageColor } from "fast-average-color";
import { animate, set } from "animejs";
import { io } from "socket.io-client";
import { MobilePlayerBar, MobileNav } from "./components/MobileUI";
import { MobileCassettePlayer } from "./components/MobileCassettePlayer";
import { MobileReelPlayer, MobileReelBar } from "./components/MobileReelPlayer";
import { MobileHomeView } from "./components/MobileHomeView";
import { MobileStudioSync, MobileStudioBar } from "./components/MobileStudioSync";
import { BlendView } from "./components/BlendView";
import { InboxView } from "./components/InboxView";
import { LikedSongsView } from "./components/LikedSongsView";
import { NotFoundView } from "./components/NotFoundView";
import { LandingView } from "./components/LandingView";
import { CustomCursor } from "./components/ui/CustomCursor";

const getSavedTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  return localStorage.getItem('vinyl-theme') || 'dark';
};

const getSavedAccent = () => {
  if (typeof window === 'undefined') return '#981D26';
  return localStorage.getItem('vinyl-accent') || '#981D26';
};

function GenericView({ title, icon: Icon }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center m-[15px] ml-0 rounded-[16px] border border-white/10 p-[40px] relative overflow-hidden" style={{ background: "linear-gradient(212deg, #1f1f1f 0%, #151515 93%)" }}>
      <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap gap-[20px] p-[20px]">
        {Array.from({ length: 24 }).map((_, i) => ( <div key={i} className="w-[100px] h-[100px] bg-white rounded-[12px]" /> ))}
      </div>
      {Icon && <Icon size={80} className="text-white opacity-20 mb-[24px]" />}
      <h1 className="text-white text-5xl font-bold tracking-tighter mb-[8px]">{title}</h1>
      <p className="text-white/40 text-[18px]">This section is coming soon.</p>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("landing");
  const [activeNav, setActiveNav] = useState("home");
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [blendQueue, setBlendQueue] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(70);
  const [themeColor, setThemeColor] = useState("#1f1f1f");
  const [isDark, setIsDark] = useState(true);
  const [likedSongs, setLikedSongs] = useState([]);
  const [user, setUser] = useState(authService.getCurrentUser());
  const [socket, setSocket] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isRemoteUpdate, setIsRemoteUpdate] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [navHistory, setNavHistory] = useState([]);
  const [navFuture, setNavFuture] = useState([]);
  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 767px)").matches);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // "none", "all", "one"
  const [activeTheme, setActiveTheme] = useState(getSavedTheme);
  const [accentColor, setAccentColor] = useState(getSavedAccent);
  const [inboxCount, setInboxCount] = useState(0);
  const [hasNewPost, setHasNewPost] = useState(false);
  const portalVinylRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    const checkInvites = async () => {
       const invites = await inviteService.getMyInvites();
       if (invites.length > inboxCount) { setHasNewPost(true); setTimeout(() => setHasNewPost(false), 2000); }
       setInboxCount(invites.length);
    };
    checkInvites();
    const interval = setInterval(checkInvites, 10000);
    return () => clearInterval(interval);
  }, [user, inboxCount]);

  const handleAuthSuccess = (userData) => { setUser(userData); setView("home"); setActiveNav("home"); };
  const handleLogout = async () => { await authService.logout(); setUser(null); setView("landing"); setActiveNav("home"); };

  useEffect(() => {
    const loadSongs = async () => {
      const data = await songService.getSongs();
      setSongs(data);
      if (data.length > 0) setCurrentSong(data[0]);
    };
    loadSongs();
  }, []);

  useEffect(() => {
    const root = document.body; root.classList.remove('dark', 'eco', 'neon', 'white', 'brutalist', 'f4');
    root.classList.add(activeTheme); localStorage.setItem('vinyl-theme', activeTheme);
  }, [activeTheme]);

  useEffect(() => { document.documentElement.style.setProperty('--theme-accent', accentColor); localStorage.setItem('vinyl-accent', accentColor); }, [accentColor]);

  useEffect(() => {
    let interval;
    if (isPlaying && currentSong) {
      let showingSong = true;
      interval = setInterval(() => { document.title = showingSong ? `▶ ${currentSong.title} — Vinl.` : "Vinl. — Social Synergy"; showingSong = !showingSong; }, 3000);
    } else { document.title = "Vinl. — Social Synergy"; }
    return () => clearInterval(interval);
  }, [isPlaying, currentSong]);

  useEffect(() => {
    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const apiBase = import.meta.env.VITE_API_URL || (isLocalhost ? "http://localhost:5001" : "https://vinl-website.onrender.com");
    const socketBase = apiBase.replace(/\/api\/?$/, "");
    const newSocket = io(socketBase); setSocket(newSocket);
    newSocket.on('playback-synced', (data) => {
       setIsRemoteUpdate(true);
       if (data.songId && (!currentSong || data.songId !== currentSong.id)) { const song = songs.find(s => s.id === data.songId); if (song) setCurrentSong(song); }
       if (typeof data.isPlaying === 'boolean') setIsPlaying(data.isPlaying);
       if (typeof data.currentTime === 'number' && audioRef.current) { const drift = Math.abs(audioRef.current.currentTime - data.currentTime); if (drift > 0.8) { audioRef.current.currentTime = data.currentTime; setCurrentTime(data.currentTime); } }
       setTimeout(() => setIsRemoteUpdate(false), 200);
    });
    newSocket.on('queue-synced', (newQueue) => { setBlendQueue(newQueue); });
    return () => newSocket.close();
  }, [songs, currentSong]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", update); return () => mq.removeEventListener("change", update);
  }, []);

  const toggleLike = (songId) => { setLikedSongs(prev => prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]); };

  useEffect(() => {
    if (currentSong?.imageUrl) {
      const fac = new FastAverageColor();
      fac.getColorAsync(currentSong.imageUrl)
        .then(color => { 
          setThemeColor(color.hex); setIsDark(color.isDark);
          const root = document.documentElement;
          root.style.setProperty('--dynamic-bg', color.hex);
          root.style.setProperty('--dynamic-fg', color.isDark ? '#ffffff' : '#000000');
          root.style.setProperty('--dynamic-accent', color.isDark ? '#ffffff' : color.hex);
          root.style.setProperty('--dynamic-accent-muted', `${color.hex}40`);
          root.style.setProperty('--dynamic-bg-elevated', color.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');
          root.style.setProperty('--dynamic-border', color.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
        })
        .catch(() => { setThemeColor("#1f1f1f"); setIsDark(true); });
    }
  }, [currentSong]);

  const handleNext = () => {
    if (!songs.length || !currentSong) return;
    let nextSong;
    if (isShuffle) { const otherSongs = songs.filter(s => s.id !== currentSong.id); nextSong = otherSongs.length > 0 ? otherSongs[Math.floor(Math.random() * otherSongs.length)] : songs[0]; }
    else { const idx = songs.findIndex((s) => s.id === currentSong.id); nextSong = songs[(idx + 1) % songs.length]; }
    setCurrentSong(nextSong); setCurrentTime(0); if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handlePrev = () => {
    if (!songs.length || !currentSong) return;
    let prevSong;
    if (isShuffle) { const otherSongs = songs.filter(s => s.id !== currentSong.id); prevSong = otherSongs.length > 0 ? otherSongs[Math.floor(Math.random() * otherSongs.length)] : songs[0]; }
    else { const idx = songs.findIndex((s) => s.id === currentSong.id); prevSong = songs[(idx - 1 + songs.length) % songs.length]; }
    setCurrentSong(prevSong); setCurrentTime(0); if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const handleEnded = () => {
    if (repeatMode === "one") { if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.play(); } }
    else if (repeatMode === "all") { handleNext(); }
    else { const idx = songs.findIndex((s) => s.id === currentSong.id); if (idx < songs.length - 1 || isShuffle) handleNext(); else setIsPlaying(false); }
  };

  useEffect(() => {
    const audio = audioRef.current; if (!audio) return;
    if (isPlaying) { 
        audio.play().catch(e => console.log('Playback error:', e)); 
        if (currentSong && !isAnimating) { songService.recordPlay(currentSong.id, user?._id || user?.id).then(res => { if (res?.data?.isAutoFavorite) setLikedSongs(prev => prev.includes(currentSong.id) ? prev : [...prev, currentSong.id]); }); }
        if ('mediaSession' in navigator && currentSong) {
          navigator.mediaSession.metadata = new MediaMetadata({ title: currentSong.title, artist: currentSong.artist, album: currentSong.album, artwork: [{ src: currentSong.imageUrl, sizes: '512x512', type: 'image/jpeg' }] });
          navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
          navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
          navigator.mediaSession.setActionHandler('previoustrack', handlePrev);
          navigator.mediaSession.setActionHandler('nexttrack', handleNext);
        }
    } else { audio.pause(); }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (!socket || !activeRoom || !isPlaying || isRemoteUpdate) return;
    const interval = setInterval(() => {
      if (audioRef.current) { socket.emit('sync-playback', { roomId: activeRoom, songId: currentSong?.id, isPlaying: true, currentTime: audioRef.current.currentTime, senderId: user?._id || user?.id || socket.id }); }
    }, 3000);
    return () => clearInterval(interval);
  }, [socket, activeRoom, isPlaying, currentSong, isRemoteUpdate]);

  const navigateTo = (nav) => { setNavHistory(prev => [...prev, activeNav]); setNavFuture([]); setActiveNav(nav); setView("home"); setSelectedAlbum(null); };
  const handleNavBack = () => { if (!navHistory.length) return; const prev = navHistory[navHistory.length - 1]; setNavFuture(f => [activeNav, ...f]); setNavHistory(h => h.slice(0, -1)); setActiveNav(prev); setView("home"); setSelectedAlbum(null); };
  const handleNavForward = () => { if (!navFuture.length) return; const next = navFuture[0]; setNavHistory(h => [...h, activeNav]); setNavFuture(f => f.slice(1)); setActiveNav(next); setView("home"); setSelectedAlbum(null); };
  const handleAlbumSelect = (album) => { setSelectedAlbum(album); setView("album-details"); };
  const progress = (currentSong?.duration > 0) ? (currentTime / currentSong.duration) * 100 : 0;
  const handleSongSelect = (song) => { setCurrentSong(song); setIsPlaying(true); setCurrentTime(0); if (audioRef.current) audioRef.current.currentTime = 0; };
  const handleSeek = (time) => { setCurrentTime(time); if (audioRef.current) audioRef.current.currentTime = time; };
  const handlePlaylistSelect = (id) => { setActivePlaylist((prev) => prev === id ? null : id); };
  const displayedSongs = activePlaylist ? songs.filter((s) => PLAYLISTS.find((p) => p.id === activePlaylist)?.songIds.includes(s.id)) : songs;

  const runVinylTransition = (targetView) => {
    if (isAnimating) return;
    const sourceEl = document.getElementById(targetView === "fullscreen" ? "mini-vinyl-source" : "fullscreen-vinyl-target");
    const targetEl = document.getElementById(targetView === "fullscreen" ? "fullscreen-vinyl-target" : "mini-vinyl-source");
    if (!sourceEl || !targetEl || !portalVinylRef.current) { setView(targetView); return; }
    const sourceRect = sourceEl.getBoundingClientRect(); const targetRect = targetEl.getBoundingClientRect();
    setIsAnimating(true); const deltaX = sourceRect.left - targetRect.left; const deltaY = sourceRect.top - targetRect.top; const deltaScale = sourceRect.width / targetRect.width;
    set(portalVinylRef.current, { top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height, translateX: deltaX, translateY: deltaY, scale: deltaScale, rotate: 0, opacity: 1, borderRadius: '50%', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', willChange: 'transform, opacity, box-shadow' });
    animate(portalVinylRef.current, { translateX: 0, translateY: 0, scale: [deltaScale, Math.max(deltaScale, 1) * 1.6, 1], rotate: targetView === "fullscreen" ? [0, 540] : [0, -540], boxShadow: ["0 10px 30px rgba(0,0,0,0.5)", "0 120px 160px rgba(0,0,0,0.9)", "0 40px 80px rgba(0,0,0,0.7)"], ease: 'outExpo', duration: 1100, onBegin: () => { setTimeout(() => setView(targetView), 500); }, onComplete: () => { setIsAnimating(false); animate(portalVinylRef.current, { opacity: 0, duration: 250, ease: 'linear' }); } });
  };
  const [playlists, setPlaylists] = useState(() => { const saved = localStorage.getItem("customPlaylists"); return saved ? JSON.parse(saved) : []; });
  useEffect(() => { localStorage.setItem("customPlaylists", JSON.stringify(playlists)); }, [playlists]);
  const handleCreatePlaylist = (name) => { setPlaylists(prev => [...prev, { id: `playlist-${Date.now()}`, name, songs: [] }]); };
  const handleDeletePlaylist = (id) => { setPlaylists(prev => prev.filter(p => p.id !== id)); if (selectedAlbum?.id === id) { setSelectedAlbum(null); setView("albums"); } };

  return (
    <div className="w-screen overflow-hidden flex flex-col bg-background text-foreground transition-colors duration-500 cursor-none" style={{ height: "100dvh" }}>
      <CustomCursor />
      <AnimatePresence>
        {view === "landing" && (
          <motion.div key="landing-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }} transition={{ duration: 0.8, ease: "circIn" }} className="fixed inset-0 z-[2000]">
            <LandingView onAuthSuccess={handleAuthSuccess} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeTheme === 'eco' && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.15 }} exit={{ opacity: 0 }} className="fixed inset-0 z-0 pointer-events-none overflow-hidden"> <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-110 blur-sm" src="https://assets.mixkit.co/videos/preview/mixkit-forest-stream-in-the-sunlight-529-large.mp4" /> </motion.div> )}
        {activeTheme === 'neon' && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.12 }} exit={{ opacity: 0 }} className="fixed inset-0 z-0 pointer-events-none overflow-hidden"> <video autoPlay muted loop playsInline className="w-full h-full object-cover scale-110 blur-[2px]" src="https://assets.mixkit.co/videos/preview/mixkit-neon-lighted-street-at-night-with-rain-4592-large.mp4" /> </motion.div> )}
      </AnimatePresence>
      <audio ref={audioRef} src={currentSong?.audioUrl} onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)} onEnded={handleEnded} preload="auto" />
      <div ref={portalVinylRef} className="fixed z-[9999] pointer-events-none opacity-0 overflow-hidden" style={{ background: "repeating-radial-gradient(#1a1a1a 0px, #000 1px, #1a1a1a 4px)", borderRadius: '50%' }}>
         <div className="absolute inset-0 rounded-full opacity-30" style={{ background: "conic-gradient(from 0deg, transparent 0, #333 45deg, transparent 90deg, #333 135deg, transparent 180deg, #333 225deg, transparent 270deg, #333 315deg, transparent 360deg)" }} />
         <div className="absolute inset-[33%] rounded-full overflow-hidden border-2 border-black/50 shadow-inner">
            {currentSong && <img src={currentSong.imageUrl} className="w-full h-full object-cover grayscale-[0.2]" alt="" />}
            <div className="absolute inset-0 bg-black/10" /><div className="absolute inset-0 border-[4px] md:border-[10px] border-black/10 rounded-full" />
         </div>
         <div className="absolute w-[6%] aspect-square bg-[#ccc] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border border-black/40" />
      </div>
      <div className="hidden md:flex flex-1 min-h-0 relative">
        <Sidebar activeNav={activeNav} onNavChange={navigateTo} onBack={handleNavBack} onForward={handleNavForward} canGoBack={navHistory.length > 0} canGoForward={navFuture.length > 0} activePlaylist={activePlaylist} onPlaylistSelect={handlePlaylistSelect} song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying((p) => !p)} onNext={handleNext} onPrev={handlePrev} progress={progress} currentTime={currentTime} onSeek={handleSeek} isFullScreen={view === "fullscreen"} onOpenFullscreen={() => runVinylTransition("fullscreen")} themeColor={themeColor} isDark={isDark} likedSongs={likedSongs} onToggleLike={toggleLike} user={user} onLogout={handleLogout} isShuffle={isShuffle} repeatMode={repeatMode} onToggleShuffle={() => setIsShuffle(!isShuffle)} onToggleRepeat={() => setRepeatMode(prev => prev === "none" ? "all" : prev === "all" ? "one" : "none")} volume={volume} onVolumeChange={setVolume} inboxCount={inboxCount} hasNewPost={hasNewPost} />
        <div className="flex-1 relative m-[15px] ml-[15px] h-[calc(100%-30px)] bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
          <AnimatePresence mode="wait">
            {view !== "fullscreen" && (
              <motion.div key={activeNav} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col">
                <header className="flex-none h-24 flex items-center justify-between px-10 bg-background/40 backdrop-blur-3xl border-b border-foreground/[0.03] z-[100]">
                   <div className="flex flex-col cursor-pointer group" onClick={() => navigateTo('home')}>
                      <h1 className="text-4xl font-black italic tracking-tighter leading-none mb-0.5 group-hover:text-primary transition-colors">Vinl.</h1>
                      <span className="text-[9px] font-black uppercase tracking-[4px] opacity-20">Network Synergy V2.4</span>
                   </div>
                   <div className="flex items-center gap-6">
                      <AnimatePresence mode="wait">
                         {user && (
                           <motion.div key="user-cluster" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex items-center gap-4">
                               <button onClick={handleLogout} className="w-11 h-11 rounded-2xl bg-foreground/[0.03] border border-foreground/[0.05] flex items-center justify-center text-foreground/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all group" title="Logout"><LogOut size={18} /></button>
                               <div onClick={() => navigateTo('profile')} className="flex items-center gap-4 bg-foreground/[0.03] border border-foreground/[0.05] rounded-full p-1.5 pl-4 pr-4 hover:bg-foreground/[0.06] transition-all cursor-pointer group active:scale-95">
                                  <span className="text-[11px] font-black uppercase tracking-[2px] opacity-40 group-hover:opacity-100 transition-opacity">{user.username || 'Testing_User'}</span>
                                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[12px] font-black border-2 border-background">{(user.username || 'V')[0].toUpperCase()}</div>
                                </div>
                           </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                </header>
                <div className="flex-1 relative overflow-hidden min-h-0">
                  {activeNav === "home" && <HomeView songs={songs} currentSong={currentSong} isPlaying={isPlaying} onSongSelect={handleSongSelect} onOpenFullscreen={() => runVinylTransition("fullscreen")} user={user} onNavChange={navigateTo} onLogout={handleLogout} themeColor={themeColor} />}
                  {activeNav === "discover" && <DiscoverView onSongSelect={handleSongSelect} currentSong={currentSong} isPlaying={isPlaying} themeColor={themeColor} likedSongs={likedSongs} onToggleLike={toggleLike} />}
                  {activeNav === "radio" && <RadioView themeColor={themeColor} onBack={() => navigateTo("home")} />}
                  {activeNav === "albums" && (selectedAlbum ? <AlbumDetailsView album={selectedAlbum} songs={songs} currentSong={currentSong} isPlaying={isPlaying} onSongSelect={handleSongSelect} onBack={() => { setSelectedAlbum(null); setView("albums"); }} themeColor={themeColor} likedSongs={likedSongs} onToggleLike={toggleLike} /> : <AlbumsView songs={displayedSongs} likedSongs={likedSongs} currentSong={currentSong} isPlaying={isPlaying} onSongSelect={handleSongSelect} onAlbumSelect={handleAlbumSelect} playlists={playlists} onCreatePlaylist={handleCreatePlaylist} onDeletePlaylist={handleDeletePlaylist} />)}
                  {activeNav === "blend" && <BlendView user={user} songs={songs} blendQueue={blendQueue} onUpdateQueue={(newQueue) => { setBlendQueue(newQueue); if (socket && activeRoom) socket.emit('sync-queue', { roomId: activeRoom, queue: newQueue }); }} onSongSelect={handleSongSelect} activeRoom={activeRoom} onJoinRoom={setActiveRoom} socket={socket} />}
                  {activeNav === "inbox" && <InboxView onJoinRoom={(code) => { setActiveRoom(code); setActiveNav("blend"); }} onBack={() => setActiveNav("home")} />}
                  {activeNav === "themes" && <ThemesView currentTheme={activeTheme} onThemeChange={setActiveTheme} accentColor={accentColor} onAccentChange={setAccentColor} />}
                  {activeNav === "liked" && <LikedSongsView songs={songs} likedSongs={likedSongs} onSongSelect={handleSongSelect} currentSong={currentSong} isPlaying={isPlaying} onBack={() => setActiveNav("home")} />}
                  {activeNav === "profile" && (user ? <ProfileView user={user} onUpdate={setUser} onLogout={handleLogout} /> : <AuthView onAuthSuccess={handleAuthSuccess} onBack={() => setActiveNav("home")} />)}
                  {!["home", "discover", "radio", "albums", "blend", "liked", "profile", "themes", "inbox"].includes(activeNav) && <NotFoundView onBack={handleNavBack} onHome={() => navigateTo("home")} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="flex md:hidden fixed inset-0 flex-col overflow-hidden bg-background">
        <div className="flex-1 relative overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {view !== "fullscreen" && (
              <motion.div key={activeNav} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute inset-0 flex">
                {activeNav === "home" && <MobileHomeView songs={songs} currentSong={currentSong} isPlaying={isPlaying} onSongSelect={handleSongSelect} onOpenFullscreen={() => runVinylTransition("fullscreen")} user={user} onProfileSelect={() => setActiveNav("profile")} />}
                {activeNav === "discover" && <DiscoverView onSongSelect={handleSongSelect} currentSong={currentSong} isPlaying={isPlaying} themeColor={themeColor} />}
                {activeNav === "radio" && <RadioView onBack={() => navigateTo("home")} />}
                {activeNav === "albums" && (selectedAlbum ? <AlbumDetailsView album={selectedAlbum} songs={songs} currentSong={currentSong} isPlaying={isPlaying} onSongSelect={handleSongSelect} onBack={() => { setSelectedAlbum(null); }} themeColor={themeColor} /> : <AlbumsView songs={displayedSongs} likedSongs={likedSongs} currentSong={currentSong} isPlaying={isPlaying} onSongSelect={handleSongSelect} onAlbumSelect={handleAlbumSelect} />)}
                {activeNav === "blend" && <BlendView user={user} songs={songs} onSongSelect={handleSongSelect} />}
                {activeNav === "themes" && <ThemesView currentTheme={activeTheme} onThemeChange={setActiveTheme} accentColor={accentColor} onAccentChange={setAccentColor} />}
                {activeNav === "liked" && <LikedSongsView songs={songs} likedSongs={likedSongs} onSongSelect={handleSongSelect} currentSong={currentSong} isPlaying={isPlaying} onBack={() => setActiveNav("home")} />}
                {activeNav === "profile" && (user ? <ProfileView user={user} onUpdate={setUser} onLogout={handleLogout} /> : <AuthView onAuthSuccess={handleAuthSuccess} onBack={() => navigateTo("home")} />)}
                {!["home", "discover", "radio", "albums", "blend", "liked", "profile", "themes"].includes(activeNav) && <NotFoundView onBack={handleNavBack} onHome={() => navigateTo("home")} />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {activeTheme === "studio" ? <MobileStudioBar song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(p => !p)} onOpenFullscreen={() => runVinylTransition("fullscreen")} /> : activeTheme === "f4" ? <MobileReelBar song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(p => !p)} onOpenFullscreen={() => runVinylTransition("fullscreen")} /> : <MobilePlayerBar song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(p => !p)} onNext={handleNext} onPrev={handlePrev} progress={progress} onOpenFullscreen={() => runVinylTransition("fullscreen")} themeColor={themeColor} />}
        <MobileNav activeNav={activeNav} onNavChange={navigateTo} />
      </div>
      <AnimatePresence>
        {view === "fullscreen" && (
          isMobile ? (
            activeTheme === "studio" ? <MobileStudioSync key="studio-player" song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying((p) => !p)} onBack={() => setView("home")} onNext={handleNext} onPrev={handlePrev} progress={progress} currentTime={currentTime} onSeek={handleSeek} isLiked={likedSongs.includes(currentSong?.id)} onToggleLike={() => toggleLike(currentSong?.id)} audioElement={audioRef.current} /> : activeTheme === "f4" ? <MobileReelPlayer key="reel-player" song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying((p) => !p)} onBack={() => setView("home")} onNext={handleNext} onPrev={handlePrev} progress={progress} currentTime={currentTime} onSeek={handleSeek} isLiked={likedSongs.includes(currentSong?.id)} onToggleLike={() => toggleLike(currentSong?.id)} /> : <MobileCassettePlayer key="cassette-player" song={currentSong} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying((p) => !p)} onBack={() => setView("home")} onNext={handleNext} onPrev={handlePrev} progress={progress} currentTime={currentTime} onSeek={handleSeek} themeColor={themeColor} isLiked={likedSongs.includes(currentSong?.id)} onToggleLike={() => toggleLike(currentSong?.id)} isShuffle={isShuffle} repeatMode={repeatMode} songs={songs} onToggleShuffle={() => setIsShuffle(!isShuffle)} onToggleRepeat={() => setRepeatMode(prev => prev === "none" ? "all" : prev === "all" ? "one" : "none")} />
          ) : (
            <motion.div key="fullscreen-player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="fixed inset-0 z-[100] bg-background">
              <FullscreenPlayerView song={currentSong} songs={songs} activeTheme={activeTheme} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying((p) => !p)} onBack={() => runVinylTransition("home")} onNext={handleNext} onPrev={handlePrev} progress={progress} currentTime={currentTime} volume={volume} onVolumeChange={setVolume} onSeek={handleSeek} themeColor={themeColor} isDark={isDark} isLiked={likedSongs.includes(currentSong?.id)} onToggleLike={() => toggleLike(currentSong?.id)} isAnimating={isAnimating} isShuffle={isShuffle} repeatMode={repeatMode} onToggleShuffle={() => setIsShuffle(!isShuffle)} onToggleRepeat={() => setRepeatMode(prev => prev === "none" ? "all" : prev === "all" ? "one" : "none")} onSongSelect={handleSongSelect} />
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
