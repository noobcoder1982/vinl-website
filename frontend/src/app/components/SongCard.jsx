
import { Play, Pause } from "lucide-react";








export function SongCard({ song, isSelected, isPlaying, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative group cursor-pointer flex-none transition-all duration-300 hover:-translate-y-1 w-full overflow-hidden"
    >
      
      {/* The "Polaroid" Card */}
      <div className={`p-[10px] pb-[40px] bg-white rounded-[4px] shadow-lg transition-all duration-300 ${isSelected ? "ring-2 ring-red-500 ring-offset-4 ring-offset-black/20" : "group-hover:shadow-white/10"}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100 rounded-[2px]">
          <img
            src={song?.imageUrl}
            alt={song?.title}
            className={`w-full h-full object-cover transition-transform duration-500 ${isPlaying ? "scale-105" : "group-hover:scale-110"}`} />
          
          {/* Subtle inner shadow on image */}
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] pointer-events-none" />

          {/* Play/pause indicator overlay */}
          <div
            className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${isSelected || isPlaying ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}>
            <div className="w-[48px] h-[48px] rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
              {isPlaying ?
                <Pause size={24} className="text-white fill-white" /> :
                <Play size={24} className="text-white fill-white ml-1" />
              }
            </div>
          </div>
        </div>

        {/* Title inside the white area (Polaroid style) */}
        <div className="mt-[12px] px-[4px]">
          <p
            className="text-black text-[14px] font-bold leading-tight truncate text-left"
            style={{ fontFamily: "Outfit, sans-serif" }}>
            {song.title}
          </p>
          <p className="text-black/50 text-[11px] font-medium truncate text-left mt-[2px]">
            {song.artist}
          </p>
          {song.language && (
            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-black/5 border border-black/10 text-black/40 text-[8px] font-black uppercase tracking-widest">
              {song.language}
            </span>
          )}
        </div>
      </div>

      {/* Selected Indicator Glow */}
      {isSelected && (
        <div className="absolute -inset-[2px] rounded-[6px] bg-red-500/20 blur-sm -z-10 animate-pulse" />
      )}
    </button>
  );
}