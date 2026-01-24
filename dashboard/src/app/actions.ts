"use server";

import connectDB from "../lib/db";
import Log from "../models/Log";

export async function fetchDashboardData() {
  await connectDB();
  
  // 1. Fetch Logs (Limit 100 for performance)
  const logs = await Log.find({}).sort({ timestamp: -1 }).limit(100).lean();
  
  // 2. Fetch Stats
  const totalDocs = await Log.countDocuments();
  const errorCount = await Log.countDocuments({ level: "ERROR" });
  const warningCount = await Log.countDocuments({ level: "WARN" });
  const distinctServices = await Log.distinct("service");

  // 3. Chart Data
  const chartData = [
    { name: "INFO", value: await Log.countDocuments({ level: "INFO" }), color: "#6366f1" },
    { name: "WARN", value: warningCount, color: "#f59e0b" },
    { name: "ERROR", value: errorCount, color: "#ef4444" },
  ];

  // 4. Return Serialized Data
  return {
    logs: logs.map((log: any) => ({
      ...log,
      _id: log._id.toString(),
      timestamp: log.timestamp.toISOString(),
    })),
    stats: {
      total: totalDocs,
      errors: errorCount,
      warnings: warningCount,
      activeServices: distinctServices.length,
    },
    chartData
  };
}