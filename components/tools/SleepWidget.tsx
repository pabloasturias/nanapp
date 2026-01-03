import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Clock, History, Play, StopCircle, Pause, Calendar, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { SleepLog } from './types';
import { useBaby } from '../../services/BabyContext';
import { TimelineChart } from './visualizations/TimelineChart';
import { useLanguage } from '../../services/LanguageContext';

export const SleepDashboard: React.FC = () => {
    const { logs } = useToolData<SleepLog>('sleep');
    const { activeBaby } = useBaby();

    const latest = useMemo(() => {
        if (!activeBaby) return logs[0];
        return logs.find(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const isSleeping = latest && !latest.endTime;

    // Force re-render
    const [, setTick] = useState(0);
    useEffect(() => {
        const i = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(i);
    }, []);

    const timeString = (ms: number) => {
        const mins = Math.floor(ms / 60000);
        const hours = Math.floor(mins / 60);
        if (hours > 0) return `${hours}h ${mins % 60}m`;
        return `${mins} min`;
    };

    if (isSleeping) {
        return (
            <div className="flex flex-col">
                <span className="font-bold text-indigo-200 flex items-center gap-1">
                    <Moon size={12} className="fill-current" />
                    Durmiendo
                </span>
                <span className="text-[10px] opacity-70">
                    Lleva {timeString(Date.now() - latest!.timestamp)}
                </span>
            </div>
        );
    }

    // Last sleep end time
    const lastSleepEnd = latest ? latest.endTime! : 0;
    const awakeTime = lastSleepEnd ? Date.now() - lastSleepEnd : 0;

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-amber-100 flex items-center gap-1">
                <Sun size={12} />
                Despierto
            </span>
            <span className="text-[10px] opacity-70">
                Hace {timeString(awakeTime)}
            </span>
        </div>
    );
};


const ManualEntryForm: React.FC<{ onClose: () => void; onSave: (start: number, end: number) => void }> = ({ onClose, onSave }) => {
    const [startStr, setStartStr] = useState('');
    const [endStr, setEndStr] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startStr || !endStr) return;
        const start = new Date(startStr).getTime();
        const end = new Date(endStr).getTime();
        if (end <= start) {
            alert('La hora de fin debe ser posterior a la de inicio');
            return;
        }
        onSave(start, end);
    };

    return (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col p-6 animate-in slide-in-from-bottom-10">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white">Añadir sueño pasado</h3>
                <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400">
                    <X size={20} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Inicio</label>
                    <input
                        type="datetime-local"
                        value={startStr}
                        onChange={e => setStartStr(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Fin</label>
                    <input
                        type="datetime-local"
                        value={endStr}
                        onChange={e => setEndStr(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="pt-4">
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all">
                        Guardar Registro
                    </button>
                </div>
            </form>
        </div>
    );
};

export const SleepFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, updateLog, logs } = useToolData<SleepLog>('sleep');
    const { activeBaby } = useBaby();
    const [_, setTick] = useState(0);
    const [viewDate, setViewDate] = useState(new Date()); // For chart navigation
    const [isAddingManual, setIsAddingManual] = useState(false);

    // Filter logs for active baby
    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const latest = babyLogs.length > 0 ? babyLogs[0] : null; // Assumes sorted desc? Usually yes from hooks but let's be safe if we rely on it. Hooks usually return sort by timestamp desc.
    const isSleeping = latest && !latest.endTime;

    // Timer ticker
    useEffect(() => {
        let interval: number;
        if (isSleeping) {
            interval = window.setInterval(() => setTick(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [isSleeping]);

    const handleSleep = () => {
        addLog({
            timestamp: Date.now(),
            type: 'nap',
            babyId: activeBaby?.id
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleWake = () => {
        if (!latest) return;
        const end = Date.now();
        const duration = Math.floor((end - latest.timestamp) / 60000);
        updateLog(l => l === latest, {
            endTime: end,
            durationMinutes: duration
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handleSaveManual = (start: number, end: number) => {
        addLog({
            timestamp: start,
            endTime: end,
            durationMinutes: Math.floor((end - start) / 60000),
            type: 'nap',
            babyId: activeBaby?.id
        });
        setIsAddingManual(false);
    };

    // Chart Data Prep
    const events = useMemo(() => {
        return babyLogs
            .filter(l => l.endTime) // Only completed logs for chart usually, or active one too? active one has no duration yet. TimelineChart handles?
            // TimelineChart expects durationSeconds.
            .map(l => ({
                timestamp: l.timestamp,
                durationSeconds: l.endTime ? (l.endTime - l.timestamp) / 1000 : undefined,
                color: 'bg-indigo-500',
                label: 'Sueño'
            }));
    }, [babyLogs]);

    // Add current sleep to events if sleeping?
    const chartEvents = useMemo(() => {
        const evs = [...events];
        if (isSleeping && latest) {
            evs.push({
                timestamp: latest.timestamp,
                durationSeconds: (Date.now() - latest.timestamp) / 1000,
                color: 'bg-indigo-400 border-2 border-indigo-200 border-dashed',
                label: 'Ahora'
            });
        }
        return evs;
    }, [events, isSleeping, latest, _]); // Depends on tick for duration update

    const changeDate = (days: number) => {
        const d = new Date(viewDate);
        d.setDate(d.getDate() + days);
        setViewDate(d);
    };

    const isToday = new Date().toDateString() === viewDate.toDateString();

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const currentDuration = isSleeping ? (Date.now() - latest!.timestamp) : 0;

    return (
        <div className="flex flex-col h-full bg-slate-950 relative">
            {isAddingManual && <ManualEntryForm onClose={() => setIsAddingManual(false)} onSave={handleSaveManual} />}

            {/* Top Section: Realtime Control */}
            <div className="flex-none p-6 pb-2 flex flex-col items-center justify-center space-y-6">
                {/* Timer Display */}
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-1 ${isSleeping ? 'text-indigo-300' : 'text-amber-200'}`}>
                        {isSleeping ? 'Durmiendo zZZ' : 'Despierto'}
                    </h3>
                    {isSleeping ? (
                        <div className="text-5xl font-mono font-light text-white tracking-widest">
                            {formatDuration(currentDuration)}
                        </div>
                    ) : (
                        <div className="h-12 flex items-center justify-center">
                            <button onClick={() => setIsAddingManual(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-full border border-slate-700 text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors">
                                <Calendar size={14} />
                                Añadir Pasado
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Toggle Button */}
                <button
                    onClick={isSleeping ? handleWake : handleSleep}
                    className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all transform active:scale-95 ${isSleeping
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-4 border-orange-200/20'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-4 border-indigo-300/20'
                        }`}
                >
                    <div className="flex flex-col items-center gap-1">
                        {isSleeping ? <Sun size={32} fill="currentColor" /> : <Moon size={32} fill="currentColor" />}
                        <span className="font-bold text-sm uppercase tracking-widest">
                            {isSleeping ? 'Despertar' : 'Dormir'}
                        </span>
                    </div>
                </button>
            </div>

            {/* Timeline / Stats Section */}
            <div className="flex-1 bg-slate-900/50 rounded-t-[2rem] border-t border-white/5 flex flex-col overflow-hidden">
                {/* Date Navigator */}
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <button onClick={() => changeDate(-1)} className="p-2 text-slate-400 hover:text-white"><ChevronLeft size={20} /></button>
                    <div className="text-center">
                        <span className="text-sm font-bold text-white block">
                            {isToday ? 'Hoy' : viewDate.toLocaleDateString([], { weekday: 'long', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Cronología</span>
                    </div>
                    <button onClick={() => changeDate(1)} disabled={isToday} className={`p-2 ${isToday ? 'text-slate-700' : 'text-slate-400 hover:text-white'}`}><ChevronRight size={20} /></button>
                </div>

                {/* Chart */}
                <div className="p-4" style={{ minHeight: '140px' }}>
                    <TimelineChart
                        events={chartEvents}
                        referenceDate={viewDate}
                        unit="24h"
                    />
                </div>

                {/* Trend Chart (7 Days) */}
                <div className="px-4 pb-4 border-b border-white/5 flex-none">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Tendencia (7 Días)
                    </h3>
                    <div className="h-24 bg-slate-900/30 rounded-xl border border-white/5 flex items-end justify-between p-2 px-2 gap-1.5">
                        {(() => {
                            // Generate last 7 days data
                            const days = [];
                            for (let i = 6; i >= 0; i--) {
                                const d = new Date();
                                d.setDate(d.getDate() - i);
                                d.setHours(0, 0, 0, 0);
                                const dayStart = d.getTime();
                                const dayEnd = dayStart + 86400000;

                                const dayLogs = babyLogs.filter(l =>
                                    l.endTime && l.timestamp >= dayStart && l.endTime <= dayEnd
                                );
                                const totalMinutes = dayLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
                                const hours = totalMinutes / 60;

                                days.push({ label: d.toLocaleDateString([], { weekday: 'narrow' }), hours });
                            }

                            const maxHours = Math.max(...days.map(d => d.hours), 14); // Scale to max or at least 14h

                            return days.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-1 flex-1 h-full justify-end">
                                    <div className="w-full bg-slate-800 rounded-sm relative group min-h-[4px]" style={{ height: `${(d.hours / maxHours) * 100}%` }}>
                                        <div className={`absolute inset-0 bg-indigo-500/50 rounded-sm group-hover:bg-indigo-400 transition-colors`} />
                                        {d.hours > 0 && <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-slate-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{d.hours.toFixed(1)}h</span>}
                                    </div>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold">{d.label}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Recent List (Scrollable) */}
                <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2 flex items-center gap-2">
                        <History size={12} />
                        Historial (Total)
                    </h3>
                    <div className="space-y-2">
                        {babyLogs.filter(l => l.endTime).map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                                        <Moon size={14} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">
                                            {formatDuration((log.endTime! - log.timestamp))}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                            {new Date(log.endTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-600">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
