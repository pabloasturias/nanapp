import React, { useState, useMemo, useEffect } from 'react';
import { Trophy, Check, Star, Plus, Search } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { MilestoneLog } from './types';
import { useBaby } from '../../services/BabyContext';

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
    const { logs } = useToolData<MilestoneLog>('milestones');
    const { activeBaby } = useBaby();

    // Find latest log for active baby
    const latest = logs
        .filter(l => !l.babyId || (activeBaby && l.babyId === activeBaby.id))
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    // Find label
    const m = COMMON_MILESTONES.find(x => x.id === latest.milestoneId);

    return (
        <div className="flex flex-col">
            <span className="font-bold text-yellow-200 truncate">
                {m ? m.label : (latest.note || 'Hito logrado')}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const MilestonesFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { logs, addLog, removeLog } = useToolData<MilestoneLog>('milestones');
    const { activeBaby, babies, setActiveBabyId } = useBaby();

    const [viewBabyId, setViewBabyId] = useState<string | null>(activeBaby?.id || null);
    const [isAddingCustom, setIsAddingCustom] = useState(false);
    const [customText, setCustomText] = useState('');
    const [selectedMilestone, setSelectedMilestone] = useState<{ id: string, label: string } | null>(null);
    const [date, setDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (activeBaby && !viewBabyId) setViewBabyId(activeBaby.id);
    }, [activeBaby]);

    const currentBaby = babies.find(b => b.id === viewBabyId) || babies[0];

    // Filter logs for this baby
    const babyLogs = useMemo(() => {
        if (!currentBaby) return [];
        return logs.filter(l => !l.babyId || l.babyId === currentBaby.id);
    }, [logs, currentBaby]);

    const EXTENDED_MILESTONES = [
        {
            category: '0-2 Meses', items: [
                { id: 'smile', label: 'Sonrisa Social' },
                { id: 'eye_contact', label: 'Mantiene contacto visual' },
                { id: 'sounds', label: 'Emite sonidos guturales' },
                { id: 'lift_head_prone', label: 'Levanta cabeza boca abajo' },
                { id: 'track_object', label: 'Sigue objetos con la vista' }
            ]
        },
        {
            category: '2-4 Meses', items: [
                { id: 'head_up', label: 'Sostiene la cabeza firme' },
                { id: 'hands_open', label: 'Manos abiertas la mayoría del tiempo' },
                { id: 'grab_object', label: 'Agarra objetos (sonajero)' },
                { id: 'push_legs', label: 'Empuja con las piernas' },
                { id: 'coo', label: 'Gorjeos y "Ajo"' }
            ]
        },
        {
            category: '4-6 Meses', items: [
                { id: 'roll', label: 'Se da la vuelta (boca abajo a arriba)' },
                { id: 'roll_back', label: 'Se da la vuelta (boca arriba a abajo)' },
                { id: 'laugh', label: 'Ríe a carcajadas' },
                { id: 'feet_mouth', label: 'Se lleva los pies a la boca' },
                { id: 'reach_both', label: 'Alcanza objetos con ambas manos' },
                { id: 'sit_support', label: 'Se sienta con apoyo' }
            ]
        },
        {
            category: '6-9 Meses', items: [
                { id: 'sit', label: 'Se mantiene sentado sin apoyo' },
                { id: 'crawl_commando', label: 'Reptar (arrastrarse)' },
                { id: 'transfer_hand', label: 'Pasa objetos de una mano a otra' },
                { id: 'babbles', label: 'Balbucea (ba-ba, ma-ma)' },
                { id: 'stranger_anxiety', label: 'Extraña a desconocidos' },
                { id: 'peekaboo', label: 'Juega al "Cu-cu tras"' }
            ]
        },
        {
            category: '9-12 Meses', items: [
                { id: 'crawl', label: 'Gatea' },
                { id: 'stand', label: 'Se pone de pie agarrándose' },
                { id: 'cruise', label: 'Camina agarrado a muebles' },
                { id: 'pincer', label: 'Pinza fina (índice y pulgar)' },
                { id: 'first_word', label: 'Primera palabra con sentido' },
                { id: 'wave', label: 'Dice adiós con la mano' }
            ]
        },
        {
            category: '12-18 Meses', items: [
                { id: 'walk', label: 'Camina solo' },
                { id: 'point', label: 'Señala para pedir' },
                { id: 'drink_cup', label: 'Bebe de un vaso' },
                { id: 'stack_blocks', label: 'Apila 2 boques' },
                { id: 'follow_command', label: 'Sigue órdenes sencillas' },
                { id: 'run_clumsy', label: 'Corre (torpemente)' }
            ]
        },
        {
            category: '18-24 Meses', items: [
                { id: 'run', label: 'Corre bien' },
                { id: 'kick_ball', label: 'Chuta una pelota' },
                { id: 'combine_words', label: 'Junta dos palabras' },
                { id: 'eat_spoon', label: 'Come con cuchara' },
                { id: 'stairs', label: 'Sube escaleras' },
                { id: 'tantrums', label: 'Muestra rabietas (independencia)' }
            ]
        },

        {
            category: '2-3 Años', items: [
                { id: 'jump', label: 'Salta con ambos pies' },
                { id: 'sentences', label: 'Frases de 3+ palabras' },
                { id: 'dress_self', label: 'Se viste solo (prendas sencillas)' },
                { id: 'tricycle', label: 'Pedalea triciclo' },
                { id: 'circle', label: 'Copia un círculo' }
            ]
        },
        {
            category: '3-4 Años', items: [
                { id: 'hop', label: 'Salta a la pata coja' },
                { id: 'draw_person', label: 'Dibuja una persona (2-4 partes)' },
                { id: 'scissors', label: 'Usa tijeras' },
                { id: 'story', label: 'Cuenta partes de una historia' },
                { id: 'toilet', label: 'Control de esfínteres (día)' }
            ]
        }
    ];

    const getLog = (id: string) => babyLogs.find(l => l.milestoneId === id);

    const handleMilestoneClick = (id: string, label: string) => {
        const existing = getLog(id);
        if (existing) {
            if (confirm(`¿Eliminar el hito "${label}"?`)) {
                // Remove ensuring we only remove for this baby (or unassigned) specific milestone
                removeLog(l => l.milestoneId === id && (!l.babyId || l.babyId === currentBaby.id));
            }
        } else {
            setSelectedMilestone({ id, label });
            // Default to now locally conditioned
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setDate(now.toISOString().slice(0, 16));
        }
    };

    const confirmAdd = () => {
        if (!selectedMilestone || !date || !currentBaby) return;

        addLog({
            timestamp: new Date(date).getTime(),
            milestoneId: selectedMilestone.id,
            note: selectedMilestone.id.startsWith('custom:') ? selectedMilestone.label : undefined,
            babyId: currentBaby.id
        });

        setSelectedMilestone(null);
        setIsAddingCustom(false);
        setCustomText('');
    };

    const handleAddCustom = () => {
        if (!customText.trim()) return;
        const id = `custom:${Date.now()}`;
        setSelectedMilestone({ id, label: customText });
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        setDate(now.toISOString().slice(0, 16));
    };

    // Extract custom logs to display them too
    const customLogs = babyLogs.filter(l => l.milestoneId.startsWith('custom:'));

    return (
        <div className="flex flex-col h-full relative bg-slate-950">
            {/* Sticky Header: Baby Selector & Title */}
            <div className="bg-slate-900/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-30 shadow-md flex flex-col">
                <div className="p-4 flex flex-col gap-4 pb-2">
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-lg text-white">Hitos</h3>
                        <button
                            onClick={() => setIsAddingCustom(true)}
                            className="p-2 bg-slate-800 rounded-full text-slate-300 hover:text-white"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {/* Search Bar */}
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar hito..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-yellow-500 placeholder-slate-600"
                        />
                    </div>
                </div>

                <div className="px-4 py-2 overflow-x-auto no-scrollbar pb-3">
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
                                    ? 'bg-yellow-600 border-yellow-500 text-white shadow-md'
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* Custom Milestones Section if any */}
                {customLogs.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-yellow-500 uppercase tracking-widest px-1">Personalizados</h4>
                        {customLogs.map(log => (
                            <button
                                key={log.milestoneId}
                                onClick={() => handleMilestoneClick(log.milestoneId, log.note || 'Hito Personalizado')}
                                className="w-full text-left p-4 rounded-xl border border-yellow-500/50 bg-yellow-500/10 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-yellow-500 text-slate-900 flex items-center justify-center">
                                        <Trophy size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-yellow-200">{log.note || 'Hito Personalizado'}</p>
                                        <p className="text-[10px] text-yellow-200/70">Personalizado</p>
                                    </div>
                                </div>
                                <span className="text-xs text-yellow-300 font-mono opacity-70">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {EXTENDED_MILESTONES.map((group) => {
                    // Filter items
                    const filteredItems = group.items.filter(item =>
                        !searchTerm ||
                        item.label.toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={group.category} className="space-y-3">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 pt-4 first:pt-0">{group.category}</h4>
                            <div className="space-y-2">
                                {filteredItems.map((m) => {
                                    const log = getLog(m.id);
                                    const done = !!log;

                                    return (
                                        <button
                                            key={m.id}
                                            onClick={() => handleMilestoneClick(m.id, m.label)}
                                            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${done
                                                ? 'bg-yellow-500/20 border-yellow-500/50'
                                                : 'bg-slate-900 border-white/5 hover:bg-slate-800'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${done ? 'bg-yellow-500 text-slate-900' : 'bg-slate-800 text-slate-600'}`}>
                                                    {done ? <Trophy size={20} /> : <Star size={20} />}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-bold ${done ? 'text-yellow-200' : 'text-slate-300'}`}>{m.label}</p>
                                                </div>
                                            </div>
                                            {done && (
                                                <span className="text-xs text-yellow-300 font-mono opacity-70">
                                                    {new Date(log.timestamp).toLocaleDateString()}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Date Selection Modal */}
            {selectedMilestone && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white">¿Cuándo ocurrió?</h3>
                        <p className="text-slate-400 text-sm">{selectedMilestone.label}</p>

                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Para:</span>
                            <span className="text-xs font-bold text-yellow-400">{currentBaby?.name}</span>
                        </div>

                        <input
                            type="datetime-local"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500"
                        />

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setSelectedMilestone(null)}
                                className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold hover:bg-slate-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmAdd}
                                className="flex-1 py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Milestone Input Modal */}
            {isAddingCustom && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-slate-900 border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-white">Nuevo Hito Personalizado</h3>

                        <input
                            type="text"
                            placeholder="Ej: Dice 'Mamá' por primera vez"
                            value={customText}
                            onChange={e => setCustomText(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-yellow-500 placeholder-slate-600"
                            autoFocus
                        />

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setIsAddingCustom(false)}
                                className="flex-1 py-3 bg-slate-800 text-slate-400 rounded-xl font-bold hover:bg-slate-700"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddCustom}
                                disabled={!customText.trim()}
                                className="flex-1 py-3 bg-yellow-500 text-slate-900 rounded-xl font-bold hover:bg-yellow-400 disabled:opacity-50"
                            >
                                Continuar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
