import React, { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Clock, History, Play, StopCircle, Pause } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { SleepLog } from './types';
import { useBaby } from '../../services/BabyContext';

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

export const SleepFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, updateLog, logs } = useToolData<SleepLog>('sleep');
    const { activeBaby } = useBaby();
    const [_, setTick] = useState(0);

    // Filter logs for active baby
    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const latest = babyLogs.length > 0 ? babyLogs[0] : null;
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

        // Correctly update the specific log
        updateLog(l => l === latest, {
            endTime: end,
            durationMinutes: duration
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const formatDuration = (ms: number) => {
        const seconds = Math.floor(ms / 1000);
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate current duration if sleeping
    const currentDuration = isSleeping ? (Date.now() - latest.timestamp) : 0;

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Main Action Area */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8 min-h-[40vh]">

                {/* Status Text */}
                <div className="text-center">
                    <h3 className={`text-2xl font-bold mb-2 ${isSleeping ? 'text-indigo-300' : 'text-amber-200'}`}>
                        {isSleeping ? 'Durmiendo zZZ' : 'Despierto'}
                    </h3>
                    {isSleeping && (
                        <div className="text-6xl font-mono font-light text-white tracking-widest">
                            {formatDuration(currentDuration)}
                        </div>
                    )}
                </div>

                {/* Big Button */}
                <button
                    onClick={isSleeping ? handleWake : handleSleep}
                    className={`w-40 h-40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all transform active:scale-95 ${isSleeping
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-4 border-orange-200/20'
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-4 border-indigo-300/20'
                        }`}
                >
                    <div className="flex flex-col items-center gap-2">
                        {isSleeping ? <Sun size={48} fill="currentColor" /> : <Moon size={48} fill="currentColor" />}
                        <span className="font-bold text-lg uppercase tracking-widest">
                            {isSleeping ? 'Despertar' : 'Dormir'}
                        </span>
                    </div>
                </button>

                {/* Manual Add Button for lost sessions? (Future enhancement) */}

            </div>

            {/* History Layer */}
            <div className="bg-slate-900/50 rounded-t-[2rem] border-t border-white/5 p-6 flex-1 max-h-[50vh] overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Historial Reciente
                </h3>

                <div className="space-y-3">
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
                    {babyLogs.filter(l => l.endTime).length === 0 && <p className="text-sm text-slate-500 italic text-center">Sin registros</p>}
                </div>
            </div>
        </div>
    );
};
