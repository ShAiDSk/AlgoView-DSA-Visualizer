import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { type Node, type Edge, type GraphRef } from './types'; 

const GraphCanvas = forwardRef<GraphRef, {}>((_, ref) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [activeNode, setActiveNode] = useState<number | null>(null);
  const [highlightedNodes, setHighlightedNodes] = useState<number[]>([]);
  const [highlightedEdges, setHighlightedEdges] = useState<number[]>([]);
  const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
  
  const nextId = useRef(0);
  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  useImperativeHandle(ref, () => ({
    reset: () => {
      setNodes([]);
      setEdges([]);
      setHighlightedNodes([]);
      setHighlightedEdges([]);
      setVisitedNodes([]);
      nextId.current = 0;
    },
    
    generateRandomGraph: () => {
        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        const count = 6 + Math.floor(Math.random() * 5); 
        const usedPositions = new Set<string>();
        for(let i=0; i<count; i++) {
            let x, y, key;
            let attempts = 0;
            do {
                x = 80 + Math.floor(Math.random() * 600);
                y = 80 + Math.floor(Math.random() * 250);
                x = Math.round(x / 60) * 60;
                y = Math.round(y / 60) * 60;
                key = `${x},${y}`;
                attempts++;
            } while(usedPositions.has(key) && attempts < 50);
            usedPositions.add(key);
            newNodes.push({ id: i, x, y, dist: Infinity });
        }
        for(let i=0; i<count; i++) {
            const connections = 1 + Math.floor(Math.random() * 2);
            for(let j=0; j<connections; j++) {
                const target = Math.floor(Math.random() * count);
                if (target !== i) {
                    const exists = newEdges.some(e => (e.from === i && e.to === target) || (e.from === target && e.to === i));
                    if (!exists) newEdges.push({ from: i, to: target, weight: Math.floor(Math.random() * 9) + 1 });
                }
            }
        }
        nextId.current = count;
        setNodes(newNodes);
        setEdges(newEdges);
        setHighlightedNodes([]);
        setHighlightedEdges([]);
        setVisitedNodes([]);
    },

    // --- ALGORITHMS (Now checking stop signal) ---

    runBFS: async (speed, logStep, updateStats, checkStop) => {
      if (nodes.length === 0) return;
      logStep("🚀 Starting BFS...");
      let comps = 0, swaps = 0;

      const adj: Record<number, number[]> = {};
      nodes.forEach(n => adj[n.id] = []);
      edges.forEach(e => { adj[e.from].push(e.to); adj[e.to].push(e.from); });

      const queue = [nodes[0].id];
      const visited = new Set([nodes[0].id]);
      setVisitedNodes([nodes[0].id]);
      swaps++; 
      updateStats(comps, swaps);

      while (queue.length > 0) {
        checkStop(); // <--- STOP CHECK
        const curr = queue.shift()!;
        logStep(`🔍 Visiting Node ${curr}`);
        setHighlightedNodes([curr]);
        await wait(800 - speed * 6);

        if (adj[curr]) {
            for (const neighbor of adj[curr].sort((a,b)=>a-b)) {
                checkStop(); // <--- STOP CHECK
                comps++; 
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                    setVisitedNodes(Array.from(visited));
                    swaps++; 
                    
                    const edgeIdx = edges.findIndex(e => (e.from === curr && e.to === neighbor) || (e.from === neighbor && e.to === curr));
                    if (edgeIdx !== -1) setHighlightedEdges(prev => [...prev, edgeIdx]);
                    
                    logStep(`➡️ Moving to neighbor ${neighbor}`);
                    updateStats(comps, swaps);
                    await wait(800 - speed * 6);
                } else {
                    updateStats(comps, swaps); 
                }
            }
        }
      }
      setHighlightedNodes([]);
      logStep("✅ BFS Complete!");
    },

    runDijkstra: async (speed, logStep, updateStats, checkStop) => {
        if (nodes.length === 0) return;
        logStep("🚀 Starting Dijkstra...");
        let comps = 0, swaps = 0;

        const dist: Record<number, number> = {};
        nodes.forEach(n => { dist[n.id] = Infinity; });
        dist[nodes[0].id] = 0;
        setNodes(curr => curr.map(n => ({ ...n, dist: n.id === nodes[0].id ? 0 : Infinity })));

        const pq = [{ id: nodes[0].id, val: 0 }];
        const visited = new Set<number>();

        while (pq.length > 0) {
            checkStop(); // <--- STOP CHECK
            pq.sort((a, b) => a.val - b.val);
            const { id: u, val: d } = pq.shift()!;
            
            if (visited.has(u)) continue;
            visited.add(u);
            
            logStep(`📍 Processing Node ${u} (Dist: ${d})`);
            setHighlightedNodes([u]);
            setVisitedNodes(Array.from(visited));
            await wait(800 - speed * 6);

            const neighbors = edges.filter(e => e.from === u || e.to === u);
            for (const edge of neighbors) {
                checkStop(); // <--- STOP CHECK
                comps++;
                const v = edge.from === u ? edge.to : edge.from;
                if (visited.has(v)) { updateStats(comps, swaps); continue; }

                const newDist = d + edge.weight;
                if (newDist < dist[v]) {
                    dist[v] = newDist;
                    pq.push({ id: v, val: newDist });
                    swaps++; 
                    
                    logStep(`⚡ Update ${u}->${v} (New Dist: ${newDist})`);
                    setNodes(curr => curr.map(n => n.id === v ? { ...n, dist: newDist } : n));
                    const edgeIdx = edges.indexOf(edge);
                    setHighlightedEdges(prev => [...prev, edgeIdx]);
                    
                    updateStats(comps, swaps);
                    await wait(800 - speed * 6);
                } else {
                    updateStats(comps, swaps);
                }
            }
        }
        setHighlightedNodes([]);
        logStep("✅ Dijkstra Complete!");
    },

    runPrim: async (speed, logStep, updateStats, checkStop) => {
        if (nodes.length === 0) return;
        logStep("🚀 Starting Prim's MST...");
        let comps = 0, swaps = 0;

        const visited = new Set<number>([nodes[0].id]);
        setVisitedNodes([nodes[0].id]);
        const mstEdges: number[] = []; 
        swaps++; 
        updateStats(comps, swaps);
        
        while (visited.size < nodes.length) {
            checkStop(); // <--- STOP CHECK
            let minEdge: Edge | null = null;
            let minWeight = Infinity;
            let minEdgeIdx = -1;

            for (let i = 0; i < edges.length; i++) {
                comps++;
                const e = edges[i];
                const uVisited = visited.has(e.from);
                const vVisited = visited.has(e.to);
                if ((uVisited && !vVisited) || (!uVisited && vVisited)) {
                    if (e.weight < minWeight) {
                        minWeight = e.weight;
                        minEdge = e;
                        minEdgeIdx = i;
                    }
                }
            }
            updateStats(comps, swaps);

            if (minEdge) {
                const newNode = visited.has(minEdge.from) ? minEdge.to : minEdge.from;
                visited.add(newNode);
                mstEdges.push(minEdgeIdx);
                swaps++; 

                logStep(`🔗 Connected Edge ${minEdge.from}-${minEdge.to}`);
                setVisitedNodes(Array.from(visited));
                setHighlightedEdges([...mstEdges]);
                
                updateStats(comps, swaps);
                await wait(800 - speed * 6);
            } else {
                break;
            }
        }
        logStep("✅ Prim's MST Complete!");
    }
  }));

  // Render Logic
  const handleCanvasClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (nodes.some(n => Math.hypot(n.x - x, n.y - y) < 45)) return;
    setNodes([...nodes, { id: nextId.current++, x, y, dist: Infinity }]);
  };

  const handleNodeClick = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (activeNode === null) {
      setActiveNode(id);
    } else {
      if (activeNode !== id) {
          const exists = edges.some(e => (e.from === activeNode && e.to === id) || (e.from === id && e.to === activeNode));
          if (!exists) setEdges([...edges, { from: activeNode, to: id, weight: Math.floor(Math.random() * 5) + 1 }]);
      }
      setActiveNode(null);
    }
  };

  return (
    <div onClick={handleCanvasClick} className="w-full h-full relative bg-[#0b0f19] cursor-crosshair overflow-hidden shadow-inner font-sans">
      <div className="absolute top-4 left-4 text-xs font-mono text-slate-500 pointer-events-none select-none bg-black/40 px-3 py-1 rounded-full border border-white/5">
        Click to add Node • Click two nodes to connect • Edges have random weights
      </div>
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge, idx) => {
          const n1 = nodes.find(n => n.id === edge.from)!;
          const n2 = nodes.find(n => n.id === edge.to)!;
          const isHigh = highlightedEdges.includes(idx);
          const midX = (n1.x + n2.x) / 2;
          const midY = (n1.y + n2.y) / 2;
          return (
            <g key={`${edge.from}-${edge.to}`}>
                <motion.line initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                stroke={isHigh ? "#facc15" : "#334155"} strokeWidth={isHigh ? 4 : 2} />
                <circle cx={midX} cy={midY} r="9" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                <text x={midX} y={midY} dy="3" textAnchor="middle" fontSize="10" fill="#94a3b8" fontWeight="bold">{edge.weight}</text>
            </g>
          );
        })}
      </svg>
      {nodes.map(node => {
        const isVisited = visitedNodes.includes(node.id);
        const isActive = highlightedNodes.includes(node.id);
        const isSelected = activeNode === node.id;
        return (
            <motion.div key={node.id} initial={{ scale: 0 }} animate={{ scale: 1 }}
            className={`absolute w-12 h-12 rounded-full flex flex-col items-center justify-center font-bold border-[3px] transition-all cursor-pointer z-10 select-none shadow-xl
                ${isActive ? 'bg-orange-500 border-orange-300 text-black scale-110 shadow-[0_0_20px_rgba(249,115,22,0.6)]' : 
                  isVisited ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-white hover:text-white'}
                ${isSelected ? 'ring-4 ring-white/30' : ''}`}
            style={{ left: node.x - 24, top: node.y - 24 }}
            onClick={(e) => handleNodeClick(e, node.id)}>
            <span className="text-sm">{node.id}</span>
            {node.dist !== undefined && node.dist !== Infinity && ( <span className="text-[9px] -mt-1 opacity-90 text-yellow-200">d:{node.dist}</span> )}
            </motion.div>
        )
      })}
    </div>
  );
});

export default GraphCanvas;