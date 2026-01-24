import { Queue } from 'bullmq';

// "log-queue" is the name of the bucket in Redis where we dump jobs
export const logQueue = new Queue('log-queue', {
    connection: {
        host: 'localhost',
        port: 6379 
    }
});