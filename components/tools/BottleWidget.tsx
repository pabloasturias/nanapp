import React, { useState } from 'react';
import { Milk, GlassWater, Droplet, History, Clock, Plus, Minus } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { BottleLog } from './types';

export const BottleDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<BottleLog>('bottle');
    const latest = getLatestLog();

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    const timeSince = (timestamp: number) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        if (hours > 0) return `${hours}h ${mins % 60}m`;
        return `${mins} min`;
    };

    const typeLabel = {
        formula: 'Fórmula',
        breastmilk: 'Leche Mat.',
        cow: 'Vaca',
        water: 'Agua'
    }[latest.type];

    return (
        <div className="flex flex-col">
            <span className="font-bold text-blue-200">
                {latest.amount}{latest.unit} · {typeLabel}
            </span>
            <span className="text-[10px] opacity-70">
                Hace {timeSince(latest.timestamp)}
            </span>
        </div>
    );
};

export const BottleFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, getLogsByDate } = useToolData<BottleLog>('bottle');
    const [amount, setAmount] = useState(120); // Default 120ml
    const [type, setType] = useState<BottleLog['type']>('formula');

    const handleSave = () => {
        addLog({
            amount,
            unit: 'ml',
            type
        });
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    const history = getLogsByDate(new Date());

    return (
        <div className="flex flex-col h-full p-6">
            <h2 className="text-xl font-bold text-blue-50 mb-6 text-center">Registrar Toma</h2>

            {/* Amount Stepper */}
            <div className="flex flex-col items-center mb-10">
                <div className="relative mb-6">
                    <span className="text-6xl font-['Quicksand'] font-bold text-white">{amount}</span>
                    <span className="text-xl text-slate-500 font-bold ml-2 absolute top-2 -right-8">ml</span>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setAmount(prev => Math.max(10, prev - 10))}
                        className="w-12 h-12 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-slate-700 transition-colors"
                    >
                        <Minus size={20} className="text-slate-400" />
                    </button>

                    <div className="w-16 h-1 rounded-full bg-slate-800">
                        {/* Visual indicator could go here */}
                    </div>

                    <button
                        onClick={() => setAmount(prev => prev + 10)}
                        className="w-12 h-12 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* Type Selection */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <button
                    onClick={() => setType('formula')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'formula'
                            ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                            : 'bg-slate-800 border-white/5 text-slate-500'
                        }`}
                >
                    <Milk size={20} />
                    <span className="font-bold text-sm">Fórmula</span>
                </button>

                <button
                    onClick={() => setType('breastmilk')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'breastmilk'
                            ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                            : 'bg-slate-800 border-white/5 text-slate-500'
                        }`}
                >
                    <Droplet size={20} />
                    <span className="font-bold text-sm">Materna</span>
                </button>

                <button
                    onClick={() => setType('water')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'water'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-800 border-white/5 text-slate-500'
                        }`}
                >
                    <GlassWater size={20} />
                    <span className="font-bold text-sm">Agua</span>
                </button>

                <button
                    onClick={() => setType('cow')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'cow'
                            ? 'bg-amber-100/20 border-amber-100 text-amber-100'
                            : 'bg-slate-800 border-white/5 text-slate-500'
                        }`}
                >
                    <Milk size={20} className="text-amber-100" />
                    <span className="font-bold text-sm">Vaca</span>
                </button>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full py-4 rounded-xl font-bold text-lg bg-blue-500 text-white shadow-lg mb-8 hover:bg-blue-600 transition-all"
            >
                Guardar
            </button>

            {/* History */}
            <div className="flex-1 overflow-y-auto">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <History size={12} />
                    Hoy
                </h3>
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-sm text-slate-500 italic text-center py-4">Sin registros hoy</p>
                    ) : (
                        history.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                        <GlassWater size={14} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-slate-200">
                                            {log.amount}ml
                                        </span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                                            {log.type === 'breastmilk' ? 'Materna' : log.type === 'formula' ? 'Fórmula' : log.type === 'water' ? 'Agua' : 'Vaca'}
                                        </span>
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
