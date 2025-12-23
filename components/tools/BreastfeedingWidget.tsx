import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, Square, History, Clock, Zap, Timer } from 'lucide-react';
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
        return logs.find(l => l.babyId === activeBaby.id) || logs[0];
        // Fallback to first log if none for this baby? Maybe logs[0] is confusing if it belongs to sibling. 
        // Better: logs.find(l => !l.babyId) || logs.find(l => l.babyId === activeBaby.id) ? NO.
        // Best: logs.find(l => l.babyId === activeBaby.id) || (logs.find(l => !l.babyId)); // Legacy support
    }, [logs, activeBaby]);

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const timeSince = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        if (hours > 0) return `${hours}h ${mins % 60}m`;
        return `${mins} min`;
    };

    // Logic: If last was L, next is R 
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
    const { addLog, logs } = useToolData<BreastfeedingLog>('breastfeeding');
    const { activeBaby } = useBaby();

    const [isTimerMode, setIsTimerMode] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

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

    const handleQuickLog = (selectedSide: 'L' | 'R') => {
        addLog({
            side: selectedSide,
            durationSeconds: 0,
            manual: true,
            babyId: activeBaby?.id
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleStop = () => {
        setIsActive(false);
        setIsPaused(false);
        setIsTimerMode(false);

        if (startTimeRef.current && duration > 0) { // Save even short durations for testing
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

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate logs for today manually since getLogsByDate from hook isn't filtered
    const history = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = startOfDay + 86400000;
        return babyLogs.filter(l => l.timestamp >= startOfDay && l.timestamp < endOfDay);
    }, [babyLogs]);

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* Top Area: Suggestion */}
            {!isActive && (
                <div className="shrink-0 p-6 pb-2 text-center mt-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('tool_bf_next')}</p>
                    <div className={`inline-block px-8 py-2 rounded-full text-2xl font-bold border transition-colors ${recommendedSide === 'L' ? 'bg-pink-500/20 border-pink-500 text-pink-200' : 'bg-purple-500/20 border-purple-500 text-purple-200'}`}>
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
                        <div className="text-6xl font-mono font-light tracking-tighter text-white mb-8">
                            {formatTime(duration)}
                        </div>
                        <div className="flex items-center gap-6">
                            {!isPaused ? (
                                <button onClick={handlePause} className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full border border-amber-500/50 flex items-center justify-center hover:bg-amber-500/30 transition-all">
                                    <Pause size={32} fill="currentColor" />
                                </button>
                            ) : (
                                <button onClick={() => handleStartTimer(side)} className="w-20 h-20 bg-emerald-500 text-white rounded-full shadow-xl shadow-emerald-500/20 flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                                    <Play size={32} fill="currentColor" className="ml-1" />
                                </button>
                            )}
                            <button onClick={handleStop} className="w-16 h-16 bg-slate-800 text-slate-400 rounded-full border border-white/10 flex items-center justify-center hover:text-red-400 hover:border-red-500/50 transition-all">
                                <Square size={24} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                ) : (
                    // Selection Mode
                    <div className="w-full grid grid-cols-2 gap-4 max-w-sm">

                        {/* LEFT Side Control */}
                        <div className="flex flex-col gap-3">
                            <div className="text-center text-xs font-bold text-pink-300 uppercase">{t('tool_bf_left')}</div>
                            <button
                                onClick={() => handleQuickLog('L')}
                                className="h-28 rounded-2xl bg-pink-500 text-white flex flex-col items-center justify-center gap-2 shadow-lg shadow-pink-500/20 active:scale-95 transition-transform"
                            >
                                <Zap size={28} />
                                <span className="text-[10px] font-bold opacity-90 text-center leading-3 px-2">{t('tool_bf_manual')}</span>
                            </button>
                            <button
                                onClick={() => handleStartTimer('L')}
                                className="h-12 rounded-xl border border-pink-500/30 text-pink-300 flex items-center justify-center gap-2 hover:bg-pink-500/10 transition-colors"
                            >
                                <Timer size={16} />
                                <span className="text-[10px] font-bold">{t('tool_bf_timer')}</span>
                            </button>
                        </div>

                        {/* RIGHT Side Control */}
                        <div className="flex flex-col gap-3">
                            <div className="text-center text-xs font-bold text-purple-300 uppercase">{t('tool_bf_right')}</div>
                            <button
                                onClick={() => handleQuickLog('R')}
                                className="h-28 rounded-2xl bg-purple-500 text-white flex flex-col items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95 transition-transform"
                            >
                                <Zap size={28} />
                                <span className="text-[10px] font-bold opacity-90 text-center leading-3 px-2">{t('tool_bf_manual')}</span>
                            </button>
                            <button
                                onClick={() => handleStartTimer('R')}
                                className="h-12 rounded-xl border border-purple-500/30 text-purple-300 flex items-center justify-center gap-2 hover:bg-purple-500/10 transition-colors"
                            >
                                <Timer size={16} />
                                <span className="text-[10px] font-bold">{t('tool_bf_timer')}</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Visualizer & History */}
            <div className="bg-slate-900/50 rounded-t-[2rem] border-t border-white/5 p-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="shrink-0 mb-6">
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

                <div className="flex-1 overflow-y-auto">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={12} />
                        Hoy
                    </h3>

                    <div className="space-y-3">
                        {history.length === 0 ? (
                            <p className="text-sm text-slate-500 italic text-center py-4">Sin registros hoy</p>
                        ) : (
                            history.map((log, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${log.side === 'L' ? 'bg-pink-500/20 text-pink-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                            {log.side === 'L' ? 'L' : 'R'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">
                                                {log.side === 'L' ? t('tool_bf_left') : t('tool_bf_right')}
                                            </p>
                                            {log.manual && <p className="text-[9px] text-slate-500 uppercase tracking-wide">Manual</p>}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {!log.manual && (
                                            <p className="text-xs font-bold text-slate-300">
                                                {formatTime(log.durationSeconds)}
                                            </p>
                                        )}
                                        <div className="text-[10px] text-slate-500 flex items-center justify-end gap-1">
                                            <Clock size={10} />
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
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

