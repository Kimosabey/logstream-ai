# 📘 LogStream AI: The Master Manual

## 🎯 1. Project Objective & Purpose
**Why did we build this?**

### The Problem
In real-world apps (like Amazon or Netflix), millions of users click buttons at the same time. If the server tries to write every click to the database immediately, **the database will crash** (catch fire 🔥). It cannot handle that much speed.

### The Solution (Our Objective)
To build a **"Shock Absorber" System**.
We created a system that can accept **10,000 requests per second** without crashing. We do this by putting a "Buffer" (Queue) in the middle.

### The Real-World Use Case
*   **Cybersecurity:** Storing hacker attack logs instantly.
*   **E-Commerce:** Tracking items added to carts during a Flash Sale (Black Friday).
*   **IoT:** Gathering data from thousands of sensors in a factory.

---

## 🍕 2. The Story: Explain Like I'm 5 (The Pizza Shop)
To understand how it works, imagine a **Super Fast Pizza Shop**.

1.  **The Customer (Traffic Simulator):**
    You have a robot outside screaming "I WANT PIZZA!" 100 times a second. These are your **Logs**.

2.  **The Receptionist (Ingestion API):**
    This is the person at the front counter. They **do not** cook the pizza. They just grab the order ticket, say "GOT IT!", and throw it into a basket. This makes the customers happy because they don't have to wait.

3.  **The Basket (Redis Queue):**
    This is where the tickets wait. If the kitchen is slow, the tickets just line up here safely. They never get lost.

4.  **The Smart Chef (Worker Service):**
    This chef is a genius. Instead of cooking 1 pizza at a time, he waits until he has **50 tickets**. Then, he throws 50 pizzas into the oven at the same time. This is called **Batching**. It makes the kitchen super fast.

5.  **The Archive (MongoDB):**
    Once the pizzas are sold, we write the record in a permanent book in the basement. This is your **Database**.

6.  **The TV Screen (Dashboard):**
    The manager (You) has a TV on the wall. It reads the book and shows a live chart: "We sold 5,000 pizzas today!"

---

## 🛠️ 3. Complete Tech Stack Report
*Use this list when explaining the project in an interview.*

### ⚙️ Backend (The Engine)
| Technology | Role | Why we used it? |
| :--- | :--- | :--- |
| **Node.js** | **Runtime** | It handles thousands of requests at once without freezing (Non-blocking). |
| **Express.js** | **API Framework** | It acts as the "Receptionist". It catches the HTTP requests easily. |
| **TypeScript** | **Language** | It prevents bugs. It makes sure we don't send a Number when we expect a String. |
| **Zod** | **Validation** | The "Bouncer". It checks every log to make sure it has the right data before letting it in. |

### 📦 Data & Speed (The Plumbing)
| Technology | Role | Why we used it? |
| :--- | :--- | :--- |
| **Redis** | **Message Broker** | The "Buffer". It runs in RAM (Memory), so it is 100x faster than a hard drive. It saves data instantly so we never crash. |
| **BullMQ** | **Queue Manager** | The "Line Manager". It organizes the Redis data into a neat line (First In, First Out). |
| **MongoDB** | **Database** | The "Archive". A NoSQL database is perfect for logs because logs are just text (JSON). |
| **Mongoose** | **Connector** | The "Translator". It helps our Node.js code talk to MongoDB easily. |

### 💻 Frontend (The Dashboard)
| Technology | Role | Why we used it? |
| :--- | :--- | :--- |
| **Next.js 14** | **Framework** | We used "Server Actions" to fetch data securely from the database. |
| **TanStack Query** | **State Manager** | The "Auto-Refresher". It keeps checking for new data automatically so the screen is always live. |
| **Apache ECharts** | **Charts** | Used to draw the beautiful bar charts. It handles lots of data very fast. |
| **Framer Motion** | **Animation** | Used to make the table rows slide in smoothly. |
| **Tailwind CSS** | **Styling** | Used to make the "Glassmorphism" look (Modern UI) quickly. |

---

## 🗺️ 4. The Map (Ports & Addresses)
Every service lives at a specific "House Number" (Port).

| Service | Address | Description |
| :--- | :--- | :--- |
| **Ingestion API** | `localhost:3000` | The entry point. Send data here. |
| **Dashboard** | `localhost:3001` | The UI. View data here. |
| **Redis** | `localhost:6379` | Runs in Docker. Stores temporary data. |
| **MongoDB** | `127.0.0.1:27017` | Runs locally on Windows. Stores permanent data. |

---

## 🚀 5. How to Start Everything (Launch Order)
*Order is important because the API needs to grab Port 3000 first!*

1.  **Start Infrastructure:**
    *   **Redis:** `docker-compose up -d`
    *   **MongoDB:** Ensure Windows Service is Running.

2.  **Start the Code (The Staff):**
    *   **Step A (API):** `cd ingestion-api` -> `npm run dev`
    *   **Step B (Dashboard):** `cd dashboard` -> `npm run dev`
    *   **Step C (Worker):** `cd log-worker` -> `npm run dev`

3.  **Start the Traffic (The Customer):**
    *   `node traffic-simulator.js`

---

## 🩺 6. Health Checks (Troubleshooting)
*If it breaks, check these things:*

1.  **Is Redis running?**
    *   Run `docker ps` and look for `0.0.0.0:6379`.
2.  **Is MongoDB running?**
    *   Open MongoDB Compass and connect to `mongodb://127.0.0.1:27017`.
3.  **Is the API running?**
    *   Open `http://localhost:3000/health` in your browser.
4.  **Is data moving?**
    *   Look at the Worker terminal. It should say `🔥 FLUSHED`.

---
*Project Architected by Harshan Aiyappa.*