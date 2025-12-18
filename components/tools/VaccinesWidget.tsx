import React, { useState } from 'react';
import { Syringe, Check, Calendar, ChevronRight } from 'lucide-react';
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
    // logs contains all completed vaccines

    const isDone = (name: string) => logs.some(l => l.vaccineName === name);

    const toggleVaccine = (name: string) => {
        if (isDone(name)) {
            // Uncheck? useToolData is append-only for now. 
            // In a real app we'd remove. Here we'll just ignore for "Undo" simplicity 
            // or perhaps we shouldn't allow easy undo to avoid accidental data loss.
            // Let's allow ADDING only for now.
            return;
        }
        addLog({
            timestamp: Date.now(),
            vaccineName: name
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div className="flex flex-col h-full p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Calendario Vacunal</h3>

            <div className="flex-1 overflow-y-auto space-y-3">
                {COMMON_VACCINES.map((v) => {
                    const done = isDone(v.label);
                    const log = logs.find(l => l.vaccineName === v.label);

                    return (
                        <button
                            key={v.id}
                            onClick={() => toggleVaccine(v.label)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${done
                                    ? 'bg-purple-500/20 border-purple-500/50'
                                    : 'bg-slate-800 border-white/5 hover:bg-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-purple-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
                                    {done ? <Check size={16} /> : <Syringe size={16} />}
                                </div>
                                <div>
                                    <p className={`font-bold ${done ? 'text-purple-200' : 'text-slate-300'}`}>{v.label}</p>
                                    <p className="text-[10px] text-slate-500">{v.desc}</p>
                                </div>
                            </div>
                            {done && (
                                <span className="text-xs text-purple-300 font-mono opacity-70">
                                    {new Date(log!.timestamp).toLocaleDateString()}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
