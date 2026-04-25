import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, Heart, Moon, ChevronRight, Plus, Trash2, Check, X, Sparkles } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HydrationLog { timestamp: number; amount: number; }
interface MoodLog { timestamp: number; emoji: string; score: number; note?: string; }
interface RestLog { timestamp: number; hours: number; }

const STORAGE_KEYS = {
    hydration: 'mama_hydration',
    mood: 'mama_mood',
    rest: 'mama_rest',
};

const MOOD_OPTIONS = [
    { emoji: '😴', label: 'Agotada', score: 1, color: 'text-slate-400' },
    { emoji: '😔', label: 'Triste', score: 2, color: 'text-blue-400' },
    { emoji: '😐', label: 'Regular', score: 3, color: 'text-yellow-400' },
    { emoji: '🙂', label: 'Bien', score: 4, color: 'text-emerald-400' },
    { emoji: '✨', label: 'Genial', score: 5, color: 'text-orange-400' },
];

const WATER_AMOUNTS = [150, 250, 350, 500];

// ─── Utils ────────────────────────────────────────────────────────────────────
const today = () => {
    const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

const loadJSON = <T,>(key: string, fallback: T): T => {
    try { return JSON.parse(localStorage.getItem(key) || '') as T; }
    catch { return fallback; }
};

const saveJSON = (key: string, val: unknown) => localStorage.setItem(key, JSON.stringify(val));

// ─── Dashboard (card in ToolsView grid) ──────────────────────────────────────
export const MamaDashboard: React.FC = () => {
    const logs = loadJSON<HydrationLog[]>(STORAGE_KEYS.hydration, []);
    const todayMl = logs
        .filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString())
        .reduce((s, l) => s + l.amount, 0);
    const goal = 2500;
    const pct = Math.min(100, Math.round((todayMl / goal) * 100));
    return <span>{todayMl}ml · {pct}% del objetivo</span>;
};

// ─── Full View ────────────────────────────────────────────────────────────────
export const MamaFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [tab, setTab] = useState<'hydration' | 'mood' | 'rest'>('hydration');

    // State
    const [hydrationLogs, setHydrationLogs] = useState<HydrationLog[]>(() => loadJSON(STORAGE_KEYS.hydration, []));
    const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => loadJSON(STORAGE_KEYS.mood, []));
    const [restLogs, setRestLogs] = useState<RestLog[]>(() => loadJSON(STORAGE_KEYS.rest, []));

    // Persist
    useEffect(() => saveJSON(STORAGE_KEYS.hydration, hydrationLogs), [hydrationLogs]);
    useEffect(() => saveJSON(STORAGE_KEYS.mood, moodLogs), [moodLogs]);
    useEffect(() => saveJSON(STORAGE_KEYS.rest, restLogs), [restLogs]);

    // ── Hydration ──────────────────────────────────────────────
    const todayHydration = hydrationLogs.filter(l => new Date(l.timestamp).toDateString() === new Date().toDateString());
    const todayMl = todayHydration.reduce((s, l) => s + l.amount, 0);
    const goal = 2500;
    const pct = Math.min(100, (todayMl / goal) * 100);

    const addWater = (ml: number) => {
        setHydrationLogs(prev => [...prev, { timestamp: Date.now(), amount: ml }]);
    };

    // ── Mood ───────────────────────────────────────────────────
    const todayMood = moodLogs.find(m => new Date(m.timestamp).toDateString() === new Date().toDateString());
    const recentMoods = moodLogs.slice(-7);
    const lowMoodStreak = (() => {
        let streak = 0;
        for (const m of [...moodLogs].reverse()) {
            if (m.score <= 2) streak++; else break;
        }
        return streak;
    })();

    const logMood = (opt: typeof MOOD_OPTIONS[0]) => {
        const updated = moodLogs.filter(m => new Date(m.timestamp).toDateString() !== new Date().toDateString());
        setMoodLogs([...updated, { timestamp: Date.now(), emoji: opt.emoji, score: opt.score }]);
    };

    // ── Rest ───────────────────────────────────────────────────
    const [restHours, setRestHours] = useState(5);
    const logRest = () => {
        const updated = restLogs.filter(r => new Date(r.timestamp).toDateString() !== new Date().toDateString());
        setRestLogs([...updated, { timestamp: Date.now(), hours: restHours }]);
    };
    const todayRest = restLogs.find(r => new Date(r.timestamp).toDateString() === new Date().toDateString());

    const tabs = [
        { id: 'hydration' as const, icon: Droplets, label: 'Agua' },
        { id: 'mood' as const, icon: Heart, label: 'Ánimo' },
        { id: 'rest' as const, icon: Moon, label: 'Descanso' },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-hidden">
            {/* Hero */}
            <div className="px-6 pt-6 pb-4 bg-gradient-to-b from-rose-950/50 to-transparent">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                        <Sparkles size={20} className="text-rose-300" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white font-['Outfit']">Rincón de Mamá</h2>
                        <p className="text-[10px] text-rose-300/70 font-medium uppercase tracking-widest">Tu bienestar también importa</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex mx-4 mb-4 bg-slate-900/60 rounded-2xl p-1 border border-white/5">
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                            tab === t.id ? 'bg-rose-500/20 text-rose-200 border border-rose-500/30' : 'text-slate-500'
                        }`}
                    >
                        <t.icon size={14} />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-8">
                <AnimatePresence mode="wait">

                    {/* ── HYDRATION ── */}
                    {tab === 'hydration' && (
                        <motion.div key="hydration" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            {/* Circular progress */}
                            <div className="flex flex-col items-center py-6">
                                <div className="relative w-40 h-40">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgb(30 41 59)" strokeWidth="12" />
                                        <circle
                                            cx="60" cy="60" r="50" fill="none"
                                            stroke="rgb(59 130 246)"
                                            strokeWidth="12"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 50}`}
                                            strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                                            className="transition-all duration-700"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <Droplets size={22} className="text-blue-400 mb-1" />
                                        <span className="text-2xl font-bold text-white">{todayMl}<span className="text-sm text-slate-400">ml</span></span>
                                        <span className="text-[10px] text-slate-500">de {goal}ml</span>
                                    </div>
                                </div>
                                {pct >= 100 && (
                                    <div className="mt-3 flex items-center gap-2 text-emerald-400 text-sm font-bold">
                                        <Check size={16} /> ¡Objetivo cumplido hoy!
                                    </div>
                                )}
                            </div>

                            {/* Quick add buttons */}
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Añadir</p>
                            <div className="grid grid-cols-4 gap-2 mb-6">
                                {WATER_AMOUNTS.map(ml => (
                                    <button
                                        key={ml}
                                        onClick={() => addWater(ml)}
                                        className="py-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold hover:bg-blue-500/20 transition-colors active:scale-95"
                                    >
                                        +{ml}ml
                                    </button>
                                ))}
                            </div>

                            {/* Today's log */}
                            {todayHydration.length > 0 && (
                                <>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Hoy</p>
                                    <div className="space-y-2">
                                        {[...todayHydration].reverse().map((l, i) => (
                                            <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded-2xl px-4 py-3 border border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <Droplets size={16} className="text-blue-400" />
                                                    <span className="text-sm font-bold text-white">{l.amount} ml</span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {new Date(l.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* ── MOOD ── */}
                    {tab === 'mood' && (
                        <motion.div key="mood" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6 pt-2">
                                ¿Cómo te encuentras hoy? Sin juicios, solo para ti.
                            </p>

                            {/* Mood picker */}
                            <div className="flex justify-between gap-2 mb-6">
                                {MOOD_OPTIONS.map(opt => (
                                    <button
                                        key={opt.emoji}
                                        onClick={() => logMood(opt)}
                                        className={`flex-1 flex flex-col items-center gap-1.5 py-4 rounded-2xl border transition-all active:scale-95 ${
                                            todayMood?.emoji === opt.emoji
                                                ? 'bg-rose-500/20 border-rose-500/40 scale-105'
                                                : 'bg-slate-800/40 border-white/5 hover:bg-slate-800'
                                        }`}
                                    >
                                        <span className="text-2xl">{opt.emoji}</span>
                                        <span className="text-[9px] font-bold text-slate-400">{opt.label}</span>
                                    </button>
                                ))}
                            </div>

                            {todayMood && (
                                <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5 mb-6 flex items-center gap-3">
                                    <span className="text-3xl">{todayMood.emoji}</span>
                                    <div>
                                        <p className="text-sm font-bold text-white">Registrado hoy</p>
                                        <p className="text-xs text-slate-500">{new Date(todayMood.timestamp).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                </div>
                            )}

                            {/* Alert for low mood streak */}
                            {lowMoodStreak >= 3 && (
                                <div className="bg-rose-900/30 border border-rose-500/30 rounded-2xl p-4 mb-6">
                                    <p className="text-sm text-rose-200 font-bold mb-1">💜 Llevas unos días difíciles</p>
                                    <p className="text-xs text-rose-300/80 leading-relaxed">
                                        Muchas mamás sienten lo mismo. No estás sola. Habla con tu matrona o médico si lo necesitas.
                                    </p>
                                </div>
                            )}

                            {/* History */}
                            {recentMoods.length > 0 && (
                                <>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Últimos 7 días</p>
                                    <div className="flex gap-2">
                                        {recentMoods.map((m, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <span className="text-xl">{m.emoji}</span>
                                                <span className="text-[9px] text-slate-600">
                                                    {new Date(m.timestamp).toLocaleDateString('es', { weekday: 'narrow' })}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}

                    {/* ── REST ── */}
                    {tab === 'rest' && (
                        <motion.div key="rest" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                            <p className="text-sm text-slate-400 leading-relaxed mb-6 pt-2">
                                Registra cuánto has descansado (contando también las siestas).
                            </p>

                            {/* Slider */}
                            <div className="bg-slate-800/40 rounded-2xl p-5 border border-white/5 mb-4">
                                <div className="flex items-end justify-between mb-4">
                                    <div>
                                        <span className="text-4xl font-bold text-white">{restHours}</span>
                                        <span className="text-lg text-slate-400 ml-1">h</span>
                                    </div>
                                    <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                        restHours >= 6 ? 'bg-emerald-500/20 text-emerald-300' :
                                        restHours >= 4 ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-rose-500/20 text-rose-300'
                                    }`}>
                                        {restHours >= 6 ? '😌 Bien descansada' : restHours >= 4 ? '😐 Poco descanso' : '😴 Muy poco'}
                                    </div>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="12" step="0.5"
                                    value={restHours}
                                    onChange={e => setRestHours(parseFloat(e.target.value))}
                                    className="w-full accent-indigo-500"
                                />
                                <div className="flex justify-between text-[9px] text-slate-600 mt-1">
                                    <span>0h</span><span>6h</span><span>12h</span>
                                </div>
                            </div>

                            <button
                                onClick={logRest}
                                className="w-full py-4 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-200 font-bold text-sm hover:bg-indigo-500/30 transition-colors active:scale-95 flex items-center justify-center gap-2 mb-6"
                            >
                                <Check size={16} />
                                {todayRest ? 'Actualizar descanso' : 'Registrar descanso de hoy'}
                            </button>

                            {/* History */}
                            {restLogs.length > 0 && (
                                <>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-3">Historial</p>
                                    <div className="space-y-2">
                                        {[...restLogs].reverse().slice(0, 7).map((r, i) => (
                                            <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded-2xl px-4 py-3 border border-white/5">
                                                <span className="text-xs text-slate-400">
                                                    {new Date(r.timestamp).toLocaleDateString('es', { weekday: 'long', day: 'numeric' })}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <Moon size={14} className="text-indigo-400" />
                                                    <span className="text-sm font-bold text-white">{r.hours}h</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
