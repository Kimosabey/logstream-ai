# LogStream AI

![Thumbnail](docs/assets/thumbnail.png)

## High-Throughput Log Ingestion & Observability with Redis Shock-Absorber

<div align="center">

![Status](https://img.shields.io/badge/Status-Production_Ready-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Pattern](https://img.shields.io/badge/Architecture-Shock_Absorber-FFD700?style=for-the-badge&logo=redis&logoColor=black)

</div>

**LogStream AI** is an enterprise-grade log ingestion platform designed to handle **10,000+ logs per second**. It utilizes a "Shock Absorber" architecture with **Redis (BullMQ)** to decouple high-concurrency ingestion from slow database writes, guaranteeing **<10ms latency** for applications while ensuring zero data loss during traffic spikes.

---

## 🚀 Quick Start

Launch the observability stack (Redis + MongoDB + Dashboard) in one command:

```bash
# 1. Start Infrastructure
docker-compose up -d

# 2. Start Services (Ingestion + Worker + UI)
npm install && npm run start:all
```

> **Detailed Setup**: See [GETTING_STARTED.md](./docs/GETTING_STARTED.md).

---

## 📸 Demo & Architecture

### Real-Time Log Dashboard
![Dashboard](docs/assets/dashboard.png)
*Live log analytics with severity-based visualization and instant search.*

### System Architecture
![Architecture](docs/assets/architecture.png)
*Event-Driven Pipeline: API -> Redis (Buffer) -> Worker (Batch) -> MongoDB.*

### The Ingestion Journey
![Workflow](docs/assets/workflow.png)
*Scaling to 10k RPS: How BullMQ manages the ingestion spike.*

> **Deep Dive**: See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for the BullMQ and Batching logic.

---

## ✨ Key Features

*   **⚡ Sub-10ms Ingestion**: Redis-backed write paths ensure the client never waits for DB operations.
*   **🛡️ Shock Absorber Pattern**: BullMQ manages high-volume bursts, preventing MongoDB saturation.
*   **📉 98% IOPS Reduction**: Intelligent batching logic writes thousands of logs in single bulk operations.
*   **📊 Live Search**: Instant Next.js log viewer with severity filtering and timestamp sorting.
*   **🐳 Fully Containerized**: One-click deployment for local and cloud infrastructure.

---

## 🏗️ The Protective Journey

How a log entry is handled under extreme load:

1.  **Emit**: App sends a log via POST to the LogStream API.
2.  **Queue**: API instantly pushes the log to **Redis (BullMQ)** and returns HTTP 202.
3.  **Buffer**: Logs accumulate in the high-speed Redis memory buffer.
4.  **Batch**: The background worker wakes up after 500ms or 1000 logs.
5.  **Persist**: A single bulk write operation commits the batch to **MongoDB**.
6.  **Broadcast**: Real-time updates are pushed to the dashboard via WebSockets/Actions.

---

## 📚 Documentation

| Document | Description |
| :--- | :--- |
| [**System Architecture**](./docs/ARCHITECTURE.md) | Redis patterns, BullMQ config, and Batching math. |
| [**Getting Started**](./docs/GETTING_STARTED.md) | Local installation, Environment, and Benchmark scripts. |
| [**Failure Scenarios**](./docs/FAILURE_SCENARIOS.md) | Handling Redis OOM, Worker crash, and DB recovery. |
| [**Interview Q&A**](./docs/INTERVIEW_QA.md) | "Why Redis over direct DB?", "How to scale BullMQ?". |

---

## 🔧 Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Ingestion API**| **Node.js (Express)** | Fast, non-blocking log intake. |
| **Worker Engine**| **TypeScript** | BullMQ Processor & Batch logic. |
| **Message Bus** | **Redis** | The "Shock Absorber" buffer. |
| **Storage** | **MongoDB** | Schema-less log repository. |
| **Dashboard** | **Next.js 14** | Real-time observability UI. |

---

## 👤 Author

**Harshan Aiyappa**  
Senior Full-Stack Hybrid AI Engineer  
Voice AI • Distributed Systems • Infrastructure

[![Portfolio](https://img.shields.io/badge/Portfolio-kimo--nexus.vercel.app-00C7B7?style=flat&logo=vercel)](https://kimo-nexus.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Kimosabey-black?style=flat&logo=github)](https://github.com/Kimosabey)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Harshan_Aiyappa-blue?style=flat&logo=linkedin)](https://linkedin.com/in/harshan-aiyappa)
[![X](https://img.shields.io/badge/X-@HarshanAiyappa-black?style=flat&logo=x)](https://x.com/HarshanAiyappa)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
