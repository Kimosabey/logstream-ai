# 🚀 Getting Started: LogStream AI

> Step-by-step guide to local deployment and ingestion simulation.

![Dashboard Preview](./assets/dashboard.png)

---

## 1. Prerequisites

The project is pre-configured to work with defaults, but you can override settings in `.env`.

**Standard `.env` Configuration**
```bash
# General
NODE_ENV=development
PORT=3000

# Redis (Queue)
REDIS_HOST=localhost
REDIS_PORT=6379

# MongoDB (Storage)
MONGO_URI=mongodb://localhost:27017/logstream
```

---

## 2. Installation & Quick Start

We need to launch the infrastructure and then the 3 microservices.

### Step 1: Start Infrastructure (Redis)
```bash
docker-compose up -d
# Verifying: docker ps should show port 6379 mapped
```
*Note: Ensure your local MongoDB service is running, or add mongo into docker-compose.*

### Step 2: Start Services (The "Staff")
It's best to run these in separate terminals to see the logs.

**Terminal A: Ingestion API**
```bash
cd ingestion-api
npm install
npm run dev
# Listen on: http://localhost:3000
```

**Terminal B: Worker Service**
```bash
cd log-worker
npm install
npm run dev
# You should see: "🚀 Worker connected to Redis..."
```

**Terminal C: Dashboard**
```bash
cd dashboard
npm install
npm run dev
# Open: http://localhost:3001
```

---

## 3. Running the Simulation
To see the system in action, use the included traffic generator.

```bash
# From the root directory
node traffic-simulator.js
```
*   Select `1` to send a burst of logs.
*   Watch **Terminal B** (Worker) processing the jobs.
*   Check **Terminal C** (Dashboard) to see real-time updates.

---

## 4. Running Tests

### Unit Tests
```bash
cd ingestion-api
npm run test
```

### Load Test
We use `stress-test.js` to simulate high load.
```bash
node stress-test.js
# Generates 1000 requests/sec to verify the "Shock Absorber" pattern.
```
