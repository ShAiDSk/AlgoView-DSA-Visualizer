
# AlgoView - Advanced DSA Visualizer 🚀

**AlgoView** is a powerful Full-Stack Data Structures and Algorithms (DSA) visualization platform. It allows users to visualize sorting, searching, and complex graph algorithms (like Dijkstra and BFS) in real-time with a modern, glassmorphism UI.

![AlgoView Dashboard](https://via.placeholder.com/1200x600?text=AlgoView+Dashboard+Screenshot)
*(Replace this link with a real screenshot of your app)*

## ✨ Features

### 🔹 Core Functionality
* **Multi-Category Support:** Visualize **Sorting**, **Searching**, and **Graph** algorithms.
* **Real-Time Execution Logs:** Watch the algorithm's decision-making process step-by-step in a terminal-style console.
* **Live Metrics:** Track **Comparisons**, **Swaps**, and **Execution Time** live.
* **History & Leaderboard:** Every run is saved to a persistent database (SQLite) via the Django backend.

### 🔹 Graph Engine (The "Ultra" Feature)
* **Interactive Canvas:** Click to create nodes, click two nodes to connect them.
* **Weighted Graphs:** Edges support random weights for advanced algorithms like Dijkstra.
* **Randomizer:** One-click "Shuffle" button to generate a random weighted network instantly.
* **Visualizers:**
    * **BFS (Breadth-First Search):** Traversal visualization.
    * **Dijkstra's Algorithm:** Shortest path finding with distance updates.
    * **Prim's Algorithm:** Minimum Spanning Tree (MST) construction.

### 🔹 Sorting & Searching
* **Sorting:** Bubble Sort, Quick Sort (visualized with animated bars).
* **Searching:** Linear Search, Binary Search (visualized with range narrowing).

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React (Vite) + TypeScript
* **Styling:** Tailwind CSS (Glassmorphism design)
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **HTTP Client:** Axios

### **Backend**
* **Framework:** Django (Python)
* **API:** Django REST Framework (DRF)
* **Database:** SQLite (Default)
* **CORS:** Django CORS Headers

---

## 🚀 Installation & Setup

Follow these steps to run the project locally on Linux, Mac, or Windows.

### **1. Clone the Repository**
```bash
git clone [https://github.com/ShAiDSk/AlgoView-DSA-Visualizer.git](https://github.com/ShAiDSk/AlgoView-DSA-Visualizer.git)
cd AlgoView-DSA-Visualizer
```

### **2. Backend Setup (Django)**

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install django djangorestframework django-cors-headers

# Run Migrations (Setup Database)
python3 manage.py makemigrations
python3 manage.py migrate

# Start the Server
python3 manage.py runserver
```

*The Backend will run at `http://127.0.0.1:8000/`*

### **3. Frontend Setup (React)**

Open a **new terminal** window (do not close the backend terminal).

```bash
# Navigate to frontend folder
cd frontend

# Install Node modules
npm install

# Start the Development Server
npm run dev
```

*The Frontend will run at `http://localhost:5173/`*

-----

## 🎮 How to Use

1.  **Open the App:** Go to `http://localhost:5173` in your browser.
2.  **Select an Algorithm:** Use the dropdown menu on the left sidebar.
3.  **Graph Mode:**
      * Select **BFS**, **Dijkstra**, or **Prim**.
      * **Click** on the empty space to add Nodes.
      * **Click two nodes** consecutively to draw an Edge.
      * Or click **Shuffle** to generate a random graph.
      * Click **Start** to watch the magic\!
4.  **Array Mode:**
      * Select **Bubble Sort** or **Binary Search**.
      * Adjust **Speed** and **Array Size** using the sliders.
      * Click **Start**.

-----

## 📂 Project Structure

```bash
AlgoView/
├── backend/                # Django Backend
│   ├── algo_api/           # API Logic (Views, Models, Serializers)
│   ├── core/               # Project Settings
│   ├── db.sqlite3          # Database File
│   └── manage.py           # Django Entry Point
│
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── App.tsx         # Main Controller
│   │   ├── GraphCanvas.tsx # Graph Drawing Engine
│   │   ├── types.ts        # TypeScript Interfaces
│   │   └── main.tsx        # React Entry Point
│   ├── tailwind.config.js  # Styling Config
│   └── package.json        # Dependencies
│
└── README.md               # Documentation
```

## 🤝 Contributing

Contributions are welcome\!

1.  Fork the repo.
2.  Create a feature branch (`git checkout -b feature-name`).
3.  Commit your changes (`git commit -m "Added cool feature"`).
4.  Push to the branch (`git push origin feature-name`).
5.  Open a Pull Request.

## 🛡️ License

This project is open-source and available under the **MIT License**.

-----

**Made with 💙 by ShAiDSk on Kali Linux**

```
```