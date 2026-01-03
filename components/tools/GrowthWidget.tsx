import React, { useState, useMemo, useEffect } from 'react';
import { Ruler, Scale, History, Check, Plus, AlertCircle, User, Baby, ChevronDown, Activity, X, Settings } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { useBaby, BabyProfile } from '../../services/BabyContext';
import { useLanguage } from '../../services/LanguageContext';
import { GrowthLog } from './types';
import { GrowthChart } from './visualizations/GrowthChart';

// --- Components ---

// 1. Dashboard Widget (Small Card)
export const GrowthDashboard: React.FC = () => {
    const { activeBaby } = useBaby();
    const { logs } = useToolData<GrowthLog>('growth');

    const latest = useMemo(() => {
        if (!activeBaby) return null;
        return logs.find(l => l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    if (!activeBaby) {
        return (
            <div className="flex flex-col items-center justify-center h-full opacity-50">
                <span className="text-xs">Sin perfil</span>
            </div>
        );
    }

    if (!latest) {
        return (
            <div className="flex flex-col h-full justify-center">
                <span className="text-xs text-slate-400">Sin registros</span>
                <span className="text-[10px] text-slate-600">para {activeBaby.name}</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full justify-between py-1">
            <div className="flex items-end gap-2">
                {latest.weightKg && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-emerald-500 font-bold uppercase">Peso</span>
                        <span className="text-sm font-bold text-emerald-200 leading-none">{latest.weightKg}<span className="text-[10px]">kg</span></span>
                    </div>
                )}
                {latest.heightCm && (
                    <div className="flex flex-col">
                        <span className="text-[10px] text-teal-500 font-bold uppercase">Altura</span>
                        <span className="text-sm font-bold text-teal-200 leading-none">{latest.heightCm}<span className="text-[10px]">cm</span></span>
                    </div>
                )}
            </div>
            <span className="text-[9px] text-slate-500 mt-1">
                {new Date(latest.timestamp).toLocaleDateString()}
            </span>
        </div>
    );
};

// 2. Inline Baby Creator (Onboarding)
const CreateBabyForm: React.FC<{ onSave: (b: Omit<BabyProfile, 'id'>) => void }> = ({ onSave }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl'>('boy');

    const handleSubmit = () => {
        if (!name || !date) return;
        const birthDate = new Date(date).getTime();
        onSave({ name, birthDate, gender });
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 h-full bg-slate-900 text-center space-y-6 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400 mb-2">
                <Baby size={40} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">¡Bienvenido!</h3>
                <p className="text-sm text-slate-400 max-w-xs mx-auto">Para comenzar a registrar el crecimiento, crea el perfil de tu bebé.</p>
            </div>

            <div className="w-full max-w-xs space-y-3 text-left">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nombre</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                        placeholder="Ej. Leo"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase ml-1">Sexo (para percentiles WHO)</label>
                    <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
                        <button
                            onClick={() => setGender('boy')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${gender === 'boy' ? 'bg-blue-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Niño
                        </button>
                        <button
                            onClick={() => setGender('girl')}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${gender === 'girl' ? 'bg-pink-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Niña
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!name || !date}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold mt-4 shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    Crear Perfil
                </button>
            </div>
        </div>
    );
};

// 3. Main Full View
export const GrowthFull: React.FC<{ onClose: () => void; onOpenSettings: () => void }> = ({ onClose, onOpenSettings }) => {
    const { addLog, logs, removeLog } = useToolData<GrowthLog>('growth');
    const { babies, activeBaby, setActiveBabyId, addBaby, updateBaby } = useBaby();

    // View State
    const [viewBabyId, setViewBabyId] = useState<string | null>(activeBaby?.id || null);
    const [tab, setTab] = useState<'weight' | 'height' | 'head' | 'all'>('weight'); // Added 'all'
    const [showAdd, setShowAdd] = useState(false);

    // Form State
    const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [formWeight, setFormWeight] = useState('');
    const [formHeight, setFormHeight] = useState('');
    const [formHead, setFormHead] = useState('');
    const [formBabyId, setFormBabyId] = useState<string>(activeBaby?.id || '');

    // Sync view with active (but allow independent viewing if we wanted)
    useEffect(() => {
        if (activeBaby && !viewBabyId) setViewBabyId(activeBaby.id);
    }, [activeBaby]);

    // Derived State
    const currentBaby = babies.find(b => b.id === viewBabyId) || babies[0];
    const filteredLogs = useMemo(() => {
        if (!currentBaby) return [];
        return logs.filter(l => l.babyId === currentBaby?.id).sort((a, b) => a.timestamp - b.timestamp);
    }, [logs, currentBaby]);

    // Handlers
    const handleSave = () => {
        if (!formWeight && !formHeight && !formHead) return;

        addLog({
            timestamp: new Date(formDate).getTime(),
            weightKg: formWeight ? parseFloat(formWeight.replace(',', '.')) : undefined,
            heightCm: formHeight ? parseFloat(formHeight.replace(',', '.')) : undefined,
            headCm: formHead ? parseFloat(formHead.replace(',', '.')) : undefined,
            babyId: formBabyId || currentBaby?.id // Use selected baby or current view
        });

        // Reset & Close
        setShowAdd(false);
        setFormWeight('');
        setFormHeight('');
        setFormHead('');
        // Keep date
    };

    if (babies.length === 0) {
        return <CreateBabyForm onSave={addBaby} />;
    }

    if (!currentBaby) return null; // Should not happen if babies > 0

    return (
        <div className="flex flex-col h-full bg-slate-950">
            {/* 1. Top Bar: Sticky Subheader for Context */}
            <div className="bg-slate-900/95 backdrop-blur-md border-b border-white/5 pb-2 sticky top-0 z-30 shadow-md">

                {/* Baby Switcher - Prominent Subheader */}
                <div className="px-4 py-3 overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Bebé:</span>
                        {babies.map(baby => (
                            <button
                                key={baby.id}
                                onClick={() => {
                                    setViewBabyId(baby.id);
                                    setActiveBabyId(baby.id); // Sync global active baby
                                }}
                                className={`relative pl-1.5 pr-3.5 py-1.5 rounded-full border transition-all flex items-center gap-2 ${viewBabyId === baby.id
                                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                            >
                                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${baby.gender === 'girl' ? 'bg-pink-100/20 text-pink-100' : 'bg-blue-100/20 text-blue-100'}`}>
                                    {baby.name[0].toUpperCase()}
                                </div>
                                <span className="text-xs font-bold">{baby.name}</span>
                            </button>
                        ))}
                        <button onClick={onOpenSettings} className="p-1.5 ml-auto rounded-full bg-slate-800 text-slate-500 hover:text-white border border-transparent hover:border-slate-700">
                            <Settings size={14} />
                        </button>
                    </div>
                </div>

                {/* Metric Tabs */}
                <div className="px-4 flex items-center justify-between mt-1">
                    <div className="flex bg-slate-800/80 p-1 rounded-xl w-full mr-2 overflow-x-auto no-scrollbar">
                        <button onClick={() => setTab('weight')} className={`flex-1 min-w-fit px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${tab === 'weight' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Peso</button>
                        <button onClick={() => setTab('height')} className={`flex-1 min-w-fit px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${tab === 'height' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Altura</button>
                        <button onClick={() => setTab('head')} className={`flex-1 min-w-fit px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${tab === 'head' ? 'bg-cyan-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Perímetro</button>
                        <button onClick={() => setTab('all')} className={`flex-1 min-w-fit px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${tab === 'all' ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Todos</button>
                    </div>

                    <button
                        onClick={() => {
                            setFormBabyId(currentBaby.id);
                            setShowAdd(true);
                        }}
                        className="shrink-0 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-900/20 active:scale-95 transition-all"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>

            {/* 2. Content Area */}
            <div className="flex-1 overflow-y-auto relative p-4 space-y-6">

                {/* Unified Add Modal (Overlay) */}
                {showAdd && (
                    <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm p-4 animate-in fade-in duration-200 flex items-start justify-center pt-10">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-5 w-full max-w-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-white">Nuevo Registro</h3>
                                <button onClick={() => setShowAdd(false)} className="p-2 -mr-2 text-slate-500 hover:text-white"><X size={20} /></button>
                            </div>

                            {/* Baby Selector in Form */}
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Bebé</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {babies.map(b => (
                                        <button
                                            key={b.id}
                                            onClick={() => setFormBabyId(b.id)}
                                            className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${formBabyId === b.id ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'bg-slate-800 border-transparent text-slate-500'}`}
                                        >
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${b.gender === 'girl' ? 'bg-pink-500 text-pink-100' : 'bg-blue-500 text-blue-100'}`}>{b.name[0]}</div>
                                            <span className="text-xs font-medium">{b.name}</span>
                                            {formBabyId === b.id && <Check size={14} className="ml-auto text-indigo-400" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-slate-500 uppercase">Fecha</label>
                                <input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white outline-none focus:border-indigo-500" />
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-emerald-500 uppercase">Peso (kg)</label>
                                    <input type="number" inputMode="decimal" placeholder="0.0" value={formWeight} onChange={e => setFormWeight(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2.5 text-white outline-none focus:border-emerald-500 font-mono text-center" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-teal-500 uppercase">Altura (cm)</label>
                                    <input type="number" inputMode="decimal" placeholder="0" value={formHeight} onChange={e => setFormHeight(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2.5 text-white outline-none focus:border-teal-500 font-mono text-center" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-cyan-500 uppercase">Perím. (cm)</label>
                                    <input type="number" inputMode="decimal" placeholder="0" value={formHead} onChange={e => setFormHead(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2.5 text-white outline-none focus:border-cyan-500 font-mono text-center" />
                                </div>
                            </div>

                            <button onClick={handleSave} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all">
                                Guardar Registro
                            </button>
                        </div>
                    </div>
                )}

                {/* Chart Section(s) */}
                {!currentBaby.birthDate ? (
                    <div className="flex flex-col items-center justify-center h-48 space-y-4 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                        <Activity className="text-slate-700 opacity-50" size={48} />
                        <p className="text-sm text-slate-400 max-w-[200px]">Se necesita fecha de nacimiento para calcular percentiles.</p>
                        <button onClick={onOpenSettings} className="text-xs font-bold text-indigo-400 hover:text-white uppercase tracking-wider border-b border-indigo-500/30 pb-0.5">Configurar Perfil</button>
                    </div>
                ) : (
                    <>
                        {/* If tab is 'all', map through properties, else show single */}
                        {(tab === 'all' ? ['weight', 'height', 'head'] as const : [tab]).map((chartType) => (
                            <div key={chartType} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 min-h-[220px]">
                                <div className="flex items-center justify-between mb-2">
                                    <h4 className={`text-xs font-bold uppercase tracking-wider ${chartType === 'weight' ? 'text-emerald-400' :
                                            chartType === 'height' ? 'text-teal-400' : 'text-cyan-400'
                                        }`}>
                                        {chartType === 'weight' ? 'Peso (kg)' :
                                            chartType === 'height' ? 'Altura (cm)' : 'Perímetro Craneal (cm)'}
                                    </h4>
                                </div>
                                <GrowthChart
                                    logs={filteredLogs}
                                    birthDate={currentBaby.birthDate}
                                    gender={currentBaby.gender}
                                    type={chartType as any}
                                />
                            </div>
                        ))}
                    </>
                )}

                {/* History List */}
                <div className="pb-20 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <History size={12} />
                        Historial: {currentBaby.name}
                    </h4>

                    {filteredLogs.length === 0 ? (
                        <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">
                            <p className="text-sm text-slate-500 font-medium">No hay registros aún</p>
                        </div>
                    ) : (
                        [...filteredLogs].reverse().map((log) => (
                            <div key={log.timestamp} className="bg-slate-900 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-white/10 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-lg ${tab === 'weight' ? 'bg-emerald-500/10 text-emerald-400' : (tab === 'height' ? 'bg-teal-500/10 text-teal-400' : (tab === 'head' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'))}`}>
                                        {tab === 'weight' ? <Scale size={18} /> : (tab === 'height' ? <Ruler size={18} /> : (tab === 'head' ? <AlertCircle size={18} /> : <Activity size={18} />))}
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-2">
                                            {/* Logic to show primary value depending on tab */}
                                            {tab !== 'all' ? (
                                                <>
                                                    <span className={`text-lg font-bold font-mono ${tab === 'weight' ? 'text-emerald-100' : (tab === 'height' ? 'text-teal-100' : 'text-cyan-100')}`}>
                                                        {tab === 'weight' ? (log.weightKg || '--') : (tab === 'height' ? (log.heightCm || '--') : (log.headCm || '--'))}
                                                    </span>
                                                    <span className="text-xs text-slate-500 font-medium">
                                                        {tab === 'weight' ? 'kg' : 'cm'}
                                                    </span>
                                                </>
                                            ) : (
                                                <span className="text-sm font-bold text-slate-200">Registro Completo</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-slate-500 capitalize">
                                            {new Date(log.timestamp).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })}
                                        </span>
                                    </div>
                                </div>

                                {/* Secondary Values (Small) - Show all available */}
                                <div className="flex flex-col items-end gap-1 text-[10px] text-slate-600 font-mono">
                                    {(tab === 'all' || tab !== 'weight') && log.weightKg && <span className="text-emerald-500/70">{log.weightKg}kg</span>}
                                    {(tab === 'all' || tab !== 'height') && log.heightCm && <span className="text-teal-500/70">{log.heightCm}cm</span>}
                                    {(tab === 'all' || tab !== 'head') && log.headCm && <span className="text-cyan-500/70">HC:{log.headCm}</span>}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
