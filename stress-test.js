const axios = require('axios'); // We need to install this momentarily

const API_URL = 'http://localhost:3000/api/logs';
const TOTAL_REQUESTS = 500;

const services = ['order-service', 'payment-service', 'user-service', 'inventory-service'];
const levels = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

const getRandomLog = () => ({
    service: services[Math.floor(Math.random() * services.length)],
    level: levels[Math.floor(Math.random() * levels.length)],
    message: `Stress test log entry #${Math.floor(Math.random() * 10000)}`,
    meta: { loadTest: true, requestId: Math.random().toString(36).substring(7) }
});

async function runStressTest() {
    console.log(`🚀 Starting Stress Test: ${TOTAL_REQUESTS} requests...`);
    const startTime = Date.now();
    
    const promises = [];

    for (let i = 0; i < TOTAL_REQUESTS; i++) {
        promises.push(
            axios.post(API_URL, getRandomLog())
                .catch(err => console.error("Request failed"))
        );
    }

    // Wait for all HTTP requests to finish
    await Promise.all(promises);

    const duration = (Date.now() - startTime) / 1000;
    console.log(`✅ Sent ${TOTAL_REQUESTS} requests in ${duration} seconds.`);
    console.log(`⚡ Rate: ~${Math.round(TOTAL_REQUESTS / duration)} req/sec`);
    console.log(`👉 Check your Worker terminal to see them flushing in batches!`);
}

runStressTest();