from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import SortingRun
from .serializers import SortingRunSerializer

@api_view(['GET'])
def get_algorithms(request):
    data = [
        # --- GRAPH ALGORITHMS ---
        {
            "id": "bfs_graph", 
            "category": "Graph", 
            "name": "BFS (Traversal)", 
            "complexity": "O(V + E)", 
            "description": "Breadth-First Search explores all neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.", 
            "code": "def bfs(graph, start):\n  queue = [start]\n  visited.add(start)\n  while queue:\n    v = queue.pop(0)..."
        },
        {
            "id": "dijkstra", 
            "category": "Graph", 
            "name": "Dijkstra (Shortest Path)", 
            "complexity": "O(E + V log V)", 
            "description": "Finds the shortest path from a source node to all other nodes in a weighted graph.", 
            "code": "import heapq\ndef dijkstra(graph, start):\n  pq = [(0, start)]\n  dist = {node: float('inf')}\n  dist[start] = 0\n  while pq:\n    d, u = heapq.heappop(pq)..."
        },
        {
            "id": "prim", 
            "category": "Graph", 
            "name": "Prim's (Min Cost MST)", 
            "complexity": "O(E log V)", 
            "description": "Finds a Minimum Spanning Tree (MST) for a weighted undirected graph. Connects all nodes with minimum total edge weight.", 
            "code": "def prim(graph):\n  mst = []\n  visited = set([start])\n  edges = [(w, start, to) for to, w in graph[start]]\n  heapq.heapify(edges)..."
        },

        # --- SORTING ---
        {
            "id": "bubble", "category": "Sorting", "name": "Bubble Sort", "complexity": "O(n²)", "description": "Simple comparison-based sorting.", "code": "for i in range(n):\n  for j in range(0, n-i-1):\n    if arr[j] > arr[j+1]: swap()"
        },
        {
            "id": "quick", "category": "Sorting", "name": "Quick Sort", "complexity": "O(n log n)", "description": "Divide and conquer algorithm.", "code": "pivot = arr[high]\npartition(arr, low, high)..."
        },
        {
            "id": "merge", "category": "Sorting", "name": "Merge Sort", "complexity": "O(n log n)", "description": "Splits array in half and merges sorted halves.", "code": "mid = len(arr)//2\nmergeSort(left)\nmergeSort(right)..."
        },
        
        # --- SEARCHING ---
        {
            "id": "linear", "category": "Searching", "name": "Linear Search", "complexity": "O(n)", "description": "Checks every element one by one.", "code": "for i in range(n):\n  if arr[i] == target: return i"
        },
        {
            "id": "binary", "category": "Searching", "name": "Binary Search", "complexity": "O(log n)", "description": "Divides search interval in half. (Sorted array only)", "code": "while l <= r:\n  mid = l + (r-l)//2\n  if arr[mid] == x: return mid..."
        },
    ]
    return Response(data)

@api_view(['GET', 'POST'])
def sorting_runs(request):
    if request.method == 'GET':
        runs = SortingRun.objects.all().order_by('-timestamp')[:10]
        serializer = SortingRunSerializer(runs, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = SortingRunSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)