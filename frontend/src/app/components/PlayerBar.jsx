import { Play, Pause, SkipBack, SkipForward, Maximize2 } from "lucide-react";

import { formatTime } from "../data";
import { useRef } from "react";

export function PlayerBar({
  song,
  isPlaying,
  progress,
  currentTime,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onOpenFullscreen
}) {
  const progressBarRef = useRef(null);

  const handleProgressClick = (e) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width * 100;
    onSeek(Math.max(0, Math.min(100, percent)));
  };

  return (
    <div
      className="flex-none h-[120px] mx-[15px] mb-[15px] rounded-[16px] flex items-center px-[24px] gap-[20px] overflow-hidden bg-card border border-border shadow-2xl relative z-30"
    >
      
      {/* Album art */}
      <button
        onClick={onOpenFullscreen}
        className="flex-none w-[80px] h-[80px] rounded-[10px] overflow-hidden hover:scale-105 transition-transform relative group">
        
        <img
          src={song?.imageUrl}
          alt={song?.title}
          className="w-full h-full object-cover" />
        
        {/* Spinning vinyl overlay effect */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
          
          <Maximize2 size={20} className="text-foreground" />
        </div>
      </button>

      {/* Song info + progress */}
      <div className="flex-1 flex flex-col gap-[6px]">
        {/* Song title */}
        <p
          className="text-foreground capitalize truncate"
          style={{ fontFamily: "Outfit, sans-serif", fontSize: "18px", fontWeight: 600 }}>
          
          {song?.title}
        </p>
        <p
          className="text-foreground/50 truncate"
          style={{ fontFamily: "Outfit, sans-serif", fontSize: "13px", fontWeight: 400 }}>
          
          {song?.artist} · AI Generated
        </p>

        {/* Progress row */}
        <div className="flex items-center gap-[10px] mt-[2px]">
          <span
            className="text-foreground/60 flex-none tabular-nums"
            style={{ fontFamily: "Outfit, sans-serif", fontSize: "12px", minWidth: "36px" }}>
            
            {formatTime(currentTime)}
          </span>

          {/* Progress bar */}
          <div
            ref={progressBarRef}
            className="flex-1 h-[6px] bg-white/20 rounded-full cursor-pointer relative group/bar"
            onClick={handleProgressClick}>
            
            {/* Filled portion */}
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: "red" }} />
            
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-[14px] h-[14px] rounded-full bg-red-500 border-2 border-white shadow-md opacity-0 group-hover/bar:opacity-100 transition-opacity"
              style={{ left: `calc(${progress}% - 7px)` }} />
            
          </div>

          <span
            className="text-foreground/60 flex-none tabular-nums"
            style={{ fontFamily: "Outfit, sans-serif", fontSize: "12px", minWidth: "36px", textAlign: "right" }}>
            
            {formatTime(song?.duration || 0)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-[16px] flex-none">
        <button
          onClick={onPrev}
          className="w-[38px] h-[38px] rounded-full bg-black/60 flex items-center justify-center hover:bg-foreground/10 transition-colors">
          
          <SkipBack size={16} className="text-foreground fill-current" />
        </button>

        <button
          onClick={onTogglePlay}
          className="w-[48px] h-[48px] rounded-full bg-foreground flex items-center justify-center hover:opacity-90 transition-opacity shadow-lg">
          
          {isPlaying ?
          <Pause size={20} className="text-background fill-background" /> :

          <Play size={20} className="text-background fill-background ml-0.5" />
          }
        </button>

        <button
          onClick={onNext}
          className="w-[38px] h-[38px] rounded-full bg-black/60 flex items-center justify-center hover:bg-foreground/10 transition-colors">
          
          <SkipForward size={16} className="text-foreground fill-current" />
        </button>
      </div>

      {/* Fullscreen button */}
      <button
        onClick={onOpenFullscreen}
        className="flex-none w-[36px] h-[36px] rounded-full bg-foreground/10 flex items-center justify-center hover:bg-white/20 transition-colors ml-[8px]">
        
        <Maximize2 size={16} className="text-foreground" />
      </button>
    </div>);

}