import React, { useState, useMemo } from 'react';
import { Pill, Check, Clock, History, Plus, Trash2, TrendingUp, Bell, BellOff, Edit2, X } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { MedsLog } from './types';
import { useBaby } from '../../services/BabyContext';
import { LastDaysChart } from './visualizations/LastDaysChart';
import { TimelineChart } from './visualizations/TimelineChart';

const VITAMIN_D_KEY = 'Vit D';

export const MedsDashboard: React.FC = () => {
    const { logs } = useToolData<MedsLog>('meds');
    const { activeBaby } = useBaby();

    // Latest filtered log
    const { latest, hasVitD } = useMemo(() => {
        const babyLogs = !activeBaby ? logs : logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
        const l = babyLogs.length > 0 ? babyLogs[0] : null; // Sorted by timestamp desc in useToolData usually

        // Check Vit D today
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const hasD = babyLogs.some(log => log.medName === VITAMIN_D_KEY && log.timestamp >= startOfDay);

        return { latest: l, hasVitD: hasD };
    }, [logs, activeBaby]);

    return (
        <div className="flex flex-col gap-1">
            <div className={`flex items-center gap-1.5 text-xs font-bold ${hasVitD ? 'text-emerald-400' : 'text-red-300'}`}>
                {hasVitD ? <Check size={12} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full border border-current" />}
                Vit D: {hasVitD ? 'Hecha' : 'Pendiente'}
            </div>
            {latest && latest.medName !== VITAMIN_D_KEY && (
                <span className="text-[10px] opacity-70 truncate max-w-[120px]">
                    Último: {latest.medName}
                </span>
            )}
        </div>
    );
};


interface Treatment {
    id: string;
    name: string;
    dose: string;
    frequency?: string; // e.g. "8h"
    notify: boolean;
    color: string;
}

const COLORS = [
    'text-pink-400 bg-pink-500/10 border-pink-500/20',
    'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'text-purple-400 bg-purple-500/10 border-purple-500/20',
];

export const MedsFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs, removeLog } = useToolData<MedsLog>('meds');
    const { activeBaby } = useBaby();

    // Treatments Configuration State
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [showConfig, setShowConfig] = useState(false);

    // New Treatment Form
    const [newName, setNewName] = useState('');
    const [newDose, setNewDose] = useState('');
    const [newNotify, setNewNotify] = useState(false);

    // Initialize Treatments
    React.useEffect(() => {
        const saved = localStorage.getItem('nanapp_treatments');
        if (saved) {
            setTreatments(JSON.parse(saved));
        } else {
            // Default seed
            setTreatments([
                { id: 'vitd', name: 'Vitamina D', dose: '1 gota', notify: true, color: COLORS[2] },
                { id: 'api', name: 'Apiretal', dose: 'Según peso', notify: false, color: COLORS[0] }
            ]);
        }
    }, []);

    // Save Treatments
    React.useEffect(() => {
        if (treatments.length > 0) {
            localStorage.setItem('nanapp_treatments', JSON.stringify(treatments));
        }
    }, [treatments]);

    // Filter logs for active baby
    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    // Add Log
    const handleTake = (t: Treatment) => {
        addLog({
            medName: t.name,
            dose: t.dose,
            babyId: activeBaby?.id
        });
        if (navigator.vibrate) navigator.vibrate(50);

        // If notify enabled, we could schedule next... (Browser Push API needed ideally)
        if (t.notify && 'Notification' in window && Notification.permission === 'granted') {
            // Example placeholder for future notification logic
            // new Notification(`Próxima dosis de ${t.name} en...`);
        } else if (t.notify && 'Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }
    };

    const handleAddTreatment = () => {
        if (!newName) return;
        const newTreatment: Treatment = {
            id: Date.now().toString(),
            name: newName,
            dose: newDose,
            notify: newNotify,
            color: COLORS[treatments.length % COLORS.length]
        };
        setTreatments([...treatments, newTreatment]);
        setNewName('');
        setNewDose('');
        setShowConfig(false);
    };

    const handleDeleteTreatment = (id: string) => {
        setTreatments(prev => prev.filter(t => t.id !== id));
    };

    // Visualization Data
    const timelineEvents = useMemo(() => {
        return babyLogs.map(log => {
            // Try to match color from treatment
            const treatment = treatments.find(t => t.name === log.medName);
            const colorClass = treatment ? treatment.color.split(' ')[1].replace('/10', '/50') : 'bg-slate-500';

            return {
                timestamp: log.timestamp,
                type: 'event' as const,
                label: log.medName,
                color: colorClass
            };
        });
    }, [babyLogs, treatments]);

    return (
        <div className="flex flex-col h-full bg-slate-900">

            {/* Header / Config Toggle */}
            <div className="p-4 flex justify-between items-center border-b border-white/5">
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tratamientos Activos</h2>
                <button
                    onClick={() => setShowConfig(!showConfig)}
                    className={`p-2 rounded-full transition-colors ${showConfig ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-500'}`}
                >
                    {showConfig ? <X size={18} /> : <Edit2 size={18} />}
                </button>
            </div>

            {/* Config Panel */}
            {showConfig && (
                <div className="p-4 bg-slate-800/80 border-b border-white/5 animate-in slide-in-from-top-2">
                    <div className="space-y-3">
                        <input
                            value={newName}
                            onChange={e => setNewName(e.target.value)}
                            placeholder="Nombre (ej: Ibuprofeno)"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        />
                        <input
                            value={newDose}
                            onChange={e => setNewDose(e.target.value)}
                            placeholder="Dosis (ej: 2.5ml)"
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                        />
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setNewNotify(!newNotify)}
                                className={`flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-lg border transition-all ${newNotify ? 'bg-blue-500/20 border-blue-500 text-blue-300' : 'bg-slate-900 border-slate-700 text-slate-500'}`}
                            >
                                {newNotify ? <Bell size={14} /> : <BellOff size={14} />}
                                {newNotify ? 'Recordatorios ON' : 'Sin avisos'}
                            </button>
                            <button
                                onClick={handleAddTreatment}
                                disabled={!newName}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Treatments List */}
            <div className="p-4 grid grid-cols-1 gap-3 shrink-0">
                {treatments.map(t => {
                    const lastLog = babyLogs.find(l => l.medName === t.name); // Logs are usually sorted new to old? Check useToolData. Defaults to append.
                    // Actually useToolData append adds to end. So last log is at end? 
                    // Wait, useToolData 'logs' usually aren't sorted by default unless the tool does it. 
                    // Let's assume we find the latest by sorting or finding.
                    const lastTaken = babyLogs.filter(l => l.medName === t.name).sort((a, b) => b.timestamp - a.timestamp)[0];
                    const isTakenToday = lastTaken && new Date(lastTaken.timestamp).toDateString() === new Date().toDateString();

                    return (
                        <div key={t.id} className={`flex items-center justify-between p-4 rounded-xl border ${t.color}`}>
                            <div className="flex items-center gap-4">
                                <div>
                                    <h3 className="font-bold text-base">{t.name}</h3>
                                    <p className="text-xs opacity-70 flex items-center gap-1">
                                        {t.dose}
                                        {t.notify && <Bell size={10} />}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    {isTakenToday ? (
                                        <span className="text-[10px] font-bold opacity-60 flex items-center justify-end gap-1">
                                            <Check size={10} /> Hoy
                                        </span>
                                    ) : (
                                        <span className="text-[10px] font-bold opacity-40">Pendiente</span>
                                    )}
                                    {lastTaken && (
                                        <p className="text-[10px] opacity-50">
                                            Hace {Math.floor((Date.now() - lastTaken.timestamp) / 3600000)}h
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleTake(t)}
                                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors active:scale-95"
                                >
                                    <Plus size={20} />
                                </button>

                                {showConfig && (
                                    <button
                                        onClick={() => handleDeleteTreatment(t.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {treatments.length === 0 && !showConfig && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        <p>No hay tratamientos configurados.</p>
                        <button onClick={() => setShowConfig(true)} className="text-blue-400 underline mt-1">Configurar ahora</button>
                    </div>
                )}
            </div>

            {/* Visualization */}
            <div className="flex-1 overflow-hidden flex flex-col pt-4 border-t border-white/5 bg-slate-900/50">
                <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <TrendingUp size={12} />
                    Evolución (Últimas 48h)
                </h3>
                <div className="flex-1 px-4 min-h-[100px]">
                    <TimelineChart events={timelineEvents} height={120} />
                </div>

                {/* Raw History List */}
                <div className="flex-1 overflow-y-auto px-4 pb-6 mt-4">
                    <div className="space-y-2">
                        {babyLogs.sort((a, b) => b.timestamp - a.timestamp).slice(0, 10).map((l, i) => (
                            <div key={i} className="flex justify-between items-center text-xs text-slate-400 py-2 border-b border-white/5">
                                <span>{l.medName}</span>
                                <span>{new Date(l.timestamp).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};
