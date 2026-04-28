import React, { useState, useMemo } from 'react';
import { Droplets, Minus, Plus, Activity, Calendar, Play, StopCircle, Clock, Package } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { PumpingLog } from './types';

export const PumpingDashboard: React.FC = () => {
    const { logs } = useToolData<PumpingLog>('pumping');

    // Recent 24h total
    const total24h = useMemo(() => {
        const cutoff = Date.now() - 24 * 60 * 60 * 1000;
        return logs
            .filter(l => l.timestamp > cutoff)
            .reduce((acc, curr) => acc + (curr.amountMl || 0), 0);
    }, [logs]);

    // Stock calculation (Total since ever - what might have been used if we had bottle tracking sync)
    // For now, just sum all logs as "Stock Available" (simplified)
    const stockTotal = useMemo(() => {
        return logs.reduce((acc, curr) => acc + (curr.amountMl || 0), 0);
    }, [logs]);

    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <span className="font-bold text-violet-200">
                    {total24h} ml
                </span>
                <div className="text-[9px] font-black text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-1 rounded">
                    <Package size={8} /> {stockTotal}
                </div>
            </div>
            <span className="text-[10px] opacity-70">
                24h / Stock total
            </span>
        </div>
    );
};

export const PumpingFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs, removeLog } = useToolData<PumpingLog>('pumping');
    const [amount, setAmount] = useState(100);
    const [side, setSide] = useState<'left' | 'right' | 'double'>('double');
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [seconds, setSeconds] = useState(0);

    React.useEffect(() => {
        let interval: number;
        if (isTimerRunning) {
            interval = window.setInterval(() => setSeconds(s => s + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const handleSave = () => {
        addLog({
            timestamp: Date.now(),
            durationSeconds: 0, // Not relevant as per user
            amountMl: amount,
            side: side
        });
        if (navigator.vibrate) navigator.vibrate(50);
        // Reset or Close? Usually nice to keep open for stats, but "Save" implies done. 
        // Let's reset but keep open to see chart update? Or close.
        // Dashboard usually closes on save.
        onClose();
    };

    // Stats Calculation
    const { stat24h, stat3d, stat7d, dailyChart } = useMemo(() => {
        const now = Date.now();
        const oneDay = 24 * 3600 * 1000;

        const sumAmounts = (filterFn: (l: PumpingLog) => boolean) =>
            logs.filter(filterFn).reduce((acc, l) => acc + l.amountMl, 0);

        const s24h = sumAmounts(l => l.timestamp > now - oneDay);
        const s3d = sumAmounts(l => l.timestamp > now - 3 * oneDay); // Total in last 3 days
        const s7d = sumAmounts(l => l.timestamp > now - 7 * oneDay); // Total in last 7 days

        // Last 10 days evolution
        const chart = [];
        for (let i = 9; i >= 0; i--) {
            const dayStart = new Date();
            dayStart.setDate(dayStart.getDate() - i);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(dayStart);
            dayEnd.setHours(23, 59, 59, 999);

            const dayLogs = logs.filter(l => l.timestamp >= dayStart.getTime() && l.timestamp <= dayEnd.getTime());

            let left = 0;
            let right = 0;

            dayLogs.forEach(l => {
                const val = l.amountMl;
                if (l.side === 'left') left += val;
                else if (l.side === 'right') right += val;
                else {
                    left += val / 2;
                    right += val / 2;
                }
            });

            chart.push({
                date: dayStart.getDate(), // Day of month
                dayName: dayStart.toLocaleDateString([], { weekday: 'narrow' }),
                left,
                right,
                total: left + right
            });
        }

        return { stat24h: s24h, stat3d: s3d, stat7d: s7d, dailyChart: chart };
    }, [logs]);

    const maxChartVal = Math.max(...dailyChart.map(d => d.total), 100); // Scale

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">

            {/* Timer Section */}
            <div className="p-6 pb-2 flex flex-col items-center border-b border-white/5">
                <div className="text-4xl font-mono font-light text-violet-200 mb-4">{formatTime(seconds)}</div>
                <button 
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all ${isTimerRunning ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'}`}
                >
                    {isTimerRunning ? <StopCircle size={18} /> : <Play size={18} />}
                    {isTimerRunning ? 'Parar' : 'Iniciar Timer'}
                </button>
            </div>

            {/* Input Section */}
            <div className="p-6 pb-2 space-y-6">
                {/* Amount */}
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-4">Cantidad recolectada</span>
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setAmount(a => Math.max(0, a - 10))}
                            className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all"
                        >
                            <Minus size={20} />
                        </button>
                        <div className="text-center w-32">
                            <span className="text-5xl font-bold text-white tabular-nums">{amount}</span>
                            <span className="text-base font-bold text-slate-500 ml-1">ml</span>
                        </div>
                        <button
                            onClick={() => setAmount(a => a + 10)}
                            className="w-12 h-12 rounded-full bg-violet-600 text-white flex items-center justify-center hover:bg-violet-500 shadow-lg shadow-violet-900/50 active:scale-95 transition-all"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Breast Selection */}
                <div className="bg-slate-900 p-1.5 rounded-2xl flex relative">
                    {/* Sliding Background - Simplified with absolute positioning or just condtional styles */}
                    <button
                        onClick={() => setSide('left')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${side === 'left' ? 'bg-pink-500 text-white shadow-lg' : 'text-slate-500 hover:text-pink-400'}`}
                    >
                        Izq
                    </button>
                    <button
                        onClick={() => setSide('double')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${side === 'double' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
                    >
                        Ambos
                    </button>
                    <button
                        onClick={() => setSide('right')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${side === 'right' ? 'bg-purple-500 text-white shadow-lg' : 'text-slate-500 hover:text-purple-400'}`}
                    >
                        Der
                    </button>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-slate-200 text-slate-900 shadow-lg hover:bg-white transition-all active:scale-[0.98]"
                >
                    Guardar
                </button>
            </div>

            {/* Stats Cards */}
            <div className="px-6 py-4 grid grid-cols-2 gap-3">
                <div className="bg-slate-900 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">24h</span>
                    <span className="text-lg font-bold text-white">{stat24h}<span className="text-xs text-slate-500 ml-0.5">ml</span></span>
                </div>
                <div className="bg-slate-900 border border-white/5 p-3 rounded-xl flex items-center justify-between">
                    <span className="text-[10px] uppercase text-slate-500 font-bold">7 Días</span>
                    <span className="text-lg font-bold text-white">{stat7d}<span className="text-xs text-slate-500 ml-0.5">ml</span></span>
                </div>
                <div className="col-span-2 bg-slate-900 border border-white/5 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <span>Balance L/R (7d)</span>
                        <span className="text-white">
                            {Math.round((dailyChart.reduce((a,b)=>a+b.left,0) / (dailyChart.reduce((a,b)=>a+b.total,0) || 1)) * 100)}% / {Math.round((dailyChart.reduce((a,b)=>a+b.right,0) / (dailyChart.reduce((a,b)=>a+b.total,0) || 1)) * 100)}%
                        </span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                        <div className="h-full bg-pink-500" style={{ width: `${(dailyChart.reduce((a,b)=>a+b.left,0) / (dailyChart.reduce((a,b)=>a+b.total,0) || 1)) * 100}%` }}></div>
                        <div className="h-full bg-purple-500" style={{ width: `${(dailyChart.reduce((a,b)=>a+b.right,0) / (dailyChart.reduce((a,b)=>a+b.total,0) || 1)) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 px-6 pb-6 min-h-[200px]">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Evolución (10 días)</h3>
                <div className="h-40 flex items-end justify-between gap-2">
                    {dailyChart.map((d, i) => {
                        const heightPct = d.total > 0 ? (d.total / maxChartVal) * 100 : 0;
                        const leftShare = d.total > 0 ? (d.left / d.total) * 100 : 0;
                        const rightShare = d.total > 0 ? (d.right / d.total) * 100 : 0;

                        return (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-white/10">
                                    {Math.round(d.total)}ml (L:{Math.round(d.left)} R:{Math.round(d.right)})
                                </div>

                                <div className="w-full bg-slate-800 rounded-t-sm relative overflow-hidden" style={{ height: `${Math.max(heightPct, 2)}%` }}>
                                    <div
                                        className="absolute bottom-0 w-full bg-purple-500/80"
                                        style={{ height: `${rightShare}%` }}
                                    />
                                    <div
                                        className="absolute top-0 w-full bg-pink-500/80"
                                        style={{ height: `${leftShare}%` }}
                                    />
                                </div>
                                <span className={`text-[9px] font-bold ${i === 9 ? 'text-white' : 'text-slate-600'}`}>
                                    {d.dayName}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
