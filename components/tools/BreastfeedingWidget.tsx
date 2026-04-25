import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Square, History, Clock, Zap, Timer, Trash2, CheckCircle2 } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { BreastfeedingLog } from './types';
import { useLanguage } from '../../services/LanguageContext';
import { TimelineChart } from './visualizations/TimelineChart';
import { useBaby } from '../../services/BabyContext';

// --- Dashboard Component (Small Card content) ---
export const BreastfeedingDashboard: React.FC = () => {
    const { logs } = useToolData<BreastfeedingLog>('breastfeeding');
    const { t } = useLanguage();
    const { activeBaby } = useBaby();

    const latest = useMemo(() => {
        if (!logs.length) return null;
        if (!activeBaby) return logs[0];
        return logs.find(l => l.babyId === activeBaby.id) || logs.find(l => !l.babyId);
    }, [logs, activeBaby]);

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const timeSince = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        if (hours > 0) return `${hours}h ${mins % 60}m`;
        return `${mins} min`;
    };

    const nextSide = latest.side === 'L' ? 'R' : 'L';
    const nextSideLabel = nextSide === 'L' ? t('tool_bf_left') : t('tool_bf_right');
    const sideColor = nextSide === 'L' ? 'text-pink-300' : 'text-purple-300';

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-1 font-bold text-slate-300 mb-0.5">
                <span className="text-[10px] opacity-70 uppercase tracking-wider">{t('tool_bf_next')} </span>
                <span className={`${sideColor}`}>{nextSideLabel}</span>
            </div>
            <span className="text-[10px] opacity-50">
                {t('tool_bf_last')} {timeSince(latest.timestamp)} • {latest.side === 'L' ? t('tool_bf_left') : t('tool_bf_right')}
            </span>
        </div>
    );
};

// --- Full View Component (Modal Content) ---
export const BreastfeedingFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const { addLog, logs, removeLog } = useToolData<BreastfeedingLog>('breastfeeding');
    const { activeBaby } = useBaby();

    const [isTimerMode, setIsTimerMode] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    
    // Manual entry state
    const [isManualEntry, setIsManualEntry] = useState<'L' | 'R' | null>(null);
    const [manualMinutes, setManualMinutes] = useState(15);

    const [side, setSide] = useState<'L' | 'R'>('L');
    const [duration, setDuration] = useState(0);
    const startTimeRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    // Filter Logs for active Baby
    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    // Get Next Side Suggestion
    const latestLog = babyLogs.length > 0 ? babyLogs[0] : null;
    const recommendedSide = latestLog ? (latestLog.side === 'L' ? 'R' : 'L') : 'L';

    // Initialize side if not tracking
    useEffect(() => {
        if (!isActive) {
            setSide(recommendedSide);
        }
    }, [recommendedSide, isActive]);

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

    const handleStartTimer = (selectedSide: 'L' | 'R') => {
        setSide(selectedSide);
        setIsTimerMode(true);
        if (!isActive) {
            setIsActive(true);
            setDuration(0);
            startTimeRef.current = Date.now();
        } else {
            setIsPaused(false);
        }
    };

    const handleSaveManual = () => {
        if (!isManualEntry) return;
        addLog({
            side: isManualEntry,
            durationSeconds: manualMinutes * 60,
            manual: true,
            babyId: activeBaby?.id,
            timestamp: Date.now() - (manualMinutes * 60000) // Assumes it ended just now
        });
        if (navigator.vibrate) navigator.vibrate(50);
        setIsManualEntry(null);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleStop = () => {
        setIsActive(false);
        setIsPaused(false);
        setIsTimerMode(false);

        if (startTimeRef.current && duration > 0) {
            addLog({
                side,
                durationSeconds: duration,
                manual: false,
                babyId: activeBaby?.id
            });
        }
        setDuration(0);
        startTimeRef.current = null;
    };
    
    const handleDelete = (timestamp: number) => {
        if(window.confirm("¿Estás seguro de que quieres borrar esta toma?")) {
            removeLog(l => l.timestamp === timestamp);
        }
    }

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate logs for today manually
    const history = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = startOfDay + 86400000;
        return babyLogs.filter(l => l.timestamp >= startOfDay && l.timestamp < endOfDay);
    }, [babyLogs]);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
            {/* Top Area: Suggestion */}
            {!isActive && !isManualEntry && (
                <div className="shrink-0 p-6 pb-2 text-center mt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('tool_bf_next')}</p>
                    <div className={`inline-block px-8 py-2 rounded-full text-2xl font-bold border transition-colors ${recommendedSide === 'L' ? 'bg-pink-500/20 border-pink-500 text-pink-200 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]'}`}>
                        {recommendedSide === 'L' ? t('tool_bf_left') : t('tool_bf_right')}
                    </div>
                </div>
            )}

            {/* Main Controls Area */}
            <div className="flex-none min-h-[35vh] flex flex-col items-center justify-center p-4">
                
                {/* Timer Mode Overlay */}
                {isActive ? (
                    <div className="w-full flex flex-col items-center animate-[fade-in_0.3s]">
                        <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase mb-4 border ${side === 'L' ? 'bg-pink-500/20 border-pink-500 text-pink-200' : 'bg-purple-500/20 border-purple-500 text-purple-200'}`}>
                            {side === 'L' ? t('tool_bf_left') : t('tool_bf_right')}
                        </div>
                        <div className="text-7xl font-mono font-light tracking-tighter text-white mb-8 drop-shadow-lg">
                            {formatTime(duration)}
                        </div>
                        <div className="flex items-center gap-6">
                            {!isPaused ? (
                                <button onClick={handlePause} className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/50 flex items-center justify-center hover:bg-amber-500/30 transition-all shadow-lg">
                                    <Pause size={32} fill="currentColor" />
                                </button>
                            ) : (
                                <button onClick={() => handleStartTimer(side)} className="w-20 h-20 bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                    <Play size={32} fill="currentColor" className="ml-1" />
                                </button>
                            )}
                            <button onClick={handleStop} className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full border border-white/10 flex items-center justify-center hover:text-red-400 hover:border-red-500/50 transition-all">
                                <Square size={24} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                ) : isManualEntry ? (
                    // Manual Entry Mode
                    <div className="w-full flex flex-col items-center animate-[fade-in_0.2s]">
                        <h3 className="text-xl font-bold text-white mb-6 font-['Outfit']">
                            Añadir toma manual ({isManualEntry === 'L' ? t('tool_bf_left') : t('tool_bf_right')})
                        </h3>
                        <div className="text-5xl font-bold text-white mb-8 flex items-baseline gap-2">
                            {manualMinutes} <span className="text-xl text-slate-400">min</span>
                        </div>
                        <div className="flex gap-4 w-full max-w-xs mb-8">
                            {[5, 10, 15, 20].map(val => (
                                <button 
                                    key={val} 
                                    onClick={() => setManualMinutes(val)}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-colors ${manualMinutes === val ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 border border-white/5'}`}
                                >
                                    {val}m
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4 w-full max-w-xs">
                            <button onClick={() => setIsManualEntry(null)} className="flex-1 py-4 bg-slate-800 text-slate-300 rounded-2xl font-bold hover:bg-slate-700">Cancelar</button>
                            <button onClick={handleSaveManual} className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400">Guardar</button>
                        </div>
                    </div>
                ) : (
                    // Selection Mode
                    <div className="w-full grid grid-cols-2 gap-6 max-w-sm">

                        {/* LEFT Side Control */}
                        <div className="flex flex-col gap-3">
                            <div className="text-center text-sm font-bold text-pink-300 uppercase tracking-widest">{t('tool_bf_left')}</div>
                            <button
                                onClick={() => handleStartTimer('L')}
                                className="h-32 rounded-[2rem] bg-pink-500 text-white flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:bg-pink-400 active:scale-95 transition-all border border-pink-400"
                            >
                                <Play size={36} fill="currentColor" className="ml-1" />
                                <span className="text-xs font-bold uppercase tracking-wider">{t('tool_bf_timer')}</span>
                            </button>
                            <button
                                onClick={() => setIsManualEntry('L')}
                                className="h-12 rounded-2xl border border-white/5 bg-slate-900 text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-2"
                            >
                                <Zap size={14} />
                                <span className="text-xs font-bold">Manual</span>
                            </button>
                        </div>

                        {/* RIGHT Side Control */}
                        <div className="flex flex-col gap-3">
                            <div className="text-center text-sm font-bold text-purple-300 uppercase tracking-widest">{t('tool_bf_right')}</div>
                            <button
                                onClick={() => handleStartTimer('R')}
                                className="h-32 rounded-[2rem] bg-purple-500 text-white flex flex-col items-center justify-center gap-2 shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:bg-purple-400 active:scale-95 transition-all border border-purple-400"
                            >
                                <Play size={36} fill="currentColor" className="ml-1" />
                                <span className="text-xs font-bold uppercase tracking-wider">{t('tool_bf_timer')}</span>
                            </button>
                            <button
                                onClick={() => setIsManualEntry('R')}
                                className="h-12 rounded-2xl border border-white/5 bg-slate-900 text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors mt-2"
                            >
                                <Zap size={14} />
                                <span className="text-xs font-bold">Manual</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Visualizer & History */}
            <div className="bg-slate-900/50 rounded-t-[2.5rem] border-t border-white/5 p-6 flex-1 flex flex-col min-h-0">
                <div className="shrink-0 mb-8">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Resumen 24h
                    </h3>
                    <TimelineChart events={
                        babyLogs.map(l => ({
                            timestamp: l.timestamp,
                            durationSeconds: l.durationSeconds,
                            color: l.side === 'L' ? 'bg-pink-500' : 'bg-purple-500',
                            label: l.side
                        }))
                    } />
                </div>

                <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={12} />
                        Hoy
                    </h3>

                    <div className="space-y-3 pb-8">
                        {history.length === 0 ? (
                             <div className="flex flex-col items-center justify-center py-8 bg-slate-900/30 rounded-3xl border border-white/5 border-dashed">
                                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                                     <CheckCircle2 size={24} className="text-slate-500" />
                                 </div>
                                 <p className="text-slate-400 font-bold">Sin tomas hoy</p>
                             </div>
                        ) : (
                            history.map((log, i) => (
                                <div key={i} className="group flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner ${log.side === 'L' ? 'bg-pink-500/20 text-pink-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {log.side === 'L' ? 'I' : 'D'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                                {log.side === 'L' ? t('tool_bf_left') : t('tool_bf_right')}
                                                {log.manual && <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[8px] text-slate-400 uppercase tracking-wide">Manual</span>}
                                            </p>
                                            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                                <Clock size={10} />
                                                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-slate-300">
                                                {formatTime(log.durationSeconds)}
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(log.timestamp)}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
