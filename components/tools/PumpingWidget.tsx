import React, { useState, useEffect } from 'react';
import { Activity, Play, Square, Minus, Plus, History, Clock } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { PumpingLog } from './types';

export const PumpingDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<PumpingLog>('pumping');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const mins = Math.floor(latest.durationSeconds / 60);

    return (
        <div className="flex flex-col">
            <span className="font-bold text-violet-200">
                {latest.amountMl}ml · {mins}m
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export const PumpingFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<PumpingLog>('pumping');
    const [isActive, setIsActive] = useState(false);
    const [duration, setDuration] = useState(0);
    const [amount, setAmount] = useState(100);

    useEffect(() => {
        let i: number;
        if (isActive) {
            i = window.setInterval(() => setDuration(d => d + 1), 1000);
        }
        return () => clearInterval(i);
    }, [isActive]);

    const handleSave = () => {
        setIsActive(false);
        addLog({
            timestamp: Date.now(),
            durationSeconds: duration,
            amountMl: amount,
            side: 'double' // Default to double for MVP, or add switches? Keeping simple.
        });
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col h-full p-6">

            {/* Timer Section */}
            <div className="flex flex-col items-center justify-center flex-1 space-y-8">
                <div className="text-6xl font-mono font-bold text-violet-200 tabular-nums">
                    {formatTime(duration)}
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsActive(!isActive)}
                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive ? 'bg-slate-700 text-slate-300' : 'bg-violet-500 text-white'
                            }`}
                    >
                        {isActive ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                </div>
            </div>

            {/* Volume Input (Show always or only when saving? Always allows manual entry without timer) */}
            <div className="bg-slate-800/50 p-6 rounded-3xl border border-white/5 mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center block mb-4">Cantidad Extraída</label>
                <div className="flex items-center justify-center gap-6">
                    <button onClick={() => setAmount(a => Math.max(0, a - 10))} className="p-3 bg-slate-700 rounded-full text-white hover:bg-slate-600"><Minus size={20} /></button>
                    <span className="text-4xl font-bold text-white w-24 text-center">{amount}<span className="text-sm text-slate-500 ml-1">ml</span></span>
                    <button onClick={() => setAmount(a => a + 10)} className="p-3 bg-violet-600 rounded-full text-white hover:bg-violet-500"><Plus size={20} /></button>
                </div>
            </div>

            <button
                onClick={handleSave}
                className="w-full py-4 rounded-xl font-bold text-lg bg-white text-violet-900 shadow-lg mb-4 hover:bg-slate-100 transition-all"
            >
                Guardar Sesión
            </button>

            {/* History */}
            <div className="bg-slate-900/50 rounded-xl p-4 h-1/4 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Reciente</h3>
                <div className="space-y-2">
                    {logs.slice(0, 5).map((log, i) => (
                        <div key={i} className="flex justify-between text-sm p-2 bg-slate-800 rounded-lg">
                            <span className="font-bold text-violet-200">{log.amountMl}ml</span>
                            <div className="flex gap-2 text-xs text-slate-500">
                                <span>{Math.floor(log.durationSeconds / 60)}m</span>
                                <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center text-xs text-slate-600">Sin registros</p>}
                </div>
            </div>
        </div>
    );
};
