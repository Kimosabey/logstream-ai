import mongoose from 'mongoose';

// 1. Connect to MongoDB (using Docker service name or localhost)
export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/logstream');
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// 2. Define Schema
const logSchema = new mongoose.Schema({
    service: String,
    level: String,
    message: String,
    meta: Object,
    timestamp: Date
});

// 3. Create Model
export const LogModel = mongoose.model('Log', logSchema);