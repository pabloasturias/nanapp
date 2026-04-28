import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Clock, History, Play, StopCircle, Pause, Calendar, ChevronLeft, ChevronRight, X, AlertCircle, Trash2, CheckCircle2, Music, Volume2 } from 'lucide-react';
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
    // Default to last 1 hour
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 3600000);

    const formatForInput = (d: Date) => {
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    const [startStr, setStartStr] = useState(formatForInput(oneHourAgo));
    const [endStr, setEndStr] = useState(formatForInput(now));

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

    const setQuickPreset = (hours: number) => {
        const endD = new Date();
        const startD = new Date(endD.getTime() - (hours * 3600000));
        setStartStr(formatForInput(startD));
        setEndStr(formatForInput(endD));
    };

    return (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col p-6 animate-[fade-in_0.2s]">
            <div className="bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl mt-10">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold text-white font-['Outfit']">Añadir Sueño Manual</h3>
                    <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Presets */}
                <div className="mb-6 flex gap-3">
                    <button onClick={() => setQuickPreset(0.5)} className="flex-1 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20">30 min</button>
                    <button onClick={() => setQuickPreset(1)} className="flex-1 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20">1 hora</button>
                    <button onClick={() => setQuickPreset(2)} className="flex-1 py-2 text-xs font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20">2 horas</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Inicio del sueño</label>
                        <input
                            type="datetime-local"
                            value={startStr}
                            onChange={e => setStartStr(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 shadow-inner"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fin del sueño</label>
                        <input
                            type="datetime-local"
                            value={endStr}
                            onChange={e => setEndStr(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 shadow-inner"
                            required
                        />
                    </div>

                    <div className="pt-6">
                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98] transition-all">
                            Guardar Registro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const SleepFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, updateLog, logs, removeLog } = useToolData<SleepLog>('sleep');
    const { activeBaby } = useBaby();
    const [_, setTick] = useState(0);
    const [viewDate, setViewDate] = useState(new Date());
    const [isAddingManual, setIsAddingManual] = useState(false);
    const [showWakeReason, setShowWakeReason] = useState(false);
    const [lastReason, setLastReason] = useState('');
    const [isNoisePlaying, setIsNoisePlaying] = useState(false);

    const WAKE_REASONS = [
        { id: 'hunger', label: 'Hambre', icon: '🍼' },
        { id: 'diaper', label: 'Pañal', icon: '💩' },
        { id: 'comfort', label: 'Consuelo', icon: '🫂' },
        { id: 'noise', label: 'Ruido', icon: '🔊' },
        { id: 'unknown', label: 'NS/NC', icon: '❓' }
    ];

    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const latest = babyLogs.length > 0 ? babyLogs[0] : null; 
    const isSleeping = latest && !latest.endTime;

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

    const handleWake = (reason?: string) => {
        if (!latest) return;
        const end = Date.now();
        const duration = Math.floor((end - latest.timestamp) / 60000);
        updateLog(l => l === latest, {
            endTime: end,
            durationMinutes: duration,
            quality: reason as any // We use quality field to store reason for now or add new field
        });
        setShowWakeReason(false);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const toggleNoise = () => {
        setIsNoisePlaying(!isNoisePlaying);
        if (navigator.vibrate) navigator.vibrate(10);
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

    const handleDelete = (timestamp: number) => {
        if(window.confirm("¿Seguro que quieres borrar este registro de sueño?")) {
            removeLog(l => l.timestamp === timestamp);
        }
    }

    const events = useMemo(() => {
        return babyLogs
            .filter(l => l.endTime)
            .map(l => ({
                timestamp: l.timestamp,
                durationSeconds: l.endTime ? (l.endTime - l.timestamp) / 1000 : undefined,
                color: 'bg-indigo-500',
                label: 'Sueño'
            }));
    }, [babyLogs]);

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
    }, [events, isSleeping, latest, _]);

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
        <div className="flex flex-col h-full bg-slate-950 relative overflow-y-auto">
            {isAddingManual && <ManualEntryForm onClose={() => setIsAddingManual(false)} onSave={handleSaveManual} />}

            {/* Top Section: Realtime Control */}
            <div className="flex-none p-6 pb-2 flex flex-col items-center justify-center space-y-6">
                <div className="text-center">
                    <h3 className={`text-xl font-bold mb-1 font-['Outfit'] ${isSleeping ? 'text-indigo-300' : 'text-amber-200'}`}>
                        {isSleeping ? 'Durmiendo zZZ' : 'Despierto'}
                    </h3>
                    {isSleeping ? (
                        <div className="text-6xl font-mono font-light text-white tracking-widest drop-shadow-md">
                            {formatDuration(currentDuration)}
                        </div>
                    ) : (
                        <div className="h-14 flex items-center justify-center">
                            <button onClick={() => setIsAddingManual(true)} className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-2xl border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-sm">
                                <Calendar size={14} />
                                Añadir Pasado
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={isSleeping ? () => setShowWakeReason(true) : handleSleep}
                        className={`w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all transform active:scale-95 ${isSleeping
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-4 border-orange-200/20'
                            : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-4 border-indigo-300/20'
                            }`}
                    >
                        <div className="flex flex-col items-center gap-1">
                            {isSleeping ? <Sun size={32} fill="currentColor" /> : <Moon size={32} fill="currentColor" />}
                            <span className="font-bold text-[10px] uppercase tracking-widest mt-1">
                                {isSleeping ? 'Despertar' : 'Dormir'}
                            </span>
                        </div>
                    </button>

                    <button 
                        onClick={toggleNoise}
                        className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border ${isNoisePlaying ? 'bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-900 border-white/5 text-slate-500'}`}
                    >
                        {isNoisePlaying ? <Volume2 size={20} className="animate-pulse" /> : <Music size={20} />}
                        <span className="text-[8px] font-bold uppercase">Ruido</span>
                    </button>
                </div>
            </div>

            {/* Wake Reason Modal */}
            {showWakeReason && (
                <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                    <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-2 text-center">¿Por qué se despertó?</h3>
                        <p className="text-xs text-slate-500 text-center mb-6">Esto ayuda a entender sus patrones de sueño</p>
                        
                        <div className="grid grid-cols-3 gap-3 mb-8">
                            {WAKE_REASONS.map(r => (
                                <button 
                                    key={r.id}
                                    onClick={() => handleWake(r.label)}
                                    className="aspect-square bg-slate-800 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-700 active:scale-95 transition-all border border-white/5"
                                >
                                    <span className="text-2xl">{r.icon}</span>
                                    <span className="text-[10px] font-bold text-slate-300 uppercase">{r.label}</span>
                                </button>
                            ))}
                        </div>
                        
                        <button onClick={() => setShowWakeReason(false)} className="w-full py-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Omitir</button>
                    </div>
                </div>
            )}

            {/* Timeline / Stats Section */}
            <div className="flex-1 bg-slate-900/50 rounded-t-[2.5rem] border-t border-white/5 flex flex-col overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <button onClick={() => changeDate(-1)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><ChevronLeft size={16} /></button>
                    <div className="text-center">
                        <span className="text-sm font-bold text-white block">
                            {isToday ? 'Hoy' : viewDate.toLocaleDateString([], { weekday: 'long', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Cronología</span>
                    </div>
                    <button onClick={() => changeDate(1)} disabled={isToday} className={`p-2 rounded-full ${isToday ? 'text-slate-700 bg-slate-800/30' : 'text-slate-400 hover:text-white bg-slate-800'}`}><ChevronRight size={16} /></button>
                </div>

                <div className="p-4" style={{ minHeight: '140px' }}>
                    <TimelineChart
                        events={chartEvents}
                        referenceDate={viewDate}
                        unit="24h"
                    />
                </div>

                <div className="px-6 pb-6 border-b border-white/5 flex-none">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        Tendencia (7 Días)
                    </h3>
                    <div className="h-28 bg-slate-900/50 rounded-2xl border border-white/5 flex items-end justify-between p-3 gap-2">
                        {(() => {
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

                            const maxHours = Math.max(...days.map(d => d.hours), 14);

                            return days.map((d, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                                    <div className="w-full max-w-[20px] bg-slate-800 rounded-t-sm relative group min-h-[4px]" style={{ height: `${(d.hours / maxHours) * 100}%` }}>
                                        <div className={`absolute inset-0 bg-indigo-500/60 rounded-t-sm group-hover:bg-indigo-400 transition-colors shadow-inner`} />
                                        {d.hours > 0 && <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-indigo-200 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-slate-800 px-1 rounded">{d.hours.toFixed(1)}h</span>}
                                    </div>
                                    <span className="text-[10px] text-slate-500 uppercase font-bold">{d.label}</span>
                                </div>
                            ));
                        })()}
                    </div>
                </div>

                {/* Recent List */}
                <div className="flex-1 px-6 pb-6 mt-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={12} />
                        Historial (Total)
                    </h3>
                    <div className="space-y-3 pb-8">
                        {babyLogs.filter(l => l.endTime).length === 0 && !isSleeping ? (
                             <div className="flex flex-col items-center justify-center py-8 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                     <Moon size={24} className="text-slate-500" />
                                 </div>
                                 <p className="text-slate-400 font-bold">Sin registros de sueño</p>
                             </div>
                        ) : (
                            babyLogs.filter(l => l.endTime).map((log, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-inner">
                                            <Moon size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                                {formatDuration((log.endTime! - log.timestamp))}
                                                <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wide">
                                                    {new Date(log.timestamp).toLocaleDateString() === new Date().toLocaleDateString() ? 'Hoy' : new Date(log.timestamp).toLocaleDateString([], {day:'2-digit', month:'2-digit'})}
                                                </span>
                                            </p>
                                            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Clock size={10} />
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(log.endTime!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDelete(log.timestamp)}
                                        className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
