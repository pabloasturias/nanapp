import React, { useState, useEffect, useMemo } from 'react';
import { Syringe, Check, Calendar, ChevronRight, Plus, FlaskConical } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { VaccineLog } from './types';
import { useBaby } from '../../services/BabyContext';

const COMMON_VACCINES = [
    { id: '2m_sys', label: 'Hexavalente + Neumococo (2m)', desc: '2 Meses (Sistemática)' },
    { id: '2m_rot', label: 'Rotavirus (2m)', desc: '2 Meses (Opcional)' },
    { id: '2m_men', label: 'Meningococo B (2m)', desc: '2 Meses (Opcional)' },

    { id: '4m_sys', label: 'Hexavalente + Neumococo + Men C (4m)', desc: '4 Meses (Sistemática)' },
    { id: '4m_rot', label: 'Rotavirus (4m)', desc: '4 Meses (Opcional)' },
    { id: '4m_men', label: 'Meningococo B (4m)', desc: '4 Meses (Opcional)' },

    { id: '11m_sys', label: 'Hexavalente + Neumococo (11m)', desc: '11 Meses (Sistemática)' },

    { id: '12m_sys', label: 'Triple Vírica + Men C/ACWY (12m)', desc: '12 Meses (Sistemática)' },
    { id: '12m_men', label: 'Meningococo B (12m)', desc: '12 Meses (Opcional)' },

    { id: '15m_var', label: 'Varicela (15m)', desc: '15 Meses (Sistemática)' },

    { id: '3y_sys', label: 'Triple Vírica + Varicela (3-4a)', desc: '3-4 Años' },
    { id: '6y_sys', label: 'dTpa + Polio (6a)', desc: '6 Años' },
    { id: '12y_men', label: 'Meningococo ACWY (12a)', desc: '12 Años' },
    { id: '12y_vph', label: 'VPH (12a)', desc: '12 Años' },

    { id: 'flu', label: 'Gripe Estacional', desc: 'Anual (6m - 59m)' },
    { id: 'rsv', label: 'VRS (Bronquiolitis)', desc: 'Inmunización (Nirsevimab)' },
];

export const VaccinesDashboard: React.FC = () => {
    const { logs } = useToolData<VaccineLog>('vaccines');
    const { activeBaby } = useBaby();

    const latest = logs
        .filter(l => !l.babyId || (activeBaby && l.babyId === activeBaby.id))
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-purple-200 truncate">
                {latest.vaccineName}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const VaccinesFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog, removeLog } = useToolData<VaccineLog>('vaccines');
    const { activeBaby, babies, setActiveBabyId } = useBaby();

    const [viewBabyId, setViewBabyId] = useState<string | null>(activeBaby?.id || null);
    const [vaccineName, setVaccineName] = useState('');
    const [date, setDate] = useState(() => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    });

    useEffect(() => {
        if (activeBaby && !viewBabyId) setViewBabyId(activeBaby.id);
    }, [activeBaby]);

    const currentBaby = babies.find(b => b.id === viewBabyId) || babies[0];

    const babyLogs = useMemo(() => {
        if (!currentBaby) return [];
        return logs.filter(l => !l.babyId || l.babyId === currentBaby.id);
    }, [logs, currentBaby]);

    const handleAdd = () => {
        if (!vaccineName.trim() || !date || !currentBaby) return;

        addLog({
            timestamp: new Date(date).getTime(),
            vaccineName: vaccineName.trim(),
            babyId: currentBaby.id
        });

        setVaccineName('');
        // Reset date to now? Or keep? Reset is safer to avoid accidental duplicates
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setDate(now.toISOString().slice(0, 16));

        if (navigator.vibrate) navigator.vibrate(50);
    };

    const isDone = (name: string) => babyLogs.some(l => l.vaccineName === name);
    const sortedLogs = [...babyLogs].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="flex flex-col h-full bg-slate-950 relative">

            {/* Sticky Header: Baby Selector */}
            <div className="bg-slate-900/95 backdrop-blur-md border-b border-white/5 pb-2 sticky top-0 z-30 shadow-md">
                <div className="px-4 pt-4 pb-2 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-white">Vacunas</h3>
                </div>
                <div className="px-4 py-2 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Bebé:</span>
                        {babies.map(baby => (
                            <button
                                key={baby.id}
                                onClick={() => {
                                    setViewBabyId(baby.id);
                                    setActiveBabyId(baby.id);
                                }}
                                className={`relative pl-1.5 pr-3.5 py-1.5 rounded-full border transition-all flex items-center gap-2 ${viewBabyId === baby.id
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-md'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${baby.gender === 'girl' ? 'bg-pink-100/20 text-pink-100' : 'bg-blue-100/20 text-blue-100'}`}>
                                    {baby.name[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-bold">{baby.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Registration Card */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 space-y-4 shadow-lg shadow-purple-900/10">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest">Registrar Dosis</h4>

                    <div className="space-y-3">
                        <div>
                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Nombre de la vacuna</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={vaccineName}
                                    onChange={(e) => setVaccineName(e.target.value)}
                                    placeholder="Ej: Bexsero, Gripe..."
                                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors placeholder-slate-600"
                                />
                                <Syringe size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
                            </div>
                        </div>

                        <div>
                            <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Fecha de administración</label>
                            <input
                                type="datetime-local"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none transition-colors"
                            />
                        </div>

                        <button
                            onClick={handleAdd}
                            disabled={!vaccineName.trim() || !date}
                            className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-900/50 mt-2"
                        >
                            Guardar Registro
                        </button>
                    </div>
                </div>

                {/* Suggestions */}
                <div className="space-y-2">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Sugerencias (Comunes)</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {COMMON_VACCINES.map((v) => {
                            const done = isDone(v.label);
                            if (done) return null; // Hide if done? Or show as checked? Hiding keeps list clean. User wants to register.
                            // Let's hide completed to reduce clutter, or show at bottom. Hiding is fine for SUGGESTIONS.

                            return (
                                <button
                                    key={v.id}
                                    onClick={() => setVaccineName(v.label)}
                                    className="w-full text-left p-3 rounded-xl border border-white/5 bg-slate-800/40 hover:bg-slate-700/80 transition-all flex items-center justify-between group"
                                >
                                    <div>
                                        <p className="font-bold text-slate-300 group-hover:text-purple-300 transition-colors">{v.label}</p>
                                        <p className="text-[10px] text-slate-500">{v.desc}</p>
                                    </div>
                                    <div className="p-1.5 rounded-lg bg-slate-800 text-slate-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Plus size={16} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* History */}
                {sortedLogs.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-1">Historial ({sortedLogs.length})</h3>
                        <div className="space-y-2">
                            {sortedLogs.map((log) => (
                                <div key={log.timestamp} className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-500/20 text-purple-300 p-2 rounded-full">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">{log.vaccineName}</p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(log.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Eliminar registro?')) removeLog(l => l.timestamp === log.timestamp);
                                        }}
                                        className="p-2 text-slate-600 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                        <Plus size={16} className="rotate-45" /> {/* Close icon lookalike or generic remove */}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
