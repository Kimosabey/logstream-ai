# 📊 LogStream AI: Data Flow Architecture

This diagram represents the high-throughput ingestion pipeline, demonstrating how data moves from the source to the dashboard.

```mermaid
graph TD
    %% Nodes
    Client[🚀 Traffic Simulator]
    API[⚙️ Ingestion API (Node/Express)]
    Queue[📦 Redis Queue (BullMQ)]
    Worker[👷 Worker Service]
    DB[(🍃 MongoDB)]
    Dashboard[💻 Next.js Dashboard]

    %% Flows
    Client -->|HTTP POST /api/logs| API
    API -->|Validate & Enqueue Job| Queue
    
    subgraph "Async Processing"
    Queue -->|Pull Job| Worker
    Worker -->|Buffer 50 Logs| Worker
    Worker -->|Batch Write (insertMany)| DB
    end

    subgraph "Observability"
    Dashboard -->|Server Action Query| DB
    Dashboard -->|Render Charts & Tables| Client
    end

    %% Styling
    style Client fill:#f9f,stroke:#333,stroke-width:2px
    style Queue fill:#ff9,stroke:#333,stroke-width:2px
    style DB fill:#9f9,stroke:#333,stroke-width:2px