import React from 'react';
import { Trophy, Check, Star } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { MilestoneLog } from './types';

const COMMON_MILESTONES = [
    { id: 'smile', label: 'Sonrisa Social', months: '1-2m' },
    { id: 'head_up', label: 'Sostiene Cabeza', months: '2-4m' },
    { id: 'roll', label: 'Se Gira', months: '4-6m' },
    { id: 'sit', label: 'Se Sienta', months: '6-8m' },
    { id: 'crawl', label: 'Gatea', months: '8-10m' },
    { id: 'stand', label: 'Se Pone de Pie', months: '9-12m' },
    { id: 'walk', label: 'Camina', months: '12-18m' },
    { id: 'first_word', label: 'Primera Palabra', months: '9-14m' },
];

export const MilestonesDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<MilestoneLog>('milestones');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    // Find label
    const m = COMMON_MILESTONES.find(x => x.id === latest.milestoneId);

    return (
        <div className="flex flex-col">
            <span className="font-bold text-yellow-200 truncate">
                {m ? m.label : 'Hito logrado'}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const MilestonesFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog } = useToolData<MilestoneLog>('milestones');

    const isDone = (id: string) => logs.some(l => l.milestoneId === id);

    const toggle = (id: string) => {
        if (isDone(id)) return;
        addLog({
            timestamp: Date.now(),
            milestoneId: id
        });
        if (navigator.vibrate) navigator.vibrate([50, 50]);
    };

    return (
        <div className="flex flex-col h-full p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Hitos de Desarrollo</h3>

            <div className="flex-1 overflow-y-auto space-y-3">
                {COMMON_MILESTONES.map((m) => {
                    const done = isDone(m.id);
                    const log = logs.find(l => l.milestoneId === m.id);

                    return (
                        <button
                            key={m.id}
                            onClick={() => toggle(m.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${done
                                    ? 'bg-yellow-500/20 border-yellow-500/50'
                                    : 'bg-slate-800 border-white/5 hover:bg-slate-700'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-yellow-500 text-slate-900' : 'bg-slate-600 text-slate-400'}`}>
                                    {done ? <Trophy size={20} /> : <Star size={20} />}
                                </div>
                                <div>
                                    <p className={`font-bold ${done ? 'text-yellow-200' : 'text-slate-300'}`}>{m.label}</p>
                                    <p className="text-[10px] text-slate-500">{m.months}</p>
                                </div>
                            </div>
                            {done && (
                                <span className="text-xs text-yellow-300 font-mono opacity-70">
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
