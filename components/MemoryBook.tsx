import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Star, Heart, Ruler, MessageCircle, Moon, Trophy, Activity, Calendar, ShieldCheck, Stethoscope, Utensils, Zap, Quote } from 'lucide-react';
import { useBaby } from '../services/BabyContext';
import { useToolData } from '../services/hooks/useToolData';
import { GrowthLog, MilestoneLog, FirstWordLog, TeethingLog, SolidsLog, VaccineLog, AppointmentLog, SleepLog, BottleLog, BreastfeedingLog } from './tools/types';
import { useLanguage } from '../services/LanguageContext';

interface MemoryBookProps {
    onClose: () => void;
}

// --- Helpers ---

const getZodiac = (date: Date) => {
    const days = [21, 20, 21, 21, 22, 22, 23, 24, 24, 24, 23, 22];
    const signs = ["Capricornio", "Acuario", "Piscis", "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo", "Libra", "Escorpio", "Sagitario"];
    let month = date.getMonth();
    let day = date.getDate();
    if (day < days[month]) return signs[month === 0 ? 11 : month - 1];
    return signs[month];
};

const getMoonPhase = (date: Date) => {
    // Known New Moon: 2024-01-11 11:57 UTC
    const refDate = new Date('2024-01-11T11:57:00Z').getTime();
    const now = date.getTime();
    const cycle = 29.530588 * 24 * 60 * 60 * 1000;
    const phase = ((now - refDate) % cycle) / cycle;
    if (phase < 0.05 || phase > 0.95) return { label: 'Luna Nueva', emoji: '🌑' };
    if (phase < 0.2) return { label: 'Luna Creciente', emoji: '🌒' };
    if (phase < 0.3) return { label: 'Cuarto Creciente', emoji: '🌓' };
    if (phase < 0.45) return { label: 'Gibosa Creciente', emoji: '🌔' };
    if (phase < 0.55) return { label: 'Luna Llena', emoji: '🌕' };
    if (phase < 0.7) return { label: 'Gibosa Menguante', emoji: '🌖' };
    if (phase < 0.8) return { label: 'Cuarto Menguante', emoji: '🌗' };
    return { label: 'Luna Menguante', emoji: '🌘' };
};

// --- Sparkline Component ---
const Sparkline: React.FC<{ data: number[], color: string, width: number, height: number }> = ({ data, color, width, height }) => {
    if (data.length < 2) return <div className="h-full flex items-center justify-center text-[8px] text-slate-300">Esperando datos...</div>;
    const min = Math.min(...data) * 0.95;
    const max = Math.max(...data) * 1.05;
    const range = max - min;
    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));
    const path = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    
    return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dots */}
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="2" fill="white" stroke={color} strokeWidth="1" />
            ))}
        </svg>
    );
};

export const MemoryBook: React.FC<MemoryBookProps> = ({ onClose }) => {
    const { activeBaby } = useBaby();
    const { t } = useLanguage();
    
    const { logs: growthLogs } = useToolData<GrowthLog>('growth');
    const { logs: milestoneLogs } = useToolData<MilestoneLog>('milestones');
    const { logs: wordLogs } = useToolData<FirstWordLog>('first_words');
    const { logs: teethingLogs } = useToolData<TeethingLog>('teething');
    const { logs: solidsLogs } = useToolData<SolidsLog>('solids');
    const { logs: vaccineLogs } = useToolData<VaccineLog>('vaccines');
    const { logs: apptLogs } = useToolData<AppointmentLog>('medical_agenda');
    const { logs: sleepLogs } = useToolData<SleepLog>('sleep');
    const { logs: bottleLogs } = useToolData<BottleLog>('bottle');

    const babyName = activeBaby?.name || 'Tu Bebé';
    const birthDate = activeBaby ? new Date(activeBaby.birthDate) : new Date();
    const zodiac = getZodiac(birthDate);
    const moon = getMoonPhase(birthDate);

    // --- Data Processing ---
    
    const milestones = useMemo(() => 
        milestoneLogs.filter(l => !l.babyId || l.babyId === activeBaby?.id).sort((a,b) => a.timestamp - b.timestamp).slice(0, 15),
    [milestoneLogs, activeBaby]);

    const weightData = useMemo(() => growthLogs.map(l => l.weightKg || 0).filter(v => v > 0).reverse(), [growthLogs]);
    const heightData = useMemo(() => growthLogs.map(l => l.heightCm || 0).filter(v => v > 0).reverse(), [growthLogs]);

    const bottleMonthly = useMemo(() => {
        const months: Record<string, number[]> = {};
        bottleLogs.forEach(l => {
            const m = new Date(l.timestamp).toLocaleDateString('es-ES', { month: 'short' });
            if (!months[m]) months[m] = [];
            months[m].push(l.amount);
        });
        return Object.entries(months).map(([name, vals]) => ({
            name,
            avg: Math.round(vals.reduce((a,b) => a+b, 0) / vals.length)
        })).slice(-6);
    }, [bottleLogs]);

    const handleDownload = () => window.print();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden"
        >
            {/* Header Controls */}
            <div className="p-4 flex items-center justify-between border-b border-white/5 bg-slate-900/80 backdrop-blur-md sticky top-0 z-10 print:hidden">
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <div className="flex flex-col items-center max-w-md text-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-200">Lámina de Recuerdo</h2>
                    <p className="text-[9px] text-slate-400 mt-1 leading-tight">
                        "Aunque ahora estos momentos se sienten eternos, el tiempo tiende a desdibujar los detalles. Guarda esta lámina: es la huella digital de su primer capítulo."
                    </p>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-orange-500 text-slate-950 font-black text-xs shadow-xl active:scale-95 transition-all"
                >
                    <Download size={14} /> GENERAR PDF
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 p-4 md:p-8 flex justify-center items-center print:p-0 print:bg-white">
                {/* ── THE POSTER (LANDSCAPE) ── */}
                <div className="w-full max-w-[297mm] aspect-[1.414/1] bg-[#faf9f6] shadow-2xl relative overflow-hidden p-[10mm] flex flex-col text-slate-800 print:shadow-none print:w-full print:h-full print:m-0">
                    
                    {/* Frame */}
                    <div className="absolute inset-[6mm] border-[0.5px] border-slate-200 pointer-events-none" />
                    
                    {/* Header */}
                    <div className="text-center mt-4 mb-8 relative z-10">
                        <div className="flex justify-center gap-8 mb-2 text-[10px] uppercase font-black tracking-widest text-slate-300">
                            <span>{zodiac}</span>
                            <span>{moon.emoji} {moon.label}</span>
                        </div>
                        <h1 className="text-6xl font-serif font-black tracking-[-0.02em] text-slate-900 leading-none">Primer año de {babyName}</h1>
                        <div className="flex items-center justify-center gap-4 mt-2">
                            <div className="h-[1px] w-12 bg-slate-200" />
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">MEMORIA VISUAL · {birthDate.getFullYear()}</p>
                            <div className="h-[1px] w-12 bg-slate-200" />
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-3 gap-x-12 relative z-10 px-8 overflow-hidden">
                        
                        {/* COLUMN 1: VISUAL GROWTH */}
                        <div className="flex flex-col gap-8">
                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">
                                    <Activity size={14} /> EVOLUCIÓN PESO (KG)
                                </h3>
                                <div className="h-24 w-full bg-white/40 rounded-2xl p-4 border border-slate-100 relative">
                                    <Sparkline data={weightData.length > 0 ? weightData : [3.4, 4.2, 5.1, 6.0]} color="#f97316" width={220} height={60} />
                                    <div className="flex justify-between mt-1 text-[8px] text-slate-400 font-bold">
                                        <span>Nacimiento</span>
                                        <span>{weightData[weightData.length-1] || '—'} kg</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">
                                    <Ruler size={14} /> EVOLUCIÓN ALTURA (CM)
                                </h3>
                                <div className="h-24 w-full bg-white/40 rounded-2xl p-4 border border-slate-100 relative">
                                    <Sparkline data={heightData.length > 0 ? heightData : [51, 54, 58, 62]} color="#6366f1" width={220} height={60} />
                                    <div className="flex justify-between mt-1 text-[8px] text-slate-400 font-bold">
                                        <span>Nacimiento</span>
                                        <span>{heightData[heightData.length-1] || '—'} cm</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">
                                    <Zap size={14} /> EVOLUCIÓN BIBERONES (ML AVG)
                                </h3>
                                <div className="flex items-end justify-between h-20 px-2 pt-4">
                                    {bottleMonthly.length > 0 ? bottleMonthly.map((m, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1">
                                            <div 
                                                className="w-4 bg-orange-200 rounded-t-sm" 
                                                style={{ height: `${(m.avg / 250) * 60}px` }} 
                                            />
                                            <span className="text-[7px] font-bold text-slate-400 uppercase">{m.name}</span>
                                            <span className="text-[8px] font-black text-slate-600">{m.avg}</span>
                                        </div>
                                    )) : <p className="text-[10px] text-slate-300 italic">Esperando registros...</p>}
                                </div>
                            </section>
                        </div>

                        {/* COLUMN 2: MILESTONES WITH DATES */}
                        <div className="flex flex-col gap-6">
                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">
                                    <Trophy size={14} /> MOMENTOS CLAVE
                                </h3>
                                <div className="space-y-2.5">
                                    {milestones.map((m, i) => (
                                        <div key={i} className="flex justify-between items-center text-[10px]">
                                            <span className="font-bold text-slate-700 capitalize flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-orange-300" />
                                                {m.milestoneId.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-[9px] text-slate-400 font-mono tracking-tighter">
                                                {new Date(m.timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                    {milestones.length === 0 && <p className="text-xs text-slate-300 italic font-serif">Tu historia está por escribir...</p>}
                                </div>
                            </section>
                        </div>

                        {/* COLUMN 3: DEEP MEMORIES */}
                        <div className="flex flex-col gap-8 h-full">
                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">
                                    <Utensils size={14} /> PRIMEROS SABORES
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {solidsLogs.slice(0, 4).map((s, i) => (
                                        <div key={i} className="p-2 bg-white rounded-xl border border-slate-100 flex flex-col justify-center items-center text-center">
                                            <span className="text-lg mb-1">{s.reaction === 'love' ? '❤️' : '🥑'}</span>
                                            <p className="text-[9px] font-black text-slate-800 capitalize leading-tight">{s.food}</p>
                                        </div>
                                    ))}
                                    {solidsLogs.length === 0 && <p className="col-span-2 text-[10px] text-slate-300 italic font-serif">Pronto, nuevas aventuras...</p>}
                                </div>
                            </section>

                            <section>
                                <h3 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 border-b border-slate-200 pb-2">
                                    <MessageCircle size={14} /> SUS PRIMERAS VOCES
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {wordLogs.slice(0, 6).map((w, i) => (
                                        <div key={i} className="px-3 py-1.5 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                                            <p className="text-[11px] font-black text-indigo-900 leading-none mb-1">"{w.word}"</p>
                                            <p className="text-[8px] text-indigo-400 font-bold uppercase">{new Date(w.timestamp).toLocaleDateString('es-ES', { month: 'short' })}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mt-auto">
                                <div className="p-6 rounded-[2.5rem] bg-slate-900 text-slate-100 relative overflow-hidden shadow-2xl">
                                    <Quote size={20} className="text-orange-500/20 absolute top-4 left-4" />
                                    <p className="text-[11px] font-serif italic leading-relaxed text-slate-300 relative z-10 px-4">
                                        "El tiempo desdibuja los detalles, pero esta lámina guarda la esencia de tu inicio. Siempre serás nuestro pequeño milagro."
                                    </p>
                                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center border-t border-slate-100 pt-4 opacity-50 relative z-10">
                        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-300">
                            CREADO CON AMOR POR NANAPP PARA {babyName.toUpperCase()}
                        </p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
