import React, { useState } from 'react';
import { Utensils, ThumbsUp, ThumbsDown, AlertCircle, History } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { SolidsLog } from './types';

export const SolidsDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<SolidsLog>('solids');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const reactionIcon = latest.reaction === 'love' ? '😋' : latest.reaction === 'hate' ? '🤢' : latest.reaction === 'allergy' ? '🚨' : '😐';

    return (
        <div className="flex flex-col">
            <span className="font-bold text-orange-200 truncate">
                {latest.food} {reactionIcon}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const SolidsFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<SolidsLog>('solids');
    const [food, setFood] = useState('');
    const [reaction, setReaction] = useState<SolidsLog['reaction']>('ok');

    const handleSave = () => {
        if (!food.trim()) return;
        addLog({
            food: food.trim(),
            reaction
        });
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    return (
        <div className="flex flex-col h-full p-6">
            <div className="mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Alimento</label>
                <input
                    type="text"
                    value={food}
                    onChange={e => setFood(e.target.value)}
                    placeholder="Ej: Puré de zanahoria"
                    className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-lg font-bold text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                />
            </div>

            <div className="mb-8">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Reacción</label>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: 'love', icon: '😋', label: 'Le encantó', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' },
                        { id: 'ok', icon: '😐', label: 'Aceptable', color: 'bg-slate-700 text-slate-300 border-transparent' },
                        { id: 'hate', icon: '🤢', label: 'Lo escupió', color: 'bg-orange-500/20 text-orange-400 border-orange-500/50' },
                        { id: 'allergy', icon: '🚨', label: 'Alergia', color: 'bg-red-500/20 text-red-400 border-red-500/50' }
                    ].map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setReaction(opt.id as any)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${reaction === opt.id ? opt.color + ' ring-2 ring-white/10' : 'bg-slate-800 border-white/5 opacity-60'
                                }`}
                        >
                            <span className="text-2xl">{opt.icon}</span>
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={!food}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-8 ${food ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'
                    }`}
            >
                Guardar
            </button>

            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Probados
                </h3>
                <div className="space-y-3">
                    {logs.slice(0, 10).map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                            <span className="font-bold text-slate-200">{log.food}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-lg">
                                    {log.reaction === 'love' ? '😋' : log.reaction === 'hate' ? '🤢' : log.reaction === 'allergy' ? '🚨' : '😐'}
                                </span>
                                <span className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
