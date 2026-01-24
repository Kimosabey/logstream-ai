import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { logQueue } from './queue'; // This should work now

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 1. Define the Shape of a Log (Schema)
const LogSchema = z.object({
    service: z.string(),
    level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG']),
    message: z.string(),
    // FIX: Explicitly say keys are strings, values are any
    meta: z.record(z.string(), z.any()).optional() 
});

// 2. The Ingestion Endpoint
app.post('/api/logs', async (req, res) => {
    try {
        const validation = LogSchema.safeParse(req.body);

        if (!validation.success) {
             return res.status(400).json({ 
                 error: 'Invalid Log Format', 
                 details: validation.error 
            });
        }

        const logData = validation.data;

        const fullLog = {
            ...logData,
            timestamp: new Date().toISOString()
        };

        await logQueue.add('log-job', fullLog);

        console.log(`[Queued] Log from ${fullLog.service}`);

        return res.status(202).json({ status: 'queued' });

    } catch (error) {
        console.error('Queue Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Ingestion Engine running on http://localhost:${PORT}`);
});