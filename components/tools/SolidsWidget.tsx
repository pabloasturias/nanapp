import React, { useState, useMemo } from 'react';
import { Utensils, AlertCircle, History, ChefHat, Check, X, Egg, Wheat, Fish, Milk as MilkIcon, Nut, Bean, Search } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { SolidsLog } from './types';
import { useBaby } from '../../services/BabyContext';

// Common allergens list
const COMMON_ALLERGENS = [
    { id: 'egg', name: 'Huevo', icon: Egg },
    { id: 'gluten', name: 'Gluten', icon: Wheat },
    { id: 'dairy', name: 'Lácteos', icon: MilkIcon },
    { id: 'nuts', name: 'Frutos Secos', icon: Nut },
    { id: 'fish', name: 'Pescado', icon: Fish },
    { id: 'legumes', name: 'Legumbres', icon: Bean },
    { id: 'soy', name: 'Soja', icon: Bean }, // Reuse Bean for Soy
    { id: 'shellfish', name: 'Marisco', icon: Fish }, // Reuse Fish for Shellfish
];

export const SolidsDashboard: React.FC = () => {
    const { logs } = useToolData<SolidsLog>('solids');
    const { activeBaby } = useBaby();

    const babyLogs = useMemo(() => activeBaby ? logs.filter(l => !l.babyId || l.babyId === activeBaby.id) : logs, [logs, activeBaby]);

    // Calculate stats
    const triedCount = new Set(babyLogs.map(l => l.food.toLowerCase())).size;
    const allergies = babyLogs.filter(l => l.reaction === 'allergy');

    if (babyLogs.length === 0) return <span className="opacity-60">Sin registros</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-orange-200">
                {triedCount} alimentos probados
            </span>
            {allergies.length > 0 ? (
                <span className="text-[10px] text-red-300 font-bold flex items-center gap-1">
                    <AlertCircle size={10} />
                    {allergies.length} alergias detectadas
                </span>
            ) : (
                <span className="text-[10px] text-emerald-400/80 font-medium">
                    Sin reacciones adversas
                </span>
            )}
        </div>
    );
};

export const SolidsFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<SolidsLog>('solids');
    const { activeBaby } = useBaby();
    const [view, setView] = useState<'log' | 'allergens'>('allergens');

    // For logging
    const [foodName, setFoodName] = useState('');
    const [reaction, setReaction] = useState<SolidsLog['reaction']>('ok');
    const [notes, setNotes] = useState('');

    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    // Derived state for allergen grid
    const allergenStatus = useMemo(() => {
        const statuses: Record<string, { tried: boolean, allergy: boolean, count: number }> = {};
        COMMON_ALLERGENS.forEach(a => {
            const relatedLogs = babyLogs.filter(l => l.food.toLowerCase().includes(a.name.toLowerCase()));
            statuses[a.id] = {
                tried: relatedLogs.length > 0,
                allergy: relatedLogs.some(l => l.reaction === 'allergy'),
                count: relatedLogs.length
            };
        });
        return statuses;
    }, [babyLogs]);

    const handleSave = () => {
        if (!foodName.trim()) return;
        addLog({
            food: foodName.trim(),
            reaction,
            notes,
            babyId: activeBaby?.id
        });
        if (navigator.vibrate) navigator.vibrate(50);
        setFoodName('');
        setReaction('ok');
        setNotes('');
        setView('allergens'); // Go back to grid
    };

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Header / Tabs */}
            <div className="p-4 bg-slate-900 border-b border-white/5 flex gap-2">
                <button
                    onClick={() => setView('allergens')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${view === 'allergens' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    Rastreador de Alérgenos
                </button>
                <button
                    onClick={() => setView('log')}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${view === 'log' ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400'}`}
                >
                    Nuevo Alimento
                </button>
            </div>

            {view === 'allergens' ? (
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {COMMON_ALLERGENS.map(allergen => {
                            const status = allergenStatus[allergen.id];
                            return (
                                <div
                                    key={allergen.id}
                                    className={`relative p-4 rounded-2xl border transition-all ${status.allergy ? 'bg-red-500/10 border-red-500/30' :
                                            status.tried ? 'bg-emerald-500/10 border-emerald-500/30' :
                                                'bg-slate-800/50 border-white/5'
                                        }`}
                                >
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`p-2 rounded-xl ${status.tried ? (status.allergy ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400') : 'bg-slate-700/50 text-slate-500'}`}>
                                            <allergen.icon size={20} />
                                        </div>
                                        {status.tried && (
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${status.allergy ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                                {status.allergy ? 'Alergia' : 'Probado'}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className={`font-bold ${status.tried ? 'text-slate-200' : 'text-slate-500'}`}>{allergen.name}</h3>
                                    <p className="text-[10px] text-slate-500 mt-1">
                                        {status.tried ? `${status.count} registros` : 'No introducido'}
                                    </p>

                                    {/* Quick Log Button for this Allergen */}
                                    <button
                                        onClick={() => { setFoodName(allergen.name); setView('log'); }}
                                        className="absolute inset-0 w-full h-full"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <History size={12} />
                        Historial Reciente
                    </h3>
                    <div className="space-y-2">
                        {babyLogs.length === 0 && <p className="text-sm text-slate-500 italic text-center py-4">Sin registros</p>}
                        {babyLogs.slice().reverse().slice(0, 10).map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-800 rounded-xl border border-white/5">
                                <div>
                                    <p className="font-bold text-slate-200 text-sm">{log.food}</p>
                                    <p className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                                </div>
                                <div className="text-lg" title={log.reaction}>
                                    {log.reaction === 'love' ? '😋' : log.reaction === 'hate' ? '🤢' : log.reaction === 'allergy' ? '🚨' : '😐'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                // LOGGING FORM
                <div className="flex-1 overflow-y-auto p-6 animate-in slide-in-from-right-4">
                    <div className="mb-6">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Alimento</label>
                        <input
                            type="text"
                            value={foodName}
                            onChange={e => setFoodName(e.target.value)}
                            placeholder="Ej: Huevo, Cacahuete..."
                            className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-lg font-bold text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    <div className="mb-8">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Reacción</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'love', icon: '😋', label: 'Le encantó', color: 'bg-emerald-500/10 ring-emerald-500/50 text-emerald-200' },
                                { id: 'ok', icon: '😐', label: 'Aceptable', color: 'bg-slate-700/50 text-slate-300' },
                                { id: 'hate', icon: '🤢', label: 'Lo rechazó', color: 'bg-orange-500/10 ring-orange-500/50 text-orange-200' },
                                { id: 'allergy', icon: '🚨', label: 'Reacción Alérgica', color: 'bg-red-500/10 ring-red-500/50 text-red-200' }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setReaction(opt.id as any)}
                                    className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${reaction === opt.id
                                            ? `border-transparent ring-2 ${opt.color}`
                                            : 'bg-slate-800 border-white/5 opacity-60 hover:opacity-100'
                                        }`}
                                >
                                    <span className="text-2xl">{opt.icon}</span>
                                    <span className="text-sm font-bold">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Notas (Opcional)</label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            className="w-full bg-slate-800 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors min-h-[80px]"
                            placeholder="Cantidad, preparación..."
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!foodName}
                        className={`w-full py-4 rounded-xl font-bold text-lg transition-all mb-4 ${foodName ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-800 text-slate-500'}`}
                    >
                        Guardar Registro
                    </button>

                    <button onClick={() => setView('allergens')} className="w-full py-3 text-slate-400 font-bold text-sm">
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};
