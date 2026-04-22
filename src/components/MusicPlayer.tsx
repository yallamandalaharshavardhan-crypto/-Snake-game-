import { useState, useRef, useEffect } from "react";
import { TRACKS } from "../constants";
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full h-full bg-[#111] border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl" id="music-player-container">
      <audio 
        ref={audioRef} 
        src={currentTrack.audioUrl} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="p-4 border-b border-slate-800 bg-black/40">
        <h3 className="text-xs font-bold uppercase tracking-widest text-fuchsia-400">Neural Playlist</h3>
      </div>

      {/* Track List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-2" id="playlist-preview">
        {TRACKS.map((track, idx) => (
          <motion.button
            key={track.id}
            onClick={() => {
              setCurrentTrackIndex(idx);
              setIsPlaying(true);
            }}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            className={`w-full flex items-center gap-3 p-4 transition-all border-l-2 ${
              idx === currentTrackIndex ? "bg-white/5 border-fuchsia-500" : "border-transparent opacity-50"
            }`}
            id={`playlist-item-${idx}`}
          >
             <div className={`w-10 h-10 rounded-md flex items-center justify-center font-mono text-xs italic ${
               idx === currentTrackIndex ? "bg-gradient-to-br from-fuchsia-600 to-purple-800" : "bg-slate-800"
             }`}>
               {(idx + 1).toString().padStart(2, '0')}
             </div>
             <div className="flex flex-col items-start overflow-hidden">
               <span className={`text-xs font-bold truncate ${idx === currentTrackIndex ? "text-white" : "text-slate-400"}`}>
                 {track.title}
               </span>
               <span className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter truncate">{track.artist}</span>
             </div>
          </motion.button>
        ))}
      </div>

      {/* Active Track Footer / Controls */}
      <div className="bg-[#161616] border-t border-slate-800 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button onClick={prevTrack} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">⏮</button>
             <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-cyan-500 text-black flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)] hover:scale-105 transition-transform"
             >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
             </button>
             <button onClick={nextTrack} className="p-2 text-slate-400 hover:text-cyan-400 transition-colors">⏭</button>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-[10px] text-cyan-400 font-mono">{progress.toFixed(0)}% SYNC</span>
             <Volume2 size={12} className="text-slate-600 mt-1" />
           </div>
        </div>

        <div className="w-full">
           <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
             <motion.div 
               className="h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ type: "tween", ease: "linear" }}
             />
           </div>
        </div>
      </div>
    </div>
  );
}

