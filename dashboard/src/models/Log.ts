import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  service: string;
  level: string;
  message: string;
  timestamp: Date;
  meta?: any;
}

const LogSchema = new Schema<ILog>({
  service: { type: String, required: true },
  level: { type: String, required: true },
  message: { type: String, required: true },
  meta: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now },
});

// Check if model exists before compiling (Next.js hot reload fix)
const Log = mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);

export default Log;