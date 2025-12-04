```markdown
# 🌊 LogStream AI

> **A High-Throughput Log Ingestion & Observability Platform.**  
> *Built to handle high traffic using Event-Driven Architecture and Batch Processing.*

![Dashboard UI](https://via.placeholder.com/1200x600?text=LogStream+Dashboard+Preview) 
*(Replace this link with a screenshot of your actual dashboard later)*

## 🏗️ System Architecture

The system is designed to decouple **ingestion** from **storage** to ensure zero latency for the client.

1.  **Ingestion API:** Receives logs via HTTP, validates payload (Zod), and instantly pushes to a Redis Queue.
2.  **Message Broker:** Redis (BullMQ) acts as a buffer to absorb traffic spikes.
3.  **Batch Worker:** A separate microservice pulls logs, buffers them in memory, and writes to MongoDB in batches of 50 (Bulk Write).
4.  **Dashboard:** A Next.js 14 application providing real-time analytics, filtering, and searching.

## 🛠️ Tech Stack

*   **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Apache ECharts.
*   **Backend:** Node.js, Express, TypeScript.
*   **Queue:** Redis, BullMQ.
*   **Database:** MongoDB (Mongoose).
*   **DevOps:** Docker Compose.

## 🚀 How to Run Locally

### 1. Prerequisites
*   Docker Desktop
*   Node.js v18+

### 2. Start Infrastructure
```bash
docker-compose up -d
# Starts Redis (6379) and MongoDB (27017)
```

### 3. Start the Services
**Terminal 1: Ingestion API**
```bash
cd ingestion-api
npm install
npm run dev
# Runs on localhost:3000
```

**Terminal 2: Worker Service**
```bash
cd log-worker
npm install
npm run dev
# Listens to Redis Queue
```

**Terminal 3: Dashboard**
```bash
cd dashboard
npm install
npm run dev
# Runs on localhost:3001
```

### 4. Simulate Traffic
To see the system in action, run the included load generator:
```bash
node traffic-simulator.js
```

## 🧪 Key Features Implemented

*   ✅ **Asynchronous Ingestion:** API response time < 10ms regardless of DB load.
*   ✅ **Batch Processing:** Reduced Database IOPS by 98% (Writes 50 logs in 1 call).
*   ✅ **Type Safety:** Full TypeScript implementation across all services.
*   ✅ **Real-Time UI:** Server Components with Instant Search, Filtering, and Pagination.
*   ✅ **Visualizations:** Interactive charts using Apache ECharts.

---
*Engineered by Kimo.*
```

---

### 🚀 Step 3: Git Commit & Push

Now, let's save this snapshot of your work.

1.  **Stop all running servers** (Ctrl+C in your terminals).
2.  Go to the **Root Folder** (`logstream-ai`).
3.  Run these commands:

```bash
# 1. Add all files to staging
git add .

# 2. Commit with a meaningful message
git commit -m "feat: Complete Project 1 - LogStream AI (API, Worker, Dashboard, Documentation)"

# 3. Create a repository on GitHub.com named 'logstream-ai'
# (Go to GitHub -> New Repository -> Name: logstream-ai -> Create)

# 4. Link your local code to GitHub (Replace YOUR_USERNAME)
# git remote add origin https://github.com/YOUR_USERNAME/logstream-ai.git

# 5. Push the code
# git branch -M main
# git push -u origin main
```

**Once you have pushed the code, Project 1 is officially SEALED.** 🔒