const axios = require('axios');

const API_URL = 'http://localhost:3000/api/logs';

// 🏢 The Ecosystem
const SERVICES = [
    'auth-service', 
    'payment-service', 
    'order-service', 
    'inventory-service', 
    'notification-service'
];

// 🚦 Weighted Levels (More INFOs, fewer ERRORs)
const LEVELS = [
    'INFO', 'INFO', 'INFO', 'INFO', 'INFO', 
    'WARN', 'WARN', 
    'ERROR', 
    'DEBUG'
];

// 💬 Realistic Messages based on Service & Level
const MESSAGES = {
    'auth-service': {
        'INFO': ['User login successful', 'Token refreshed', 'Logout initiated'],
        'WARN': ['Multiple failed login attempts', 'Token expiring soon'],
        'ERROR': ['Database connection timeout', 'Invalid API Key', 'User account locked'],
        'DEBUG': ['Payload size: 12kb', 'Latency: 45ms']
    },
    'payment-service': {
        'INFO': ['Payment processed', 'Refund initiated', 'Invoice generated'],
        'WARN': ['High latency detected in gateway', 'Currency conversion warning'],
        'ERROR': ['Payment Gateway 502 Bad Gateway', 'Insufficient Funds', 'Fraud detection triggered'],
        'DEBUG': ['Transaction ID: tx_99283', 'Webhook received']
    },
    'order-service': {
        'INFO': ['Order placed', 'Order shipped', 'Order delivered'],
        'WARN': ['Low stock warning', 'Shipping address validation failed'],
        'ERROR': ['Inventory sync failed', 'Order cancellation error'],
        'DEBUG': ['SKU list lookup', 'Cart items: 5']
    },
    'inventory-service': {
        'INFO': ['Stock updated', 'New shipment received'],
        'WARN': ['Stock below threshold (SKU-123)', 'Shelf alignment error'],
        'ERROR': ['Warehouse API unreachable', 'Database deadlock detected'],
        'DEBUG': ['Cycle count initiated']
    },
    'notification-service': {
        'INFO': ['Email sent', 'Push notification dispatched'],
        'WARN': ['Email bounce detected', 'Rate limit approaching'],
        'ERROR': ['SMTP Server Timeout', 'SMS Provider Down'],
        'DEBUG': ['Template ID: welcome_email_v2']
    }
};

// 🎲 Random Generator
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateLog = () => {
    const service = pick(SERVICES);
    const level = pick(LEVELS);
    
    // Get a message relevant to the service and level, or a generic one
    const serviceMessages = MESSAGES[service][level] || ['Generic system event'];
    const message = pick(serviceMessages);

    return {
        service,
        level,
        message,
        meta: {
            nodeId: `node-${Math.floor(Math.random() * 5)}`,
            memoryUsage: `${Math.floor(Math.random() * 80) + 20}%`,
            latencyMs: Math.floor(Math.random() * 500)
        }
    };
};

// 🚀 The Loop
async function simulateTraffic() {
    console.log("🌊 Starting Real-Time Traffic Simulation...");
    console.log("Press Ctrl + C to stop.");

    // Send a request every 100ms (10 requests/second)
    setInterval(async () => {
        const log = generateLog();
        try {
            await axios.post(API_URL, log);
            
            // Print nice output to terminal
            const color = log.level === 'ERROR' ? '\x1b[31m' : // Red
                          log.level === 'WARN' ? '\x1b[33m' : // Yellow
                          '\x1b[32m'; // Green
            
            console.log(`${color}[${log.level}] \x1b[0m ${log.service}: ${log.message}`);
        } catch (err) {
            console.error("❌ API Error - Is the server running?");
        }
    }, 100); 
}

simulateTraffic();