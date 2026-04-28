import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Heart, Moon, Quote, Footprints, Hand } from 'lucide-react';
import { useBaby } from '../services/BabyContext';
import { useToolData } from '../services/hooks/useToolData';
import { GrowthLog, MilestoneLog, FirstWordLog, TeethingLog, SolidsLog, VaccineLog, AppointmentLog, SleepLog, BottleLog, FootprintLog } from './tools/types';
import { useLanguage } from '../services/LanguageContext';

interface MemoryBookProps {
    onClose: () => void;
}

// --- High-End Typography & Style Constants ---
const STYLE = {
    fontSerif: "'Playfair Display', serif", // Fallback to serif if not loaded
    fontSans: "'Inter', sans-serif",
    paper: "#FAF9F6",
    ink: "#1A1A1A",
    accent: "#D4AF37", // Gold-ish subtle accent
    muted: "#8C8C8C"
};

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
    const refDate = new Date('2024-01-11T11:57:00Z').getTime();
    const cycle = 29.530588 * 24 * 60 * 60 * 1000;
    const phase = ((date.getTime() - refDate) % cycle) / cycle;
    if (phase < 0.05 || phase > 0.95) return { label: 'Luna Nueva', type: 'new' };
    if (phase < 0.25) return { label: 'Luna Creciente', type: 'crescent-inc' };
    if (phase < 0.5) return { label: 'Cuarto Creciente', type: 'quarter-inc' };
    if (phase < 0.55) return { label: 'Luna Llena', type: 'full' };
    if (phase < 0.75) return { label: 'Luna Menguante', type: 'crescent-dec' };
    return { label: 'Cuarto Menguante', type: 'quarter-dec' };
};

// --- Minimalist SVG Moon ---
const MoonIllustration: React.FC<{ type: string }> = ({ type }) => (
    <svg width="40" height="40" viewBox="0 0 40 40" className="opacity-80">
        <circle cx="20" cy="20" r="18" fill="none" stroke={STYLE.muted} strokeWidth="0.5" />
        {type === 'full' && <circle cx="20" cy="20" r="15" fill={STYLE.accent} opacity="0.2" />}
        {type.includes('crescent') && <path d="M20 5 A15 15 0 0 1 20 35 A12 12 0 0 0 20 5" fill={STYLE.muted} opacity="0.3" />}
        {type === 'new' && <circle cx="20" cy="20" r="15" fill={STYLE.muted} opacity="0.1" />}
    </svg>
);

// --- Artistic Nanapp Seal ---
const NanappSeal: React.FC = () => (
    <div className="flex flex-col items-center opacity-40">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37] flex items-center justify-center p-2 mb-2">
            <div className="w-full h-full rounded-full border-[0.5px] border-[#D4AF37]/40 flex items-center justify-center">
                <span className="text-[10px] font-serif italic text-[#D4AF37]">n</span>
            </div>
        </div>
        <p className="text-[6px] font-bold uppercase tracking-[0.6em]">Official Heirloom</p>
    </div>
);

// --- Fine Line Chart ---
const FineChart: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    if (data.length < 2) return null;
    const width = 240;
    const height = 50;
    const min = Math.min(...data) * 0.9;
    const max = Math.max(...data) * 1.1;
    const range = max - min;
    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));
    const path = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    
    return (
        <svg width={width} height={height} className="overflow-visible mt-2">
            <path d={path} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="3" fill={color} />
        </svg>
    );
};

export const MemoryBook: React.FC<MemoryBookProps> = ({ onClose }) => {
    const { activeBaby } = useBaby();
    const { t } = useLanguage();
    
    // Data fetching
    const { logs: growthLogs } = useToolData<GrowthLog>('growth');
    const { logs: milestoneLogs } = useToolData<MilestoneLog>('milestones');

    const useMock = growthLogs.length < 2;
    
    const babyName = activeBaby?.name || 'Leo Alexander';
    const birthDate = activeBaby ? new Date(activeBaby.birthDate) : new Date('2024-04-11');
    const zodiac = getZodiac(birthDate);
    const moon = getMoonPhase(birthDate);

    const milestones = useMemo(() => {
        const real = milestoneLogs.filter(l => !l.babyId || l.babyId === activeBaby?.id).sort((a,b) => a.timestamp - b.timestamp);
        if (!useMock) return real.slice(0, 8);
        return [
            { timestamp: birthDate.getTime() + 86400000 * 45, milestoneId: 'Sonrisa' },
            { timestamp: birthDate.getTime() + 86400000 * 120, milestoneId: 'Giro' },
            { timestamp: birthDate.getTime() + 86400000 * 180, milestoneId: 'Sentado' },
            { timestamp: birthDate.getTime() + 86400000 * 240, milestoneId: 'Gateo' },
            { timestamp: birthDate.getTime() + 86400000 * 300, milestoneId: 'De Pie' },
            { timestamp: birthDate.getTime() + 86400000 * 360, milestoneId: 'Pasos' }
        ];
    }, [milestoneLogs, activeBaby, useMock, birthDate]);

    const weightData = useMock ? [3.4, 4.1, 5.2, 6.4, 7.5, 8.8, 9.5, 10.2] : growthLogs.map(l => l.weightKg || 0).filter(v => v > 0).reverse();
    const heightData = useMock ? [50, 53, 58, 62, 65, 70, 74, 78] : growthLogs.map(l => l.heightCm || 0).filter(v => v > 0).reverse();

    const handleDownload = () => window.print();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#121212] flex flex-col overflow-hidden font-sans"
        >
            {/* Header Controls */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl print:hidden">
                <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-1">Keepsake Edition</h2>
                    <p className="text-[9px] text-white/30 tracking-widest">{useMock ? 'MODO DEMOSTRACIÓN' : 'DATOS REALES'}</p>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-3 px-8 py-3 rounded-full bg-[#D4AF37] text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Download size={14} /> EXPORTAR PDF
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-4 md:p-12 flex justify-center items-start print:p-0 print:bg-white">
                {/* ── THE POSTER (PORTRAIT A4) ── */}
                <div className="w-full max-w-[210mm] aspect-[1/1.414] bg-[#FAF9F6] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden p-[15mm] flex flex-col text-[#1A1A1A] print:shadow-none print:w-full print:h-full print:m-0">
                    
                    {/* Background Texture & Borders */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                    <div className="absolute inset-[10mm] border-[0.5px] border-[#D4AF37]/20 pointer-events-none" />

                    {/* Minimalist Header */}
                    <div className="flex justify-between items-start mb-20 relative z-10 pt-4 px-4">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold tracking-[0.6em] text-[#D4AF37] mb-6 uppercase">Volumen I · Primer Ciclo</p>
                            <h1 className="text-[72px] font-serif font-black leading-none tracking-tight text-[#1A1A1A] lowercase">{babyName}</h1>
                            <div className="flex items-center gap-8 mt-10">
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Heart size={8} className="text-[#D4AF37]" />
                                        <p className="text-[8px] font-bold text-[#A6A295] uppercase tracking-widest">Nacimiento</p>
                                    </div>
                                    <p className="text-lg font-serif italic text-[#1A1A1A]">{birthDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="w-[0.5px] h-10 bg-[#E5E2D9]" />
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Quote size={8} className="text-[#D4AF37] rotate-180" />
                                        <p className="text-[8px] font-bold text-[#A6A295] uppercase tracking-widest">Signo</p>
                                    </div>
                                    <p className="text-lg font-serif italic text-[#1A1A1A]">{zodiac}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <MoonIllustration type={moon.type} />
                            <p className="text-[10px] font-bold text-[#A6A295] uppercase tracking-[0.3em] mt-4">{moon.label}</p>
                            <div className="h-[0.5px] w-12 bg-[#D4AF37]/30 mt-2" />
                        </div>
                    </div>

                    {/* Middle Section: The Main Visuals */}
                    <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-12 px-8">
                        <div className="w-full max-w-lg space-y-20">
                            
                            {/* Evolution Header */}
                            <div className="flex items-center justify-center gap-6">
                                <div className="flex-1 h-[0.5px] bg-[#E5E2D9]" />
                                <h3 className="text-[11px] font-bold tracking-[0.5em] text-[#A6A295] uppercase whitespace-nowrap">Antropometría Anual</h3>
                                <div className="flex-1 h-[0.5px] bg-[#E5E2D9]" />
                            </div>

                            <div className="grid grid-cols-2 gap-16">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-serif text-[#1A1A1A]">{weightData[weightData.length-1]}</span>
                                        <span className="text-[10px] font-bold text-[#A6A295] uppercase tracking-widest">Peso / kg</span>
                                    </div>
                                    <FineChart data={weightData} color="#D4AF37" />
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="flex items-baseline gap-2 mb-4">
                                        <span className="text-3xl font-serif text-[#1A1A1A]">{heightData[heightData.length-1]}</span>
                                        <span className="text-[10px] font-bold text-[#A6A295] uppercase tracking-widest">Altura / cm</span>
                                    </div>
                                    <FineChart data={heightData} color="#A6A295" />
                                </div>
                            </div>

                            <div className="pt-8 text-center max-w-md mx-auto">
                                <Quote size={16} className="text-[#D4AF37] opacity-20 mb-4 mx-auto" />
                                <p className="text-[16px] font-serif italic leading-relaxed text-[#5C5A52]">
                                    "Cada gramo y cada centímetro son el testimonio silencioso de tu fuerza. Creciste para llenar de vida nuestro hogar."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: The Timeline */}
                    <div className="relative z-10 pt-16 border-t border-[#D4AF37]/10 mb-10">
                        <div className="flex items-center gap-4 mb-16">
                             <h3 className="text-[10px] font-bold tracking-[0.4em] text-[#A6A295] uppercase">Línea de Vida</h3>
                             <div className="flex-1 h-[0.5px] bg-[#E5E2D9]" />
                        </div>
                        
                        <div className="relative px-6">
                            {/* Horizontal Line with Gold Gradient */}
                            <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-[#E5E2D9] via-[#D4AF37]/40 to-[#E5E2D9]" />
                            
                            <div className="flex justify-between">
                                {milestones.map((m, i) => (
                                    <div key={i} className="flex flex-col items-center -mt-[3px] group">
                                        <div className="w-2 h-2 rounded-full border border-[#D4AF37] bg-[#FAF9F6] mb-6 group-hover:bg-[#D4AF37] transition-all duration-500" />
                                        
                                        <p className="text-[8px] font-bold text-[#A6A295] mb-2 uppercase tracking-tighter">
                                            {new Date(m.timestamp).toLocaleDateString('es-ES', { month: 'short' })}
                                        </p>
                                        <p className="text-[11px] font-serif italic text-[#1A1A1A] text-center max-w-[60px] leading-tight">
                                            {m.milestoneId.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                ))}
                                {milestones.length === 0 && <p className="text-xs italic text-[#A6A295] opacity-20 text-center w-full">El tiempo fluye y tus logros se escriben aquí.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Footer with Seal */}
                    <div className="mt-auto flex justify-between items-end border-t border-[#E5E2D9]/40 pt-12">
                        <div className="flex flex-col gap-1">
                            <p className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#A6A295]">Memoria Digital · Nanapp</p>
                            <p className="text-[7px] italic text-[#A6A295]">Preservando lo esencial.</p>
                        </div>
                        
                        <NanappSeal />

                        <div className="text-right flex flex-col gap-1">
                            <p className="text-[8px] font-bold uppercase tracking-[0.6em] text-[#A6A295]">Limited Edition</p>
                            <p className="text-[7px] italic text-[#A6A295]">MMXXIV</p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
