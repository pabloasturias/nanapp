import React, { useState, useMemo } from 'react';
import { Milk, GlassWater, Droplet, History, Clock, Plus, Minus, Info } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { BottleLog } from './types';
import { useBaby } from '../../services/BabyContext';
import { useLanguage } from '../../services/LanguageContext';
import { TimelineChart } from './visualizations/TimelineChart';

export const BottleDashboard: React.FC = () => {
    const { getLatestLog, logs } = useToolData<BottleLog>('bottle');
    const { activeBaby } = useBaby();

    // Filter for active baby
    const babyLogs = useMemo(() => activeBaby ? logs.filter(l => !l.babyId || l.babyId === activeBaby.id) : logs, [logs, activeBaby]);
    const latest = babyLogs.length > 0 ? babyLogs[0] : null;

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

    // Daily Total
    const dailyTotal = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        return babyLogs
            .filter(l => l.timestamp >= startOfDay && (l.type === 'formula' || l.type === 'breastmilk' || l.type === 'cow'))
            .reduce((sum, l) => sum + (l.amount || 0), 0);
    }, [babyLogs]);

    return (
        <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <span className="font-bold text-blue-200">
                    {latest.amount}{latest.unit} · {typeLabel}
                </span>
                <span className="text-[10px] text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-white/5">
                    Total: {dailyTotal}ml
                </span>
            </div>

            <span className="text-[10px] opacity-70">
                Hace {timeSince(latest.timestamp)}
            </span>
        </div>
    );
};

export const BottleFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<BottleLog>('bottle');
    const { activeBaby } = useBaby();
    const { t } = useLanguage();

    const [amount, setAmount] = useState(120); // Default 120ml
    const [type, setType] = useState<BottleLog['type']>('formula');

    const handleSave = () => {
        addLog({
            amount,
            unit: 'ml',
            type,
            babyId: activeBaby?.id
        });
        if (navigator.vibrate) navigator.vibrate(50);
        onClose();
    };

    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const history = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const endOfDay = startOfDay + 86400000;
        return babyLogs.filter(l => l.timestamp >= startOfDay && l.timestamp < endOfDay);
    }, [babyLogs]);

    // Timeline Data
    const timelineEvents = useMemo(() => {
        return babyLogs.map(log => ({
            timestamp: log.timestamp,
            type: 'event' as const,
            label: `${log.amount}ml`,
            color: log.type === 'breastmilk' ? 'bg-pink-400' : log.type === 'formula' ? 'bg-blue-400' : 'bg-cyan-400'
        }));
    }, [babyLogs]);

    // Calculate Daily Volume (Milk Only)
    const dailyVolume = history
        .filter(l => l.type !== 'water')
        .reduce((sum, l) => sum + (l.amount || 0), 0);

    return (
        <div className="flex flex-col h-full bg-slate-900">

            {/* Timeline Visualization */}
            <div className="shrink-0 p-4 pb-0">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Resumen 24h</span>
                    <span className="text-xs font-bold text-blue-200 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                        Total Hoy: {dailyVolume}ml
                    </span>
                </div>
                <TimelineChart events={timelineEvents} height={60} />
            </div>

            <div className="p-6 pb-2">
                <h2 className="text-xl font-bold text-blue-50 mb-6 text-center">Registrar Toma</h2>

                {/* Amount Stepper */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-6">
                        <span className="text-6xl font-['Quicksand'] font-bold text-white tracking-tight">{amount}</span>
                        <span className="text-xl text-slate-500 font-bold ml-2 absolute top-2 -right-8">ml</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setAmount(prev => Math.max(10, prev - 10))}
                            className="w-14 h-14 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-slate-700 active:scale-95 transition-all"
                        >
                            <Minus size={24} className="text-slate-400" />
                        </button>

                        <div className="w-12 h-1 rounded-full bg-slate-800/50"></div>

                        <button
                            onClick={() => setAmount(prev => prev + 10)}
                            className="w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20 flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
                        >
                            <Plus size={24} />
                        </button>
                    </div>
                </div>

                {/* Type Selection */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button
                        onClick={() => setType('formula')}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'formula'
                            ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-750'
                            }`}
                    >
                        <div className={`p-1.5 rounded-full ${type === 'formula' ? 'bg-blue-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                            <Milk size={16} />
                        </div>
                        <span className="font-bold text-sm">Fórmula</span>
                    </button>

                    <button
                        onClick={() => setType('breastmilk')}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'breastmilk'
                            ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-750'
                            }`}
                    >
                        <div className={`p-1.5 rounded-full ${type === 'breastmilk' ? 'bg-pink-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                            <Droplet size={16} />
                        </div>
                        <span className="font-bold text-sm">Materna</span>
                    </button>

                    <button
                        onClick={() => setType('water')}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'water'
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-750'
                            }`}
                    >
                        <div className={`p-1.5 rounded-full ${type === 'water' ? 'bg-cyan-400 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                            <GlassWater size={16} />
                        </div>
                        <span className="font-bold text-sm">Agua</span>
                    </button>

                    <button
                        onClick={() => setType('cow')}
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${type === 'cow'
                            ? 'bg-amber-100/20 border-amber-100 text-amber-100'
                            : 'bg-slate-800 border-white/5 text-slate-500 hover:bg-slate-750'
                            }`}
                    >
                        <div className={`p-1.5 rounded-full ${type === 'cow' ? 'bg-amber-200 text-slate-900' : 'bg-slate-700 text-slate-400'}`}>
                            <Milk size={16} />
                        </div>
                        <span className="font-bold text-sm">Vaca</span>
                    </button>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20 mb-6 active:scale-[0.98] transition-all"
                >
                    Guardar Registro
                </button>
            </div>

            {/* History */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 border-t border-white/5 bg-slate-900/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest my-4 flex items-center gap-2 sticky top-0 bg-slate-900/95 backdrop-blur py-2 z-10">
                    <History size={12} />
                    Hoy
                </h3>
                <div className="space-y-3">
                    {history.length === 0 ? (
                        <p className="text-sm text-slate-500 italic text-center py-4">Sin registros hoy</p>
                    ) : (
                        history.map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800/80 rounded-xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${log.type === 'breastmilk' ? 'bg-pink-500/10 text-pink-400' :
                                            log.type === 'formula' ? 'bg-blue-500/10 text-blue-400' :
                                                'bg-cyan-500/10 text-cyan-400'
                                        }`}>
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
