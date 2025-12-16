import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Clean Imports
import GraphCanvas from './GraphCanvas';
import Navbar from './Navbar';  // <--- Import New Navbar
import { type GraphRef, type Algorithm, type Stats, type SortingRun, type ToastMessage } from './types';

import {
  Play,
  Square,
  RotateCcw,
  Settings2,
  Activity,
  CheckCircle2,
  AlertCircle,
  Terminal,
  Shuffle,
  Trash2,
} from "lucide-react";

function App() {
  const [algos, setAlgos] = useState<Algorithm[]>([]);
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm | null>(null);
  const [array, setArray] = useState<number[]>([]);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  
  const [isSorting, setIsSorting] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [arraySize, setArraySize] = useState(40);
  const [stats, setStats] = useState<Stats>({ comparisons: 0, swaps: 0 });
  const [history, setHistory] = useState<SortingRun[]>([]);

  const statsRef = useRef<Stats>({ comparisons: 0, swaps: 0 });
  const shouldStop = useRef(false);
  const graphRef = useRef<GraphRef>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  const showToast = (message: string, type: "success" | "info" = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString().split(" ")[0]}] ${msg}`,
    ]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleGraphStats = (comparisons: number, swaps: number) => {
    statsRef.current = { comparisons, swaps };
    setStats({ comparisons, swaps });
  };

  // ✅ New Stop Check for Graph Algos
  const checkStopSignal = () => {
    if (shouldStop.current) throw new Error("STOPPED");
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/api/algorithms/`)
      .then((res) => {
        setAlgos(res.data);
        if (res.data.length > 0) setSelectedAlgo(res.data[0]);
      })
      .catch((err) => console.error(err));
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    axios
      .get(`${API_URL}/api/history/`)
      .then((res) => setHistory(res.data))
      .catch((err) => console.error(err));
  };

  const saveRun = (comparisons: number, swaps: number) => {
    if (!selectedAlgo) return;
    axios
      .post(`${API_URL}/api/history/`, {
        algorithm: selectedAlgo.name,
        array_size: arraySize,
        speed_ms: speed,
        comparisons,
        swaps,
      })
      .then(fetchHistory);
  };

  useEffect(() => { resetArray(); }, [arraySize]);

  const resetArray = () => {
    if (isSorting) return;
    setLogs([]);
    if (graphRef.current) graphRef.current.reset();

    const newArr = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 300) + 20);
    if (selectedAlgo?.id === "binary") newArr.sort((a, b) => a - b);
    setArray(newArr);
    setStats({ comparisons: 0, swaps: 0 });
    statsRef.current = { comparisons: 0, swaps: 0 };
    setActiveIndices([]);
    shouldStop.current = false;
  };

  const generateRandomGraph = () => {
    if (graphRef.current) {
      graphRef.current.generateRandomGraph();
      addLog("🎲 Generated Random Weighted Graph");
    }
  };

  const clearGraph = () => {
    if (graphRef.current) {
      graphRef.current.reset();
      addLog("🧹 Canvas Cleared");
    }
  };

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const checkStop = () => { if (shouldStop.current) throw new Error("STOPPED"); };

  const runBubbleSort = async () => {
    try {
      addLog("Starting Bubble Sort...");
      const arr = [...array];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          checkStop();
          statsRef.current.comparisons++;
          setStats({ ...statsRef.current });
          setActiveIndices([j, j + 1]);
          if (arr[j] > arr[j + 1]) {
            statsRef.current.swaps++;
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            await delay(101 - speed);
          }
        }
      }
      saveRun(statsRef.current.comparisons, statsRef.current.swaps);
      addLog(`Sort Complete!`);
      showToast("Sort Complete", "success");
    } catch (e) { addLog("⚠️ Process Stopped"); }
    setActiveIndices([]);
    setIsSorting(false);
  };

  const runLinearSearch = async () => {
    try {
      const target = array[Math.floor(Math.random() * array.length)];
      addLog(`Linear Search: ${target}`);
      for (let i = 0; i < array.length; i++) {
        checkStop();
        setActiveIndices([i]);
        statsRef.current.comparisons++;
        setStats({ ...statsRef.current });
        await delay(101 - speed);
        if (array[i] === target) { addLog(`Found at ${i}`); break; }
      }
    } catch (e) { addLog("Stopped"); }
    setActiveIndices([]);
    setIsSorting(false);
  };

  const runBinarySearch = async () => {
    try {
      const arr = [...array].sort((a, b) => a - b);
      setArray(arr);
      const target = arr[Math.floor(Math.random() * arr.length)];
      addLog(`Binary Search: ${target}`);
      let l = 0, r = arr.length - 1;
      while (l <= r) {
        checkStop();
        const mid = Math.floor((l + r) / 2);
        setActiveIndices([mid, l, r]);
        statsRef.current.comparisons++;
        setStats({ ...statsRef.current });
        await delay(300 - speed * 2);
        if (arr[mid] === target) { addLog(`Found at ${mid}`); break; }
        else if (arr[mid] < target) l = mid + 1;
        else r = mid - 1;
      }
    } catch (e) { addLog("Stopped"); }
    setActiveIndices([]);
    setIsSorting(false);
  };

  const handleStart = () => {
    shouldStop.current = false;
    setIsSorting(true);
    setLogs([]);
    setStats({ comparisons: 0, swaps: 0 });

    if (selectedAlgo?.category === "Graph") {
      const runGraphAlgo = async () => {
        try {
          if (selectedAlgo.id === "bfs_graph") await graphRef.current?.runBFS(speed, addLog, handleGraphStats, checkStopSignal);
          else if (selectedAlgo.id === "dijkstra") await graphRef.current?.runDijkstra(speed, addLog, handleGraphStats, checkStopSignal);
          else if (selectedAlgo.id === "prim") await graphRef.current?.runPrim(speed, addLog, handleGraphStats, checkStopSignal);
          saveRun(statsRef.current.comparisons, statsRef.current.swaps);
        } catch (e: any) { 
            if (e.message === "STOPPED") addLog("⚠️ Process Stopped");
            else console.error(e);
        }
        setIsSorting(false);
      };
      runGraphAlgo();
      return;
    }

    if (selectedAlgo?.id === "bubble") runBubbleSort();
    else if (selectedAlgo?.id === "linear") runLinearSearch();
    else if (selectedAlgo?.id === "binary") runBinarySearch();
    else runBubbleSort();
  };

  return (
    <div className="h-screen bg-[#0f172a] text-slate-200 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* --- Insert New Navbar --- */}
      <Navbar apiUrl={API_URL} />

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <div className="absolute top-5 right-5 z-50 flex flex-col gap-2">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div key={toast.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border border-white/10 backdrop-blur-md ${
                  toast.type === "success" ? "bg-green-500/20 text-green-200" : "bg-blue-500/20 text-blue-200"
                }`}>
                {toast.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />} <span className="text-sm font-medium">{toast.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-[350px] p-6 flex flex-col gap-6 border-r border-white/5 bg-[#1e293b]/50 backdrop-blur-xl overflow-y-auto z-10 shadow-2xl">
          <div className="flex items-center gap-2 mb-2 text-slate-400 border-b border-white/5 pb-2">
             <Settings2 size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Configuration</span>
          </div>

          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">Algorithm</label>
              <div className="relative">
                <select
                  className="w-full bg-[#0f172a]/80 p-3 rounded-xl border border-white/10 outline-none focus:border-blue-500 transition text-sm appearance-none cursor-pointer hover:bg-[#0f172a]"
                  onChange={(e) => {
                    const algo = algos.find((a) => a.id === e.target.value);
                    if (algo) setSelectedAlgo(algo);
                    if (algo?.id === "binary") resetArray();
                    if (algo?.category === "Graph") resetArray();
                  }}
                  disabled={isSorting}
                >
                  {algos.map((a) => ( <option key={a.id} value={a.id}>{a.name}</option> ))}
                </select>
                <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">▼</div>
              </div>
            </div>
            <div className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-4">
              {selectedAlgo?.category !== "Graph" && (
                <div>
                  <div className="flex justify-between mb-2 text-xs font-medium text-slate-400"><span>Size</span> <span>{arraySize}</span></div>
                  <input type="range" min="10" max="80" value={arraySize} onChange={(e) => setArraySize(Number(e.target.value))} disabled={isSorting} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                </div>
              )}
              <div>
                <div className="flex justify-between mb-2 text-xs font-medium text-slate-400"><span>Speed</span> <span>{speed}ms</span></div>
                <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} disabled={isSorting} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
              {selectedAlgo?.category === "Graph" ? (
                  <>
                  <button onClick={generateRandomGraph} disabled={isSorting} className="flex items-center justify-center gap-2 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-xl font-semibold transition"><Shuffle size={16} /> Shuffle</button>
                  <button onClick={clearGraph} disabled={isSorting} className="flex items-center justify-center gap-2 py-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/30 rounded-xl font-semibold transition"><Trash2 size={16} /> Clear</button>
                  </>
              ) : (
                  <button onClick={resetArray} disabled={isSorting} className="col-span-2 flex items-center justify-center gap-2 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl font-semibold transition disabled:opacity-50 border border-white/5"><RotateCcw size={16} /> Reset</button>
              )}
              </div>
              {!isSorting ? (
              <button onClick={handleStart} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold shadow-lg shadow-blue-900/40 transition active:scale-95"><Play size={18} fill="currentColor" /> Start Simulation</button>
              ) : (
              <button onClick={() => (shouldStop.current = true)} className="w-full flex items-center justify-center gap-2 py-3 bg-red-500/10 text-red-400 border border-red-500/50 hover:bg-red-500/20 rounded-xl font-bold transition animate-pulse"><Square size={18} fill="currentColor" /> STOP</button>
              )}
          </div>

          {selectedAlgo && (
            <div className="flex-1 min-h-[150px] bg-[#0b0f19] p-4 rounded-xl border border-white/10 font-mono text-xs overflow-auto relative group">
              <div className="absolute top-2 right-2 text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400">{selectedAlgo.complexity}</div>
              <pre className="text-emerald-400 leading-relaxed">{selectedAlgo.code}</pre>
            </div>
          )}
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 flex flex-col relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-[#0f172a]">
          <div className="flex-1 flex items-end justify-center px-4 pb-10 pt-4 gap-[2px] relative w-full h-full">
            {selectedAlgo?.category === "Graph" ? (
              <GraphCanvas ref={graphRef} />
            ) : (
              <div className="w-full h-full flex items-end justify-center gap-[2px] px-10">
                {array.map((val, idx) => {
                  let colorClass = "bg-gradient-to-t from-blue-600 to-cyan-400";
                  if (activeIndices.includes(idx)) colorClass = "bg-gradient-to-t from-pink-500 to-rose-500 shadow-[0_0_15px_rgba(236,72,153,0.6)] z-10";
                  else if (selectedAlgo?.id === "binary" && (idx < activeIndices[1] || idx > activeIndices[2])) colorClass = "bg-slate-800 opacity-30";
                  return ( <motion.div key={idx} layout={!isSorting} initial={{ height: 0, opacity: 0 }} animate={{ height: `${val}px`, opacity: 1 }} transition={{ type: "spring", damping: 20, stiffness: 300 }} className={`flex-1 rounded-t-sm ${colorClass}`} style={{ maxWidth: "30px", minHeight: "6px" }} /> );
                })}
              </div>
            )}

            <div className="absolute top-4 right-4 w-72 h-48 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 flex flex-col overflow-hidden shadow-2xl z-20">
              <div className="bg-white/5 p-2 px-3 text-xs font-bold text-slate-400 flex items-center gap-2 border-b border-white/5"><Terminal size={12} /> EXECUTION LOG</div>
              <div className="flex-1 overflow-y-auto p-3 space-y-1 font-mono text-[10px] text-slate-300">
                {logs.length === 0 ? ( <span className="text-slate-600 italic">Ready to run...</span> ) : ( logs.map((log, i) => ( <div key={i} className="border-l-2 border-blue-500/30 pl-2">{log}</div> )))}
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          <div className="h-48 bg-[#1e293b]/60 backdrop-blur-md border-t border-white/5 flex flex-col">
            <div className="flex justify-around items-center p-4 border-b border-white/5">
              <div className="text-center"><div className="text-2xl font-bold text-yellow-400 tabular-nums">{stats.comparisons}</div><div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Comparisons</div></div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center"><div className="text-2xl font-bold text-purple-400 tabular-nums">{stats.swaps}</div><div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Swaps</div></div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex items-center gap-2 text-slate-400"><Activity size={16} /> <span className="text-sm font-medium">Live Metrics</span></div>
            </div>
            <div className="flex-1 overflow-auto p-0">
              <table className="w-full text-left text-sm text-slate-400">
                <thead className="bg-black/20 sticky top-0 text-xs uppercase font-semibold text-slate-500">
                  <tr><th className="p-3 pl-6">Algorithm</th><th className="p-3">Comparisons</th><th className="p-3">Swaps</th><th className="p-3 text-right pr-6">Time</th></tr>
                </thead>
                <tbody>
                  {history.map((run) => (
                    <tr key={run.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="p-3 pl-6 font-medium text-blue-300">{run.algorithm}</td><td className="p-3">{run.comparisons}</td><td className="p-3">{run.swaps}</td><td className="p-3 text-right pr-6 font-mono text-xs opacity-50">{new Date(run.timestamp).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;