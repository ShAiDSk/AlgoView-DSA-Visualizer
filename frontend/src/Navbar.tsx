import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart3, Code2, ExternalLink, Info, X } from "lucide-react";

interface NavbarProps {
  apiUrl: string;
}

const Navbar = ({ apiUrl }: NavbarProps) => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="h-16 border-b border-white/10 bg-[#1e293b]/80 backdrop-blur-md flex items-center justify-between px-6 z-50 shrink-0">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <BarChart3 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight leading-none">AlgoView</h1>
            <span className="text-[10px] font-medium text-blue-400 uppercase tracking-widest">Ultra Dashboard</span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4">
          <a href={`${apiUrl}/api/algorithms/`} target="_blank" rel="noreferrer" 
             className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-blue-400 transition bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
             <Code2 size={14} /> /api/algorithms <ExternalLink size={10} />
          </a>
          <a href={`${apiUrl}/api/history/`} target="_blank" rel="noreferrer" 
             className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-emerald-400 transition bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
             <Code2 size={14} /> /api/history <ExternalLink size={10} />
          </a>
          <div className="h-6 w-px bg-white/10 mx-1"></div>
          <button 
            onClick={() => setShowAbout(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition px-3 py-2 rounded-lg hover:bg-white/5"
          >
            <Info size={18} /> <span className="hidden sm:inline">About</span>
          </button>
        </div>
      </nav>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="p-2 bg-blue-600/20 rounded-lg"><BarChart3 className="text-blue-400" size={24} /></div>
                  <button onClick={() => setShowAbout(false)} className="text-slate-400 hover:text-white transition"><X size={20} /></button>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">AlgoView <span className="text-blue-400">Ultra</span></h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  An advanced, real-time Data Structures & Algorithms visualizer built for developers. 
                  Experience sorting, searching, and complex graph algorithms like Dijkstra and Prim's MST in a modern, interactive dashboard.
                </p>
                
                <div className="space-y-3">
                  <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Tech Stack</h3>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2 py-1 bg-blue-500/10 text-blue-300 text-[10px] rounded border border-blue-500/20">React + Vite</span>
                      <span className="px-2 py-1 bg-green-500/10 text-green-300 text-[10px] rounded border border-green-500/20">Django REST Framework</span>
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-300 text-[10px] rounded border border-purple-500/20">Tailwind CSS</span>
                    </div>
                  </div>
                  <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-1">Created By</h3>
                    <p className="text-sm text-slate-300">ShAiDSk</p>
                  </div>
                </div>
              </div>
              <div className="bg-black/20 p-4 border-t border-white/5 text-center">
                <button onClick={() => setShowAbout(false)} className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;