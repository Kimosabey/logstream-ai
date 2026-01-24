import { Worker } from 'bullmq';
import { connectDB, LogModel } from './mongo';

const run = async () => {
    await connectDB();

    // Configuration
    const BATCH_SIZE = 50;
    const FLUSH_INTERVAL = 5000; // 5 seconds
    
    // State
    let logBuffer: any[] = [];
    let flushTimer: NodeJS.Timeout | null = null;

    // Helper: Write logs to DB
    const flushLogs = async () => {
        if (logBuffer.length === 0) return;

        const logsToSave = [...logBuffer];
        logBuffer = []; // Clear the buffer immediately

        try {
            await LogModel.insertMany(logsToSave);
            console.log(`🔥 FLUSHED: Saved ${logsToSave.length} logs to MongoDB`);
        } catch (err) {
            console.error('❌ Error saving batch:', err);
        }
    };

    const worker = new Worker('log-queue', async (job) => {
        // 1. Push to buffer
        logBuffer.push(job.data);
        console.log(`📥 Buffered: ${logBuffer.length}/${BATCH_SIZE}`);

        // 2. If buffer is full, write immediately
        if (logBuffer.length >= BATCH_SIZE) {
            if (flushTimer) clearTimeout(flushTimer);
            await flushLogs();
        } 
        // 3. If timer isn't running, start it (flush in 5s)
        else if (!flushTimer) {
            flushTimer = setTimeout(async () => {
                await flushLogs();
                flushTimer = null;
            }, FLUSH_INTERVAL);
        }

    }, {
        connection: { host: 'localhost', port: 6379 },
        concurrency: 5 
    });

    console.log('👷 Batch Worker is running...');
};

run();