import React, { useState } from 'react';
import { Droplets, History, Check } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { BathLog } from './types';

export const BathDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<BathLog>('bath');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const daysAgo = Math.floor((Date.now() - latest.timestamp) / (1000 * 60 * 60 * 24));

    return (
        <div className="flex flex-col">
            <span className="font-bold text-cyan-200">
                {daysAgo === 0 ? 'Hoy' : daysAgo === 1 ? 'Ayer' : `Hace ${daysAgo} días`}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
        </div>
    );
};

export const BathFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<BathLog>('bath');

    const handleBath = () => {
        addLog({ timestamp: Date.now(), type: 'tub' });
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    return (
        <div className="flex flex-col h-full p-6 items-center justify-center">

            <button
                onClick={handleBath}
                className="w-full max-w-xs aspect-square rounded-[3rem] bg-gradient-to-br from-cyan-400 to-blue-500 flex flex-col items-center justify-center shadow-2xl shadow-cyan-500/30 hover:scale-105 transition-all text-white mb-12"
            >
                <div className="p-6 bg-white/20 rounded-full mb-4">
                    <Droplets size={64} />
                </div>
                <span className="text-2xl font-bold">Registrar Baño</span>
            </button>

            <div className="w-full max-w-sm">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Historial</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                    {logs.slice(0, 5).map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                                    <Check size={16} />
                                </div>
                                <span className="text-sm font-bold text-slate-200">Baño</span>
                            </div>
                            <div className="text-xs text-slate-500">
                                {new Date(log.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                    {logs.length === 0 && <p className="text-center text-slate-500">Sin baños registrados</p>}
                </div>
            </div>
        </div>
    );
};
