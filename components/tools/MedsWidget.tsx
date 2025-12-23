import React, { useState, useMemo } from 'react';
import { Pill, Check, Clock, History, Plus } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { MedsLog } from './types';
import { useBaby } from '../../services/BabyContext';
import { LastDaysChart } from './visualizations/LastDaysChart';

const VITAMIN_D_KEY = 'Vit D';

export const MedsDashboard: React.FC = () => {
    const { logs } = useToolData<MedsLog>('meds');
    const { activeBaby } = useBaby();

    // Latest filtered log
    const { latest, hasVitD } = useMemo(() => {
        const babyLogs = !activeBaby ? logs : logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
        const l = babyLogs.length > 0 ? babyLogs[0] : null; // Sorted by timestamp desc in useToolData usually

        // Check Vit D today
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const hasD = babyLogs.some(log => log.medName === VITAMIN_D_KEY && log.timestamp >= startOfDay);

        return { latest: l, hasVitD: hasD };
    }, [logs, activeBaby]);

    return (
        <div className="flex flex-col gap-1">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${hasVitD ? 'text-emerald-400' : 'text-red-300'}`}>
                {hasVitD ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                Vit D: {hasVitD ? 'Hecha' : 'Pendiente'}
            </div>
            {latest && latest.medName !== VITAMIN_D_KEY && (
                <span className="text-[10px] opacity-70 truncate max-w-[120px]">
                    Último: {latest.medName}
                </span>
            )}
        </div>
    );
};

export const MedsFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<MedsLog>('meds');
    const { activeBaby } = useBaby();

    // Filter logs for active baby
    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const todaysLogs = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = startOfDay + 86400000;
        return babyLogs.filter(l => l.timestamp >= startOfDay && l.timestamp < endOfDay);
    }, [babyLogs]);

    const hasVitD = todaysLogs.some(l => l.medName === VITAMIN_D_KEY);

    const handleAdd = (name: string, dose?: string) => {
        addLog({
            medName: name,
            dose,
            babyId: activeBaby?.id
        });
        if (navigator.vibrate) navigator.vibrate(50);
        if (name === VITAMIN_D_KEY) {
            // Stay info
        } else {
            onClose();
        }
    };

    return (
        <div className="flex flex-col h-full p-6">

            {/* Vitamin D Section */}
            <div className="mb-8 p-4 bg-slate-900/50 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Vitamina D</h3>
                        <p className="text-[10px] text-slate-400">Diario</p>
                    </div>
                    {/* Quick Action */}
                    {!hasVitD && (
                        <button
                            onClick={() => handleAdd(VITAMIN_D_KEY)}
                            className="bg-emerald-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                        >
                            Registrar Hoy
                        </button>
                    )}
                </div>

                {/* Last 7 Days Visualization */}
                <LastDaysChart
                    data={babyLogs.filter(l => l.medName === VITAMIN_D_KEY).map(l => ({ timestamp: l.timestamp, status: 'completed' }))}
                    days={7}
                    label="Últimos 7 días"
                />
            </div>

            {/* Common Meds */}
            <div className="mb-8">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Medicinas Comunes</h3>
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleAdd('Apiretal', 'Paracetamol')}
                        className="bg-slate-800 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center font-bold">A</div>
                        <div>
                            <p className="font-bold text-slate-200">Apiretal</p>
                            <p className="text-[10px] text-slate-500">Paracetamol</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleAdd('Dalsy', 'Ibuprofeno')}
                        className="bg-slate-800 border border-white/5 p-4 rounded-xl flex items-center gap-3 hover:bg-slate-700 transition-colors text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">D</div>
                        <div>
                            <p className="font-bold text-slate-200">Dalsy</p>
                            <p className="text-[10px] text-slate-500">Ibuprofeno</p>
                        </div>
                    </button>
                </div>

                {/* Generic Add */}
                <button
                    onClick={() => handleAdd('Otro Medicamento')}
                    className="w-full mt-3 py-3 rounded-xl border border-dashed border-slate-700 text-slate-500 text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 hover:text-slate-300 transition-colors"
                >
                    <Plus size={16} />
                    Registrar otro
                </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Hoy
                </h3>
                <div className="space-y-3">
                    {todaysLogs.length === 0 ? (
                        <p className="text-sm text-slate-500 italic text-center py-4">Sin registros hoy</p>
                    ) : (
                        todaysLogs.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Pill size={16} className="text-slate-500" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-200">
                                            {log.medName}
                                        </span>
                                        {log.dose && (
                                            <span className="text-[10px] text-slate-400">
                                                {log.dose}
                                            </span>
                                        )}
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
