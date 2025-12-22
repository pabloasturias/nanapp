import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, History, Clock } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { BreastfeedingLog } from './types';
import { useLanguage } from '../../services/LanguageContext';

import { TimelineChart, TimeEvent } from './visualizations/TimelineChart';

// --- Dashboard Component (Small Card content) ---
export const BreastfeedingDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<BreastfeedingLog>('breastfeeding');
    const [latest, setLatest] = useState<BreastfeedingLog | null>(null);

    // Update latest on mount (and potentially poll or use context in future)
    useEffect(() => {
        setLatest(getLatestLog());
    }, [getLatestLog]);

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const timeSince = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);

        if (hours > 0) return `${hours}h ${mins % 60}m`;
        return `${mins} min`;
    };

    return (
        <div className="flex flex-col">
            <span className="font-bold text-pink-200">
                Lado {latest.side === 'L' ? 'Izq' : 'Der'}
            </span>
            <span className="text-[10px] opacity-70">
                Hace {timeSince(latest.timestamp)}
            </span>
        </div>
    );
};


// --- Full View Component (Modal Content) ---
export const BreastfeedingFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const { addLog, getLogsByDate, logs } = useToolData<BreastfeedingLog>('breastfeeding');

    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [side, setSide] = useState<'L' | 'R'>('L'); // Default Left, maybe should be 'last side inverted'?
    const [duration, setDuration] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    // Timer Logic
    useEffect(() => {
        if (isActive && !isPaused) {
            intervalRef.current = window.setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isActive, isPaused]);

    const handleStart = () => {
        if (!isActive) {
            setIsActive(true);
            setDuration(0);
            startTimeRef.current = Date.now();
        } else {
            setIsPaused(false);
        }
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleStop = () => {
        setIsActive(false);
        setIsPaused(false);

        if (startTimeRef.current && duration > 5) { // Only save if > 5 seconds
            addLog({
                side,
                durationSeconds: duration,
                manual: false
            });
        }
        setDuration(0);
        startTimeRef.current = null;
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // History
    const history = getLogsByDate(new Date());

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Timer Circle - Reduced height to fit chart */}
            <div className="flex-none flex flex-col items-center justify-center space-y-6 py-6 min-h-[35vh]">
                {/* ... existing timer code ... */}
                {/* Side Toggles */}
                <div className="flex gap-4 p-1 bg-slate-800 rounded-full border border-white/10">
                    <button
                        onClick={() => !isActive && setSide('L')}
                        className={`w-12 h-12 rounded-full font-bold flex items-center justify-center transition-all ${side === 'L'
                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                        disabled={isActive}
                    >
                        L
                    </button>
                    <button
                        onClick={() => !isActive && setSide('R')}
                        className={`w-12 h-12 rounded-full font-bold flex items-center justify-center transition-all ${side === 'R'
                            ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                        disabled={isActive}
                    >
                        R
                    </button>
                </div>

                {/* Main Timer Display */}
                <div className="relative">
                    <div className={`text-5xl font-mono font-light tracking-tighter ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {formatTime(duration)}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-6">
                    {isActive && !isPaused ? (
                        <button onClick={handlePause} className="p-4 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/50 hover:bg-amber-500/30 transition-all">
                            <Pause size={28} fill="currentColor" />
                        </button>
                    ) : (
                        <button onClick={handleStart} className="p-4 bg-pink-500 text-white rounded-full shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">
                            <Play size={28} fill="currentColor" className="ml-1" />
                        </button>
                    )}

                    {isActive && (
                        <button onClick={handleStop} className="p-4 bg-slate-800 text-slate-400 rounded-full border border-white/10 hover:text-red-400 hover:border-red-500/50 transition-all">
                            <Square size={20} fill="currentColor" />
                        </button>
                    )}
                </div>
            </div>

            {/* Visualizer & History */}
            <div className="bg-slate-900/50 rounded-t-[2rem] border-t border-white/5 p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="shrink-0 mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Resumen 24h
                    </h3>
                    <TimelineChart events={
                        logs.map(l => ({
                            timestamp: l.timestamp,
                            durationSeconds: l.durationSeconds,
                            color: l.side === 'L' ? 'bg-pink-500' : 'bg-purple-500',
                            label: l.side
                        }))
                    } />
                </div>

                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Hoy
                </h3>

                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No hay registros hoy</p>
                    ) : (
                        history.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-xs">
                                        {log.side}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-200">
                                            {formatTime(log.durationSeconds)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <Clock size={10} />
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
