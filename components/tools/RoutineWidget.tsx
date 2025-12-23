import React, { useState, useMemo, useEffect } from 'react';
import { Clock, Plus, Trash2, ArrowRight, Sun, Moon, Utensils, Play, Bath } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { useBaby } from '../../services/BabyContext';
import { useLanguage } from '../../services/LanguageContext';
import { RoutineLog } from './types';

// Helper to sort routines by time string "HH:MM"
const sortRoutines = (routines: RoutineLog[]) => {
    return [...routines].sort((a, b) => a.startTime.localeCompare(b.startTime));
};

export const RoutineDashboard: React.FC = () => {
    const { logs } = useToolData<RoutineLog>('routines');
    const { activeBaby } = useBaby();

    const babyRoutines = useMemo(() => {
        if (!activeBaby) return logs;
        // @ts-ignore
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const sorted = useMemo(() => sortRoutines(babyRoutines), [babyRoutines]);

    const [nextActivity, setNextActivity] = useState<RoutineLog | null>(null);

    useEffect(() => {
        if (sorted.length === 0) {
            setNextActivity(null);
            return;
        }

        const computeNext = () => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            // Find first activity that is AFTER current time
            const next = sorted.find(r => {
                const [h, m] = r.startTime.split(':').map(Number);
                const rMinutes = h * 60 + m;
                return rMinutes > currentMinutes;
            });

            // If none found, it means next is tomorrow (first of list)
            setNextActivity(next || sorted[0]);
        };

        computeNext();
        const interval = setInterval(computeNext, 60000); // Update every minute
        return () => clearInterval(interval);
    }, [sorted]);

    if (sorted.length === 0) return <span className="opacity-60">Sin rutina</span>;

    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                Siguiente <ArrowRight size={10} />
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-bold text-lg text-emerald-200">
                    {nextActivity ? nextActivity.startTime : '--:--'}
                </span>
                <span className="text-xs text-slate-300 truncate max-w-[80px]">
                    {nextActivity ? nextActivity.activity : ''}
                </span>
            </div>
        </div>
    );
};

export const RoutineFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs, removeLog } = useToolData<RoutineLog>('routines');
    const { activeBaby } = useBaby();

    const [showAdd, setShowAdd] = useState(false);

    // Inputs
    const [time, setTime] = useState('08:00');
    const [activity, setActivity] = useState('');
    const [icon, setIcon] = useState('Sun'); // Default generic

    const filteredLogs = useMemo(() => {
        if (!activeBaby) return logs;
        // @ts-ignore
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const sortedLogs = useMemo(() => sortRoutines(filteredLogs), [filteredLogs]);

    const handleSave = () => {
        if (!time || !activity) return;

        addLog({
            timestamp: Date.now(), // ID effectively
            startTime: time,
            activity,
            icon,
            // @ts-ignore
            babyId: activeBaby?.id
        });

        setShowAdd(false);
        setActivity('');
        setTime('09:00');
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Header */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bloques</span>
                    <span className="text-2xl font-bold text-white">{sortedLogs.length}</span>
                </div>
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className={`p-2 rounded-xl border transition-all ${showAdd ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-indigo-400'
                        }`}
                >
                    {showAdd ? <span className="text-xs font-bold px-2">Cerrar</span> : <Plus size={24} />}
                </button>
            </div>

            {/* Add Panel */}
            {showAdd && (
                <div className="p-4 bg-slate-800/80 border-b border-slate-700 animate-in slide-in-from-top-4 space-y-4 shrink-0">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Hora</label>
                            <input
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none text-center"
                            />
                        </div>
                        <div className="col-span-2 space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Actividad</label>
                            <input
                                type="text"
                                value={activity}
                                onChange={e => setActivity(e.target.value)}
                                placeholder="Ej: Baño, Siesta..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {['Sun', 'Moon', 'Utensils', 'Play', 'Bath'].map(i => (
                            <button
                                key={i}
                                onClick={() => setIcon(i)}
                                className={`p-2 rounded-lg border ${icon === i ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                            >
                                {i === 'Sun' && <Sun size={18} />}
                                {i === 'Moon' && <Moon size={18} />}
                                {i === 'Utensils' && <Utensils size={18} />}
                                {i === 'Play' && <Play size={18} />}
                                {i === 'Bath' && <Bath size={18} />}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!activity || !time}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm disabled:opacity-50"
                    >
                        Añadir Bloque
                    </button>
                </div>
            )}

            {/* Timeline List */}
            <div className="flex-1 overflow-y-auto p-4 relative">
                {/* Vertical Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-800" />

                {sortedLogs.length === 0 ? (
                    <div className="text-center py-20 opacity-30 flex flex-col items-center pl-8">
                        <Clock size={48} className="mb-4" />
                        <p className="text-sm">Configura tu día ideal.</p>
                    </div>
                ) : (
                    sortedLogs.map((log) => (
                        <div key={log.timestamp} className="relative pl-10 mb-6 group">
                            {/* Dot */}
                            <div className="absolute left-[27px] top-3 w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-900 z-10 group-hover:bg-indigo-500 transition-colors" />

                            {/* Card */}
                            <div className="bg-slate-800/40 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-bold text-white font-mono">{log.startTime}</span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-200">{log.activity}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeLog(l => l.timestamp === log.timestamp)}
                                    className="text-slate-600 hover:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
};
