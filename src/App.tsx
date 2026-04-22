import SnakeGame from "./components/SnakeGame";
import MusicPlayer from "./components/MusicPlayer";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans overflow-hidden border-8 border-[#111]" id="app-root">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-6 relative z-10" id="header">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 uppercase"
          >
            Neon Pulse v.1
          </motion.h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 opacity-70">Neural Music & Pulse Gaming</p>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <main className="grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-180px)] min-h-[600px] relative z-10" id="main-content">
        
        {/* Left Column: System Status (Derived from Music Player / Game state) */}
        <div className="col-span-3 row-span-3 bg-[#111] border border-cyan-500/20 rounded-2xl p-5 flex flex-col justify-between shadow-[0_0_20px_rgba(0,243,255,0.05)]" id="system-status">
          <div>
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Sync Rate</span>
                <span className="text-cyan-400 font-mono">1.04ms</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[85%]"></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-300">Neural Load</span>
                <span className="text-fuchsia-400 font-mono italic text-xs">DYNAMIC</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-800">
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></div>
              <span className="text-[9px] uppercase tracking-tighter text-slate-500">AI Core Synchronized</span>
            </div>
          </div>
        </div>

        {/* Center: Snake Game Window */}
        <div className="col-span-6 row-span-5 bg-[#0a0a0a] border-2 border-slate-800 rounded-3xl relative overflow-hidden flex items-center justify-center group shadow-2xl" id="game-container">
           {/* Grid Background */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
           <SnakeGame />
        </div>

        {/* Right Column: Music Player (Playlist/State portion) */}
        <div className="col-span-3 row-span-6" id="music-container">
          <MusicPlayer />
        </div>

        {/* Left Bottom: Visualizer Box (Static Decorative) */}
        <div className="col-span-3 row-span-3 bg-[#111] border border-fuchsia-500/20 rounded-2xl p-4 flex items-end gap-[2.5px] overflow-hidden" id="visualizer">
          {[20, 45, 60, 40, 90, 75, 95, 55, 35, 15].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ repeat: Infinity, duration: 0.5 + i * 0.05, repeatType: 'reverse' }}
              className={`flex-1 ${i < 5 ? 'bg-cyan-400/60 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'bg-fuchsia-400/60 shadow-[0_0_10px_rgba(217,70,239,0.3)]'} rounded-t-sm`}
            />
          ))}
        </div>

        {/* Footer info (center bottom col) */}
        <div className="col-span-6 row-span-1 flex items-center justify-center text-[10px] text-slate-600 uppercase tracking-widest gap-8 bg-[#161616]/50 rounded-2xl border border-slate-800" id="session-footer">
          <p>Build 0.9.4 // Sandbox Environment</p>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <p>Neural-Synth-V2 // Connected</p>
        </div>

      </main>

      {/* Actual Site Footer */}
      <footer className="mt-4 flex items-center justify-between text-[10px] text-slate-600 uppercase tracking-widest" id="footer">
        <p>&copy; 2026 Neon Pulse Systems</p>
        <p className="flex gap-4">
          <span className="text-cyan-500/50">#GRID_ACTIVE</span>
          <span className="text-fuchsia-500/50">#PULSE_LOCKED</span>
        </p>
      </footer>
    </div>
  );
}


