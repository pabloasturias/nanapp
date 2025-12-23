import React, { useState, useMemo } from 'react';
import { Ruler, Scale, History, Calendar, Check, Plus, AlertCircle, Settings } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { useBaby } from '../../services/BabyContext';
import { useLanguage } from '../../services/LanguageContext'; // For strings
import { GrowthLog } from './types';
import { GrowthChart } from './visualizations/GrowthChart';

export const GrowthDashboard: React.FC = () => {
    const { getLatestLog } = useToolData<GrowthLog>('growth');
    const { activeBaby } = useBaby();
    // TODO: Filter getLatestLog by babyId if we update useToolData to support it. 
    // For now, it returns global latest. Ideally we filter manually.
    // But useToolData doesn't expose list in getLatestLog call.
    // Use raw logs
    const { logs } = useToolData<GrowthLog>('growth');

    const latest = useMemo(() => {
        if (!activeBaby) return logs[0]; // Fallback
        return logs.find(l => l.babyId === activeBaby.id) || logs[0];
    }, [logs, activeBaby]);

    if (!latest) return <span className="opacity-60">Sin registros</span>;

    return (
        <div className="flex flex-col">
            <span className="font-bold text-emerald-200">
                {latest.weightKg ? `${latest.weightKg}kg` : ''}
                {latest.weightKg && latest.heightCm ? ' · ' : ''}
                {latest.heightCm ? `${latest.heightCm}cm` : ''}
            </span>
            <span className="text-[10px] opacity-70">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

export const GrowthFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const { addLog, logs, removeLog } = useToolData<GrowthLog>('growth');
    const { activeBaby, updateBaby, abies } = useBaby();

    const [tab, setTab] = useState<'weight' | 'height'>('weight');
    const [showAdd, setShowAdd] = useState(false);

    // Inputs
    const [weight, setWeight] = useState<string>('');
    const [height, setHeight] = useState<string>('');
    const [head, setHead] = useState<string>('');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

    // Birthdate Input (if missing)
    const [tempBirthDate, setTempBirthDate] = useState('');

    const filteredLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const handleSave = () => {
        if (!weight && !height && !head) return;

        const timestamp = new Date(date).getTime();

        addLog({
            timestamp,
            weightKg: weight ? parseFloat(weight.replace(',', '.')) : undefined,
            heightCm: height ? parseFloat(height.replace(',', '.')) : undefined,
            headCm: head ? parseFloat(head.replace(',', '.')) : undefined,
            babyId: activeBaby?.id
        });

        setShowAdd(false);
        setWeight('');
        setHeight('');
        setHead('');
    };

    const handleSetBirthDate = () => {
        if (activeBaby && tempBirthDate) {
            const parts = tempBirthDate.split('-');
            const ts = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])).getTime();
            updateBaby(activeBaby.id, { birthDate: ts });
        }
    };

    if (!activeBaby) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className="p-4 bg-slate-800 rounded-full">
                    <AlertCircle size={32} className="text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-200">Perfil Requerido</h3>
                <p className="text-sm text-slate-400">Para seguir el crecimiento y ver percentiles, necesitas crear o seleccionar un perfil de bebé.</p>
                <button onClick={onClose} className="px-6 py-3 bg-indigo-600 rounded-xl text-white font-bold">
                    Ir a Ajustes
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-slate-900">
            {/* Header / Tabs */}
            <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex bg-slate-800 p-1 rounded-xl">
                    <button
                        onClick={() => setTab('weight')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'weight' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Peso
                    </button>
                    <button
                        onClick={() => setTab('height')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${tab === 'height' ? 'bg-teal-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Altura
                    </button>
                </div>
                {/* Add Button */}
                <button
                    onClick={() => setShowAdd(!showAdd)}
                    className={`p-2 rounded-xl border transition-all ${showAdd ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-800 border-slate-700 text-indigo-400'}`}
                >
                    {showAdd ? <Check size={20} /> : <Plus size={20} />}
                </button>
            </div>

            {/* Add Panel */}
            {showAdd && (
                <div className="p-4 bg-slate-800/80 border-b border-slate-700 animate-in slide-in-from-top-4 space-y-4 shrink-0">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha</label>
                            <input
                                type="date"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">{tab === 'weight' ? 'Peso (kg)' : 'Altura (cm)'}</label>
                            <input
                                type="number" inputMode="decimal"
                                value={tab === 'weight' ? weight : height}
                                onChange={e => tab === 'weight' ? setWeight(e.target.value) : setHeight(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-emerald-500 outline-none font-mono"
                            />
                        </div>
                    </div>

                    {/* Optional Head Input */}
                    {tab === 'height' && (
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Perímetro Craneal (Opcl)</label>
                            <input
                                type="number" inputMode="decimal"
                                value={head}
                                onChange={e => setHead(e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 outline-none font-mono"
                            />
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm"
                    >
                        Guardar
                    </button>
                </div>
            )}

            {/* Chart Area */}
            <div className="shrink-0 p-4 border-b border-slate-800 bg-slate-900/50">
                {!activeBaby.birthDate ? (
                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4 text-center space-y-3">
                        <p className="text-orange-200 text-sm font-medium">Configura fecha de nacimiento para ver percentiles</p>
                        <div className="flex gap-2 max-w-[200px] mx-auto">
                            <input
                                type="date"
                                value={tempBirthDate}
                                onChange={e => setTempBirthDate(e.target.value)}
                                className="flex-1 bg-slate-900 border border-orange-500/30 rounded-lg px-2 py-1 text-xs text-orange-100"
                            />
                            <button
                                onClick={handleSetBirthDate}
                                disabled={!tempBirthDate}
                                className="px-3 py-1 bg-orange-500 rounded-lg text-white text-xs font-bold disabled:opacity-50"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                ) : (
                    <GrowthChart
                        logs={filteredLogs}
                        birthDate={activeBaby.birthDate}
                        gender={activeBaby.gender}
                        type={tab}
                    />
                )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {filteredLogs.slice().reverse().map((log, i) => (
                    <div key={log.timestamp} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${tab === 'weight' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-teal-500/10 text-teal-400'}`}>
                                {tab === 'weight' ? <Scale size={16} /> : <Ruler size={16} />}
                            </div>
                            <div>
                                <span className={`block text-sm font-bold ${tab === 'weight' ? 'text-emerald-200' : 'text-teal-200'}`}>
                                    {tab === 'weight' ? (log.weightKg ? `${log.weightKg}kg` : '-') : (log.heightCm ? `${log.heightCm}cm` : '-')}
                                </span>
                                <span className="text-[10px] text-slate-500">
                                    {new Date(log.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        {/* If chart shows more info, maybe show secondary value? */}
                        {tab === 'weight' && log.heightCm && <span className="text-xs text-slate-600">{log.heightCm}cm</span>}
                        {tab === 'height' && log.weightKg && <span className="text-xs text-slate-600">{log.weightKg}kg</span>}
                    </div>
                ))}
                {filteredLogs.length === 0 && (
                    <div className="text-center py-10 opacity-30">
                        <History size={48} className="mx-auto mb-2" />
                        <p className="text-xs">No hay registros</p>
                    </div>
                )}
            </div>
        </div>
    );
};

