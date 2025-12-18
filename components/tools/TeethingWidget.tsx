import React from 'react';
import { Smile, Check } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { TeethingLog } from './types';

const TEETH = [
    { id: 'inc_low', label: 'Incisivos Inf. (Centrales)', months: '6-10m' },
    { id: 'inc_up', label: 'Incisivos Sup. (Centrales)', months: '8-12m' },
    { id: 'lat_up', label: 'Incisivos Sup. (Laterales)', months: '9-13m' },
    { id: 'lat_low', label: 'Incisivos Inf. (Laterales)', months: '10-16m' },
    { id: 'mol_1', label: 'Primeros Molares', months: '13-19m' },
    { id: 'can', label: 'Caninos (Colmillos)', months: '16-22m' },
    { id: 'mol_2', label: 'Segundos Molares', months: '25-33m' },
];

export const TeethingDashboard: React.FC = () => {
    const { logs } = useToolData<TeethingLog>('teething');
    return (
        <div className="flex flex-col">
            <span className="font-bold text-rose-200">
                {logs.length} Dientes
            </span>
            <span className="text-[10px] opacity-70">
                Salidos
            </span>
        </div>
    );
};

export const TeethingFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog } = useToolData<TeethingLog>('teething');

    const isOut = (id: string) => logs.some(l => l.toothId === id);

    const toggle = (id: string) => {
        if (isOut(id)) return;
        addLog({ timestamp: Date.now(), toothId: id });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div className="flex flex-col h-full p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Registro Dentición</h3>
            <div className="flex-1 overflow-y-auto space-y-3">
                {TEETH.map(t => {
                    const out = isOut(t.id);
                    return (
                        <button
                            key={t.id}
                            onClick={() => toggle(t.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${out
                                    ? 'bg-rose-500/20 border-rose-500/50'
                                    : 'bg-slate-800 border-white/5 hover:bg-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${out ? 'bg-rose-500 text-white' : 'bg-slate-600 text-slate-400'}`}>
                                    {out ? <Smile size={18} /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                                </div>
                                <div>
                                    <p className={`font-bold ${out ? 'text-rose-200' : 'text-slate-300'}`}>{t.label}</p>
                                    <p className="text-[10px] text-slate-500">{t.months}</p>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    );
};
