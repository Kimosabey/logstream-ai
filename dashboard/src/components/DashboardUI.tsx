"use client";

import React, { useState, useMemo } from "react";
import ReactECharts from "echarts-for-react"; 
import { useQuery } from "@tanstack/react-query"; // The new power tool
import { motion, AnimatePresence } from "framer-motion";
import { 
  RefreshCw, ShieldAlert, Activity, Server, Zap, 
  Search, ChevronLeft, ChevronRight, ArrowUpDown, Loader2, Play, Pause
} from "lucide-react";
import { fetchDashboardData } from "../app/actions";

// --- Types ---
interface Log {
  _id: string;
  level: string;
  message: string;
  service: string;
  timestamp: string;
}

interface DashboardData {
  logs: Log[];
  stats: { total: number; errors: number; warnings: number; activeServices: number };
  chartData: { name: string; value: number; color: string }[];
}

export default function DashboardUI({ initialData }: { initialData: DashboardData }) {
  
  // --- STATE ---
  const [isAutoRefresh, setIsAutoRefresh] = useState(true); // Default ON
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [sortNewest, setSortNewest] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- REACT QUERY (The Senior Upgrade) ---
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['dashboard-data'],
    queryFn: fetchDashboardData,
    initialData: initialData, // Hydrate with server data immediately
    refetchInterval: isAutoRefresh ? 2000 : false, // Poll every 2s if Toggle is ON
  });

  // --- Logic: Filter -> Sort -> Paginate ---
  const filteredLogs = useMemo(() => {
    return data.logs.filter(log => {
      const matchesSearch = 
        log.message.toLowerCase().includes(search.toLowerCase()) || 
        log.service.toLowerCase().includes(search.toLowerCase());
      const matchesLevel = filterLevel === "ALL" || log.level === filterLevel;
      return matchesSearch && matchesLevel;
    }).sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortNewest ? dateB - dateA : dateA - dateB;
    });
  }, [data.logs, search, filterLevel, sortNewest]);

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // --- ECharts Config ---
  const getChartOption = () => ({
    tooltip: { trigger: 'axis', backgroundColor: '#fff', textStyle: { color: '#1e293b' } },
    grid: { top: '10%', left: '2%', right: '2%', bottom: '5%', containLabel: true },
    xAxis: { type: 'category', data: data.chartData.map(d => d.name), axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { type: 'value', splitLine: { lineStyle: { type: 'dashed', color: '#e2e8f0' } } },
    series: [{
      data: data.chartData.map(d => ({ value: d.value, itemStyle: { color: d.color, borderRadius: [6, 6, 0, 0] } })),
      type: 'bar', barWidth: '40%', showBackground: true, backgroundStyle: { color: '#f8fafc' }, animationDuration: 0 // Disable internal anim for smoother updates
    }]
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Zap className="text-white" size={20} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                LogStream<span className="text-indigo-600">AI</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
                <span className={`relative flex h-2 w-2`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isAutoRefresh ? 'bg-emerald-400' : 'bg-slate-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isAutoRefresh ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                </span>
                <p className="text-slate-500 text-sm font-medium">
                  {isAutoRefresh ? "Live Feed Active" : "Live Feed Paused"}
                </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            
            {/* AUTO REFRESH TOGGLE */}
            <div 
              onClick={() => setIsAutoRefresh(!isAutoRefresh)}
              className="flex items-center gap-2 cursor-pointer bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              <span className="text-xs font-bold text-slate-600 uppercase">Auto-Sync</span>
              <div className={`w-10 h-5 flex items-center bg-slate-300 rounded-full p-1 duration-300 ease-in-out ${isAutoRefresh ? 'bg-indigo-500' : ''}`}>
                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${isAutoRefresh ? 'translate-x-5' : ''}`}></div>
              </div>
            </div>

            {/* SYNC BUTTON */}
            <button 
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-sm font-semibold transition-all active:scale-95 disabled:opacity-70"
            >
              {isFetching ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} 
              {isFetching ? "Syncing..." : "Sync Now"}
            </button>
          </div>
        </header>

        {/* METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Ingestion" value={data.stats.total} icon={<Activity />} color="indigo" />
          <StatCard title="Critical Errors" value={data.stats.errors} icon={<ShieldAlert />} color="rose" active />
          <StatCard title="Warnings" value={data.stats.warnings} icon={<ShieldAlert />} color="amber" />
          <StatCard title="Active Services" value={data.stats.activeServices} icon={<Server />} color="emerald" />
        </section>

        {/* MAIN LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Log Distribution</h3>
              <div className="h-[300px]">
                <ReactECharts option={getChartOption()} style={{ height: '100%' }} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-8 space-y-4">
            {/* FILTERS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" placeholder="Search logs..." value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {['ALL', 'ERROR', 'WARN', 'INFO'].map(level => (
                  <button 
                    key={level} onClick={() => setFilterLevel(level)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${filterLevel === level ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                  >
                    {level}
                  </button>
                ))}
                <div className="w-px h-8 bg-slate-200 mx-2 hidden md:block"></div>
                <button onClick={() => setSortNewest(!sortNewest)} className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600">
                  <ArrowUpDown size={18} />
                </button>
              </div>
            </div>

            {/* LIVE TABLE */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-[500px] flex flex-col justify-between">
              <div>
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Level</th>
                      <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase">Service</th>
                      <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase w-full">Message</th>
                      <th className="px-6 py-4 font-semibold text-slate-500 text-xs uppercase whitespace-nowrap">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <AnimatePresence mode="popLayout"> 
                      {paginatedLogs.map((log) => (
                        <motion.tr 
                          layout 
                          key={log._id}
                          initial={{ opacity: 0, x: -20, backgroundColor: "#e0e7ff" }} 
                          animate={{ opacity: 1, x: 0, backgroundColor: "transparent" }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-indigo-50/30 transition-colors"
                        >
                          <td className="px-6 py-4"><Badge level={log.level} /></td>
                          <td className="px-6 py-4 font-medium text-slate-700">{log.service}</td>
                          <td className="px-6 py-4 text-slate-500">{log.message}</td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleTimeString('en-US')}
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {/* PAGINATION */}
              {paginatedLogs.length > 0 && (
                <div className="border-t border-slate-100 p-4 flex justify-between items-center bg-slate-50/50">
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium disabled:opacity-50">
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <span className="text-xs font-medium text-slate-500">Page <span className="text-slate-900">{currentPage}</span> of {totalPages}</span>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium disabled:opacity-50">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---
const Badge = ({ level }: { level: string }) => {
  const styles: any = { ERROR: "bg-rose-50 text-rose-600 ring-rose-500/20", WARN: "bg-amber-50 text-amber-600 ring-amber-500/20", INFO: "bg-indigo-50 text-indigo-600 ring-indigo-500/20", DEBUG: "bg-slate-50 text-slate-600 ring-slate-500/20" };
  return <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ring-1 ring-inset ${styles[level] || styles.INFO}`}>{level}</span>;
};

const StatCard = ({ title, value, icon, color, active }: any) => {
  const colors: any = { indigo: "text-indigo-600 bg-indigo-50", rose: "text-rose-600 bg-rose-50", amber: "text-amber-600 bg-amber-50", emerald: "text-emerald-600 bg-emerald-50" };
  return (
    <div className={`p-5 bg-white border rounded-2xl shadow-sm hover:shadow-md transition-all ${active ? 'border-rose-100 ring-2 ring-rose-50' : 'border-slate-200'}`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>{React.cloneElement(icon, { size: 24 })}</div>
        <div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">{typeof value === 'number' ? value.toLocaleString('en-US') : value}</h3>
        </div>
      </div>
    </div>
  );
};