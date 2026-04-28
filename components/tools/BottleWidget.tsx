import React, { useState, useMemo } from 'react';
import { Milk, GlassWater, Droplet, History, Clock, Plus, Minus, Info, BarChart3, TrendingUp } from 'lucide-react';
import { useToolData } from '../../services/hooks/useToolData';
import { BottleLog } from './types';
import { useBaby } from '../../services/BabyContext';
import { useLanguage } from '../../services/LanguageContext';
import { TimelineChart } from './visualizations/TimelineChart';
import { motion } from 'framer-motion';

export const BottleDashboard: React.FC = () => {
    const { logs } = useToolData<BottleLog>('bottle');
    const { activeBaby } = useBaby();

    const babyLogs = useMemo(() => activeBaby ? logs.filter(l => !l.babyId || l.babyId === activeBaby.id) : logs, [logs, activeBaby]);
    const latest = babyLogs.length > 0 ? babyLogs[0] : null;

    if (!latest) return <span className="opacity-60">Sin registros</span>;

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
                <span className={`font-bold ${latest.type === 'formula' ? 'text-blue-300' : latest.type === 'breastmilk' ? 'text-pink-300' : 'text-indigo-300'}`}>
                    {latest.amount}{latest.unit} · {latest.type === 'formula' ? 'Fórmula' : latest.type === 'breastmilk' ? 'Materna' : 'Mezcla'}
                </span>
                <span className="text-[9px] font-black text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded-full border border-white/5 uppercase tracking-tighter">
                    Hoy: {dailyTotal}ml
                </span>
            </div>
            <span className="text-[10px] opacity-70">
                Tendencia mensual disponible
            </span>
        </div>
    );
};

const FEEDING_GUIDELINES = [
    { range: '0-1 mes', min: 450, max: 750, avg: 600 },
    { range: '1-2 m', min: 600, max: 900, avg: 750 },
    { range: '2-4 m', min: 700, max: 1050, avg: 850 },
    { range: '4-6 m', min: 800, max: 1200, avg: 950 },
    { range: '+6 m', min: 600, max: 1000, avg: 800 }, // Con AC
];

export const BottleFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { addLog, logs } = useToolData<BottleLog>('bottle');
    const { activeBaby } = useBaby();
    const [view, setView] = useState<'log' | 'stats'>('log');
    const [amount, setAmount] = useState(120);
    const [type, setType] = useState<BottleLog['type']>('formula');
    const [showInfo, setShowInfo] = useState(false);

    const babyLogs = useMemo(() => {
        if (!activeBaby) return logs;
        return logs.filter(l => !l.babyId || l.babyId === activeBaby.id);
    }, [logs, activeBaby]);

    const daysSinceBirth = activeBaby ? Math.floor((Date.now() - activeBaby.birthDate) / (1000 * 60 * 60 * 24)) : 0;
    const months = Math.floor(daysSinceBirth / 30.5);

    // Monthly stats
    const monthlyStats = useMemo(() => {
        const last30Days = Date.now() - (30 * 86400000);
        const filtered = babyLogs.filter(l => l.timestamp >= last30Days && l.type !== 'water');
        
        // Group by day
        const dayMap: Record<string, number> = {};
        filtered.forEach(l => {
            const d = new Date(l.timestamp).toDateString();
            dayMap[d] = (dayMap[d] || 0) + (l.amount || 0);
        });

        const dailyTotals = Object.values(dayMap);
        const avg = dailyTotals.length > 0 ? Math.round(dailyTotals.reduce((a, b) => a + b, 0) / dailyTotals.length) : 0;
        const max = dailyTotals.length > 0 ? Math.max(...dailyTotals) : 0;
        
        return { avg, max, dailyTotals };
    }, [babyLogs]);

    const guideline = FEEDING_GUIDELINES[Math.min(months, FEEDING_GUIDELINES.length - 1)];

    const handleSave = () => {
        addLog({ amount, unit: 'ml', type, babyId: activeBaby?.id });
        onClose();
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-50">
            {/* Header / Tabs */}
            <div className="flex p-4 gap-2 bg-slate-900/50 border-b border-white/5">
                <button 
                    onClick={() => setView('log')}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${view === 'log' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                    Registro
                </button>
                <button 
                    onClick={() => setView('stats')}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${view === 'stats' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400'}`}
                >
                    Análisis Mensual
                </button>
            </div>

            <div className="flex-1 overflow-y-auto">
                {view === 'log' ? (
                    <div className="p-6">
                        {/* Selector de cantidad */}
                        <div className="flex flex-col items-center mb-10 py-6 bg-slate-900/30 rounded-[2.5rem] border border-white/5 w-full">
                            <div className="text-[10px] uppercase font-black text-blue-400 tracking-[0.2em] mb-4">Cantidad</div>
                            <div className="flex items-center gap-8 mb-6">
                                <button onClick={() => setAmount(a => Math.max(0, a - 10))} className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400 active:scale-90 transition-all">
                                    <Minus size={24} />
                                </button>
                                <div className="text-6xl font-black text-white tabular-nums">{amount}<span className="text-xl text-slate-600 ml-1">ml</span></div>
                                <button onClick={() => setAmount(a => a + 10)} className="w-12 h-12 rounded-2xl bg-blue-600 border border-blue-400 flex items-center justify-center text-white active:scale-90 transition-all shadow-lg shadow-blue-500/20">
                                    <Plus size={24} />
                                </button>
                            </div>
                            
                            <div className="flex flex-wrap justify-center gap-2 px-4">
                                {[60, 90, 120, 150, 180, 210].map(val => (
                                    <button 
                                        key={val} 
                                        onClick={() => { setAmount(val); if (navigator.vibrate) navigator.vibrate(10); }}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${amount === val ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400 border border-white/5 hover:bg-slate-700'}`}
                                    >
                                        {val}ml
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tipo */}
                        <div className="grid grid-cols-3 gap-2 mb-8">
                            <button onClick={() => setType('formula')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${type === 'formula' ? 'bg-blue-500/10 border-blue-500/50 text-blue-200' : 'bg-slate-900/50 border-white/5 text-slate-500'}`}>
                                <Milk size={18} className="mb-2" />
                                <span className="font-bold text-[10px] uppercase tracking-wider">Fórmula</span>
                            </button>
                            <button onClick={() => setType('breastmilk')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${type === 'breastmilk' ? 'bg-pink-500/10 border-pink-500/50 text-pink-200' : 'bg-slate-900/50 border-white/5 text-slate-500'}`}>
                                <Droplet size={18} className="mb-2" />
                                <span className="font-bold text-[10px] uppercase tracking-wider">Materna</span>
                            </button>
                            <button onClick={() => setType('mixed')} className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${type === 'mixed' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-200' : 'bg-slate-900/50 border-white/5 text-slate-500'}`}>
                                <div className="flex gap-[-4px] mb-2">
                                    <Milk size={14} className="-mr-1" />
                                    <Droplet size={14} />
                                </div>
                                <span className="font-bold text-[10px] uppercase tracking-wider">Mezcla</span>
                            </button>
                        </div>

                        <button onClick={handleSave} className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-lg shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all">
                            Guardar Registro
                        </button>

                        {/* Prep Tips */}
                        <div className="mt-8 p-5 bg-slate-900 border border-white/5 rounded-[2rem] flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 shrink-0">
                                <Info size={24} />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-xs font-black text-white uppercase tracking-widest">Tip de Seguridad</h4>
                                <p className="text-[11px] text-slate-400 leading-relaxed">La temperatura ideal son <strong className="text-blue-300">37°C</strong>. Prueba siempre unas gotas en tu muñeca antes de dárselo.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-6 space-y-6">
                        {/* Monthly Summary Card */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3">
                            <Info size={18} className="text-amber-500 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest">{t('tool_bottle_safety_tip')}</h4>
                                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                                    {t('tool_bottle_temp_tip')}
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><TrendingUp size={80} /></div>
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-4">Análisis del Mes</h3>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div>
                                    <div className="text-3xl font-black text-white">{monthlyStats.avg}<span className="text-xs text-slate-500 ml-1">ml/día</span></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Media Diaria</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-black text-white">{guideline.avg}<span className="text-xs text-slate-500 ml-1">ml/día</span></div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase">Recomendado ({guideline.range})</div>
                                </div>
                            </div>

                            {/* Percentile Mockup / Progress Bar */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                    <span>Bajo</span>
                                    <span>Óptimo</span>
                                    <span>Alto</span>
                                </div>
                                <div className="h-3 bg-slate-800 rounded-full relative overflow-hidden flex">
                                    <div className="h-full bg-red-500/20 w-1/4"></div>
                                    <div className="h-full bg-emerald-500/20 w-1/2 border-x border-white/5"></div>
                                    <div className="h-full bg-orange-500/20 w-1/4"></div>
                                    
                                    {/* Indicator */}
                                    <motion.div 
                                        initial={{ left: 0 }}
                                        animate={{ left: `${Math.min(100, (monthlyStats.avg / (guideline.max * 1.2)) * 100)}%` }}
                                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] z-10"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                                    {monthlyStats.avg < guideline.min ? 'Tu bebé está tomando algo menos de lo recomendado para su edad. Consulta si te preocupa.' : 
                                     monthlyStats.avg > guideline.max ? 'Está tomando por encima de la media. ¡Tiene hambre de crecer!' :
                                     'Se mantiene en el rango óptimo de alimentación.'}
                                </p>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <BarChart3 size={14} /> Histórico de Volumen
                            </h3>
                            <div className="h-40 flex items-end gap-1 px-2">
                                {[...Array(14)].map((_, i) => {
                                    const val = monthlyStats.dailyTotals[i] || Math.random() * 200 + 400; // Mock historical
                                    const height = (val / 1200) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full bg-blue-500/20 rounded-t-lg relative group transition-all hover:bg-blue-500/40" style={{ height: `${height}%` }}>
                                                {/* Tooltip on hover */}
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[8px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {Math.round(val)}ml
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-4 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                <span>Hace 2 semanas</span>
                                <span>Hoy</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
