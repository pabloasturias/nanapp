import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, Square, History, Clock } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { TummyLog } from './types';

export const TummyDashboard: React.FC = () => {
    const { getLogsByDate } = useToolData<TummyLog>('tummy_time');
    const todayLogs = getLogsByDate(new Date());

    const totalSeconds = todayLogs.reduce((acc, log) => acc + log.durationSeconds, 0);
    const mins = Math.floor(totalSeconds / 60);

    return (
        <div className="flex flex-col">
            <span className="font-bold text-teal-200">
                Hoy: {mins} min
            </span>
            <span className="text-[10px] opacity-70">
                {todayLogs.length} sesiones
            </span>
        </div>
    );
};

export const TummyFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, getLogsByDate } = useToolData<TummyLog>('tummy_time');

    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(0);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive) {
            intervalRef.current = window.setInterval(() => {
                setDuration(d => d + 1);
            }, 1000);
        } else {
            if (intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [isActive]);

    const handleStop = () => {
        setIsActive(false);
        if (duration > 5) {
            addLog({ durationSeconds: duration });
        }
        setDuration(0);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const history = getLogsByDate(new Date());

    return (
        <div className="flex flex-col h-full p-6">
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">

                <div className="text-7xl font-mono font-bold text-teal-200 tabular-nums">
                    {formatTime(duration)}
                </div>

                <button
                    onClick={() => isActive ? handleStop() : setIsActive(true)}
                    className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive
                            ? 'bg-red-500/20 text-red-400 border-4 border-red-500/50'
                            : 'bg-teal-500 text-white shadow-teal-500/30 hover:scale-105'
                        }`}
                >
                    {isActive ? <Square size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                </button>

                <p className="text-slate-500 text-sm font-medium">
                    {isActive ? 'Tummy Time en curso...' : 'Iniciar Cronómetro'}
                </p>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-4 h-1/3 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Hoy</h3>
                <div className="space-y-2">
                    {history.map((log, i) => (
                        <div key={i} className="flex justify-between text-sm p-2 bg-slate-800 rounded-lg">
                            <span className="font-bold text-teal-200">{formatTime(log.durationSeconds)}</span>
                            <span className="text-slate-500 text-xs">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    ))}
                    {history.length === 0 && <p className="text-center text-xs text-slate-600">Sin registros</p>}
                </div>
            </div>
        </div>
    );
};
