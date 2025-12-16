export interface Algorithm {
  id: string;
  category: string;
  name: string;
  complexity: string;
  description: string;
  code: string;
}

export interface Node {
  id: number;
  x: number;
  y: number;
  dist?: number; // For Dijkstra
}

export interface Edge {
  from: number;
  to: number;
  weight: number;
}

export interface Stats {
  comparisons: number;
  swaps: number;
}

export interface SortingRun {
  id: number;
  algorithm: string;
  array_size: number;
  comparisons: number;
  swaps: number;
  timestamp: string;
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'info';
}

// ✅ UPDATED INTERFACE: Added updateStats callback
export interface GraphRef {
  reset: () => void;
  generateRandomGraph: () => void;
  runBFS: (speed: number, logStep: (msg: string) => void, updateStats: (c: number, s: number) => void) => Promise<void>;
  runDijkstra: (speed: number, logStep: (msg: string) => void, updateStats: (c: number, s: number) => void) => Promise<void>;
  runPrim: (speed: number, logStep: (msg: string) => void, updateStats: (c: number, s: number) => void) => Promise<void>;
}