import React, { useState } from 'react';
import { Syringe, Check, Calendar, ChevronRight, Plus } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { VaccineLog } from './types';

const COMMON_VACCINES = [
    { id: '2m_sys', label: '2 Meses (Sistemática)', desc: 'Hexavalente + Neumococo' },
    { id: '2m_rot', label: '2 Meses (Rotavirus)', desc: 'Opcional' },
    { id: '2m_men', label: '2 Meses (Men B)', desc: 'Opcional' },
    { id: '4m_sys', label: '4 Meses (Sistemática)', desc: 'Hexavalente + Neumococo' },
    { id: '4m_rot', label: '4 Meses (Rotavirus)', desc: 'Opcional' },
    { id: '4m_men', label: '4 Meses (Men B)', desc: 'Opcional' },
    { id: '11m_sys', label: '11 Meses', desc: 'Hexavalente + Neumococo' },
    { id: '12m_sys', label: '12 Meses', desc: 'Triple Vírica' },
];

export const VaccinesDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<VaccineLog>('vaccines');
    const latest = getLatestLog();

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
    const { logs, addLog } = useToolData<VaccineLog>('vaccines');
    const [customName, setCustomName] = useState('');

    const handleAdd = (name: string) => {
        if (!name) return;
        addLog({
            timestamp: Date.now(),
            vaccineName: name
        });
        setCustomName('');
        if (navigator.vibrate) navigator.vibrate(50);
    };

    const isDone = (name: string) => logs.some(l => l.vaccineName === name);

    // Filter available suggestions (not yet done)
    const suggestions = COMMON_VACCINES.filter(v => !isDone(v.label));

    // Sort logs by date desc
    const sortedLogs = [...logs].sort((a, b) => b.timestamp - a.timestamp);

    return (
        <div className="flex flex-col h-full bg-slate-900">

            {/* Add Custom */}
            <div className="p-4 bg-slate-800/50 border-b border-white/5 space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Añadir Vacuna</h3>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Nombre de la vacuna..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-purple-500 outline-none"
                    />
                    <button
                        onClick={() => handleAdd(customName)}
                        disabled={!customName}
                        className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-bold px-4 rounded-xl transition-colors"
                    >
                        <Plus />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Suggestions */}
                {suggestions.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Sugerencias (Comunes)</h3>
                        <div className="space-y-2">
                            {suggestions.map((v) => (
                                <button
                                    key={v.id}
                                    onClick={() => handleAdd(v.label)}
                                    className="w-full text-left p-3 rounded-xl border border-white/5 bg-slate-800/40 hover:bg-slate-700 transition-all flex items-center justify-between group"
                                >
                                    <div>
                                        <p className="font-bold text-slate-300 group-hover:text-purple-300">{v.label}</p>
                                        <p className="text-[10px] text-slate-500">{v.desc}</p>
                                    </div>
                                    <div className="p-2 rounded-full bg-slate-800 text-slate-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                        <Plus size={16} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Historial */}
                {sortedLogs.length > 0 && (
                    <div>
                        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-3">Historial ({sortedLogs.length})</h3>
                        <div className="space-y-2">
                            {sortedLogs.map((log) => (
                                <div key={log.timestamp} className="bg-purple-500/10 border border-purple-500/20 p-3 rounded-xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-purple-500 text-white p-1.5 rounded-full">
                                            <Check size={14} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-purple-100">{log.vaccineName}</p>
                                            <p className="text-[10px] text-purple-300 opacity-70">
                                                {new Date(log.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
