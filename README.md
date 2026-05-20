# M-Files Analytics & Dashboard Report Gateway

An elegant, configuration-driven real-time dashboard engine that connects directly to the M-Files Web Service (MFWS) REST API. It aggregates, traverses, and visualizes M-Files vault data using interactive and modern charts.

---

## 🚀 Key Features

* **Configuration-Driven Reporting**: Adding or modifying reports is as simple as updating a JSON configuration file (`config/reports.json`).
* **Hierarchical View Traversal**: Automatically and recursively crawls M-Files nested views, sub-views, virtual folders, and grouping levels (e.g., resolving paths like `/views/v124/v117/items` or `/views/v2/L8/items`).
* **Interactive Data Visualization**: Renders stunning responsive charts (Doughnut, Bar, Pie) powered by ApexCharts.
* **Dynamic Connection Manager**: Test and update vault endpoints, user credentials, and active reporting views directly from the UI dropdown lists (no manual ID editing).
* **Metadata Translator**: Automatically retrieves `/structure/classes` and `/structure/objecttypes` from the vault to map raw IDs to human-readable names (e.g., turning Class `31` into `"Employee"`).
* **Demo Sandbox Mode**: Play with simulated mock data instantly with a toggle switch, requiring no active connection or M-Files server.

---

## 🛠️ Architecture & Stack

### Backend (Node.js & Express)
* Located in the root directory.
* Fetches data recursively from M-Files REST endpoints using parallel traversal promises.
* Performs in-memory grouping, deduplication, and caching of vault metadata structure.
* Manages runtime authentication tokens to prevent "token storm" locks on concurrent queries.

### Frontend (Vue 3, Vite & Tailwind CSS)
* Located under `/frontend`.
* Features a sleek, modern dark-themed glassmorphism interface.
* Uses dynamic Axios requests to communicate with the local gateway server.

---

## ⚙️ Configuration Setup

Create a `.env` file in the root directory to set default connection values:

```env
MFWS_URL=http://localhost/REST
MFWS_USERNAME=Admin
MFWS_PASSWORD=your_password
MFWS_VAULT_GUID={CF1079B6-08D7-466D-868B-A2894F6F98FF}
PORT=3000
```

---

## 🏃 Getting Started

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v16+ recommended).

### 2. Install Dependencies
Run from the root directory to install backend and frontend packages:
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
npm run install:frontend
```

### 3. Run Development Servers
Start both the backend server (port `3000`) and Vite dev server (port `5173`) concurrently:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
To bundle the frontend assets for deployment:
```bash
npm run build
```

---

## 📊 Adding New Reports

Reports are configured inside [config/reports.json](config/reports.json). To add a report, append a new configuration object:

```json
{
  "id": "docs-by-views",
  "title": "Documents by Views",
  "type": "bar",
  "sourceViewId": "124",
  "groupBy": "views"
}
```

### Configuration Fields:
* `id`: Unique identifier for the endpoint.
* `title`: Title displayed on the card header.
* `type`: Chart visual style (`bar`, `pie`, `doughnut`).
* `sourceViewId`: The M-Files View ID containing folders/files to aggregate. If empty for `docs-by-views`, it crawls root level views.
* `groupBy`: The key to aggregate data by (`class`, `state`, `type`, or `views`).
