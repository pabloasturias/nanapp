import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Heart, Moon, Quote, Hand, Star, Cloud, Music, Coffee, Utensils, Smile } from 'lucide-react';
import { useBaby } from '../services/BabyContext';
import { useToolData } from '../services/hooks/useToolData';
import { GrowthLog, MilestoneLog } from './tools/types';
import { useLanguage } from '../services/LanguageContext';

interface MemoryBookProps {
    onClose: () => void;
}

// --- High-End Typography & Style Constants ---
const STYLE = {
    fontSerif: "'Playfair Display', serif",
    fontSans: "'Inter', sans-serif",
    paper: "#FAF9F6",
    ink: "#1A1A1A",
    accent: "#D4AF37", // Gold
    accentMuted: "#E5E2D9",
    muted: "#8C8C8C",
    illustration: "#A6A295"
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

const getZodiacDetails = (sign: string) => {
    const details: Record<string, { trait: string, element: string, symbol: string, desc: string }> = {
        "Aries": { trait: "Valentía", element: "Fuego", symbol: "♈", desc: "Un alma pionera llena de energía." },
        "Tauro": { trait: "Calma", element: "Tierra", symbol: "♉", desc: "Constancia y amor por la belleza." },
        "Géminis": { trait: "Curiosidad", element: "Aire", symbol: "♊", desc: "Mente brillante y adaptable." },
        "Cáncer": { trait: "Sensibilidad", element: "Agua", symbol: "♋", desc: "Protector del hogar, corazón profundo." },
        "Leo": { trait: "Brillo", element: "Fuego", symbol: "♌", desc: "Luz propia que ilumina a los demás." },
        "Virgo": { trait: "Pureza", element: "Tierra", symbol: "♍", desc: "Perfección en los pequeños detalles." },
        "Libra": { trait: "Armonía", element: "Aire", symbol: "♎", desc: "Buscador de la paz y la gracia." },
        "Escorpio": { trait: "Pasión", element: "Agua", symbol: "♏", desc: "Voluntad inquebrantable y emocional." },
        "Sagitario": { trait: "Aventura", element: "Fuego", symbol: "♐", desc: "Optimismo y hambre de horizontes." },
        "Capricornio": { trait: "Sabiduría", element: "Tierra", symbol: "♑", desc: "Ambición serena y paciencia eterna." },
        "Acuario": { trait: "Libertad", element: "Aire", symbol: "♒", desc: "Espíritu libre, nacido para cambiar." },
        "Piscis": { trait: "Sueños", element: "Agua", symbol: "♓", desc: "Conexión mágica y corazón compasivo." }
    };
    return details[sign] || { trait: "Luz", element: "Estrellas", symbol: "✨", desc: "Un ser único nacido para brillar." };
};

// --- Hand-Drawn Style Illustrations ---

const SketchCloud: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 100 60" className={className} fill="none" stroke={STYLE.illustration} strokeWidth="1" strokeLinecap="round">
        <path d="M20,40 Q10,40 10,30 Q10,20 25,20 Q30,10 45,10 Q60,10 65,25 Q85,25 85,40 Q85,55 60,55 L30,55 Q20,55 20,40" />
        <path d="M30,35 Q35,30 45,30" opacity="0.3" />
    </svg>
);

const SketchBear: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 80 100" className={className} fill="none" stroke={STYLE.illustration} strokeWidth="1" strokeLinecap="round">
        <circle cx="40" cy="65" r="25" /> {/* Body */}
        <circle cx="40" cy="35" r="20" /> {/* Head */}
        <circle cx="25" cy="22" r="7" />  {/* Ear L */}
        <circle cx="55" cy="22" r="7" />  {/* Ear R */}
        <circle cx="33" cy="32" r="2" fill={STYLE.illustration} /> {/* Eye L */}
        <circle cx="47" cy="32" r="2" fill={STYLE.illustration} /> {/* Eye R */}
        <path d="M35,42 Q40,45 45,42" /> {/* Mouth */}
        <path d="M20,80 Q15,90 25,90" /> {/* Leg L */}
        <path d="M60,80 Q65,90 55,90" /> {/* Leg R */}
    </svg>
);

const SketchStar: React.FC<{ className?: string }> = ({ className }) => (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke={STYLE.accent} strokeWidth="0.5">
        <path d="M20 5 L24 16 L35 16 L26 24 L30 35 L20 28 L10 35 L14 24 L5 16 L16 16 Z" />
    </svg>
);

const MoonIllustration: React.FC<{ type: string }> = ({ type }) => (
    <svg width="50" height="50" viewBox="0 0 40 40" className="opacity-80">
        <circle cx="20" cy="20" r="18" fill="none" stroke={STYLE.muted} strokeWidth="0.5" strokeDasharray="2 2" />
        {type === 'full' && <circle cx="20" cy="20" r="15" fill={STYLE.accent} opacity="0.2" />}
        {type.includes('crescent') && <path d="M20 5 A15 15 0 0 1 20 35 A12 12 0 0 0 20 5" fill={STYLE.muted} opacity="0.3" />}
        {type === 'new' && <circle cx="20" cy="20" r="15" fill={STYLE.muted} opacity="0.1" />}
    </svg>
);

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

const FineChart: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    if (data.length < 2) return null;
    const width = 200;
    const height = 40;
    const min = Math.min(...data) * 0.9;
    const max = Math.max(...data) * 1.1;
    const range = max - min;
    const points = data.map((val, i) => ({
        x: (i / (data.length - 1)) * width,
        y: height - ((val - min) / range) * height
    }));
    const path = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    
    return (
        <svg width={width} height={height} className="overflow-visible">
            <path d={path} fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="2.5" fill={color} />
        </svg>
    );
};

export const MemoryBook: React.FC<MemoryBookProps> = ({ onClose }) => {
    const { activeBaby } = useBaby();
    const { t } = useLanguage();
    
    const { logs: growthLogs } = useToolData<GrowthLog>('growth');
    const { logs: milestoneLogs } = useToolData<MilestoneLog>('milestones');

    const useMock = growthLogs.length < 2;
    
    const babyName = activeBaby?.name || 'Leo Alexander';
    const birthDate = activeBaby ? new Date(activeBaby.birthDate) : new Date('2024-04-11');
    const zodiac = getZodiac(birthDate);
    const zodiacInfo = getZodiacDetails(zodiac);
    const moon = getMoonPhase(birthDate);

    const birthWeight = activeBaby?.birthWeight || (useMock ? 3.450 : 0);
    const birthHeight = activeBaby?.birthHeight || (useMock ? 50 : 0);

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
            className="fixed inset-0 z-[100] bg-[#121212] flex flex-col overflow-hidden font-sans print:bg-white"
        >
            {/* Header Controls */}
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl print:hidden">
                <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/60 mb-1">Keepsake Edition</h2>
                    <p className="text-[9px] text-white/30 tracking-widest uppercase">{useMock ? 'Demo Mode' : 'Real Record'}</p>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-3 px-8 py-3 rounded-full bg-[#D4AF37] text-white font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all">
                    <Download size={14} /> EXPORTAR PDF
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-4 md:p-12 flex justify-center items-start print:p-0 print:bg-white">
                {/* ── THE POSTER (PORTRAIT A4) ── */}
                <div className="w-full max-w-[210mm] aspect-[1/1.414] bg-[#FAF9F6] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden p-[12mm] flex flex-col text-[#1A1A1A] print:shadow-none print:w-full print:h-full print:m-0">
                    
                    {/* Decorative Elements Layer */}
                    <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />
                    <div className="absolute inset-[8mm] border-[0.5px] border-[#D4AF37]/20 pointer-events-none" />
                    
                    {/* Sketches */}
                    <SketchCloud className="absolute top-10 right-20 w-32 h-32 opacity-20" />
                    <SketchBear className="absolute bottom-40 right-10 w-24 h-24 opacity-10" />
                    <SketchStar className="absolute top-40 left-10 w-12 h-12 opacity-30" />
                    <SketchStar className="absolute top-60 right-40 w-8 h-8 opacity-20" />

                    {/* Minimalist Header */}
                    <div className="flex justify-between items-start mb-10 relative z-10 pt-4 px-4">
                        <div className="flex flex-col">
                            <p className="text-[9px] font-bold tracking-[0.7em] text-[#D4AF37] mb-6 uppercase">Volumen I · El Comienzo</p>
                            <h1 className="text-[72px] font-serif font-black leading-none tracking-tighter text-[#1A1A1A] lowercase">{babyName}</h1>
                            
                            <div className="grid grid-cols-2 gap-10 mt-8">
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Heart size={8} className="text-[#D4AF37]" />
                                        <p className="text-[7px] font-bold text-[#A6A295] uppercase tracking-widest">Nacimiento</p>
                                    </div>
                                    <p className="text-base font-serif italic text-[#1A1A1A]">{birthDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    <p className="text-[8px] text-[#A6A295] mt-1 italic uppercase">A las {activeBaby?.birthTime || '04:12'}h</p>
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] text-[#D4AF37]">{zodiacInfo.symbol}</span>
                                        <p className="text-[7px] font-bold text-[#A6A295] uppercase tracking-widest">Zodíaco</p>
                                    </div>
                                    <p className="text-base font-serif italic text-[#1A1A1A]">{zodiac}</p>
                                    <p className="text-[8px] text-[#A6A295] mt-1 italic uppercase">{zodiacInfo.trait} · {zodiacInfo.element}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <MoonIllustration type={moon.type} />
                            <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-[0.4em] mt-3">{moon.label}</p>
                            <div className="h-[0.5px] w-10 bg-[#D4AF37]/30 mt-2" />
                        </div>
                    </div>

                    {/* MAIN GRID: Content Areas */}
                    <div className="flex-1 grid grid-cols-12 gap-8 relative z-10 pt-4">
                        
                        {/* LEFT COLUMN: Details & Lists */}
                        <div className="col-span-4 flex flex-col gap-10 pr-6 border-r border-[#E5E2D9]/40">
                            
                            {/* Birth Stats Small */}
                            <div className="space-y-4">
                                <h3 className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4">Primeras Medidas</h3>
                                <div className="flex justify-between items-end border-b border-[#E5E2D9] pb-2">
                                    <p className="text-[9px] text-[#A6A295] uppercase tracking-widest">Peso</p>
                                    <p className="text-lg font-serif italic">{birthWeight}kg</p>
                                </div>
                                <div className="flex justify-between items-end border-b border-[#E5E2D9] pb-2">
                                    <p className="text-[9px] text-[#A6A295] uppercase tracking-widest">Altura</p>
                                    <p className="text-lg font-serif italic">{birthHeight}cm</p>
                                </div>
                            </div>

                            {/* First Words */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Smile size={10} className="text-[#D4AF37]" />
                                    <h3 className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-[0.4em]">Vocabulario</h3>
                                </div>
                                <div className="space-y-3 pl-2 border-l border-[#D4AF37]/20">
                                    {['Aba (Agua)', 'Mamá', 'Ajo'].map((w, i) => (
                                        <p key={i} className="text-[11px] font-serif italic text-[#1A1A1A]">{i+1}. {w}</p>
                                    ))}
                                </div>
                            </div>

                            {/* Favorite Things */}
                            <div className="space-y-4">
                                <h3 className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-[0.4em]">Favoritos</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <Music size={10} className="opacity-20 mt-1" />
                                        <div>
                                            <p className="text-[7px] uppercase font-bold text-[#A6A295]">Canción</p>
                                            <p className="text-[10px] font-serif italic">Twinkle Twinkle</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <Utensils size={10} className="opacity-20 mt-1" />
                                        <div>
                                            <p className="text-[7px] uppercase font-bold text-[#A6A295]">Sabor</p>
                                            <p className="text-[10px] font-serif italic">Papilla de Pera</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* First Teeth Sketch */}
                            <div className="mt-auto pb-4">
                                <h3 className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-[0.4em] mb-4">Primeros Dientes</h3>
                                <div className="grid grid-cols-4 gap-1 opacity-20">
                                    {Array.from({length: 8}).map((_, i) => (
                                        <div key={i} className="w-4 h-4 rounded-b-full border border-[#1A1A1A]" />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Big Visuals */}
                        <div className="col-span-8 flex flex-col gap-12 pl-4">
                            
                            {/* Poetic Horoscope Desc */}
                            <div className="bg-[#FAF9F6] border border-[#E5E2D9] rounded-[2rem] p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4AF37]/5 rounded-full -mr-12 -mt-12" />
                                <Quote size={16} className="text-[#D4AF37] opacity-20 mb-4" />
                                <p className="text-base font-serif italic text-[#5C5A52] leading-relaxed relative z-10">
                                    "{zodiacInfo.desc} Un ser nacido bajo el influjo de {zodiacInfo.element}, destinado a descubrir el mundo con ojos de asombro y un corazón valiente."
                                </p>
                            </div>

                            {/* Growth Charts */}
                            <div className="space-y-12 py-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <h3 className="text-[8px] font-bold text-[#A6A295] uppercase tracking-[0.5em]">Evolución Primer Año</h3>
                                    <div className="flex-1 h-[0.5px] bg-[#E5E2D9]" />
                                </div>

                                <div className="grid grid-cols-2 gap-10">
                                    <div>
                                        <div className="flex justify-between items-end mb-3">
                                            <p className="text-[7px] font-bold text-[#A6A295] uppercase tracking-widest">Peso / kg</p>
                                            <p className="text-xl font-serif">{weightData[weightData.length-1]}</p>
                                        </div>
                                        <FineChart data={weightData} color={STYLE.accent} />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-end mb-3">
                                            <p className="text-[7px] font-bold text-[#A6A295] uppercase tracking-widest">Altura / cm</p>
                                            <p className="text-xl font-serif">{heightData[heightData.length-1]}</p>
                                        </div>
                                        <FineChart data={heightData} color="#A6A295" />
                                    </div>
                                </div>
                            </div>

                            {/* A Promise/Quote */}
                            <div className="mt-auto py-8 text-center border-t border-[#E5E2D9]/60">
                                <div className="flex justify-center gap-2 mb-4">
                                    <Star size={8} className="text-[#D4AF37]" />
                                    <Star size={8} className="text-[#D4AF37]" />
                                    <Star size={8} className="text-[#D4AF37]" />
                                </div>
                                <p className="text-[12px] font-serif italic text-[#1A1A1A] max-w-sm mx-auto leading-loose">
                                    "Viniste para recordarnos que el mundo es nuevo cada día. Prometemos cuidar tus alas mientras aprendes a volar."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TIMELINE: Bottom Horizontal Area */}
                    <div className="relative z-10 mt-8 pt-8 border-t border-[#D4AF37]/20">
                        <div className="flex items-center gap-4 mb-10 px-4">
                             <h3 className="text-[8px] font-bold tracking-[0.6em] text-[#A6A295] uppercase">Línea de Vida</h3>
                             <div className="flex-1 h-[0.5px] bg-[#E5E2D9]" />
                             <SketchStar className="w-4 h-4" />
                        </div>
                        
                        <div className="relative px-10 mb-6">
                            <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
                            
                            <div className="flex justify-between">
                                {milestones.map((m, i) => (
                                    <div key={i} className="flex flex-col items-center -mt-[3px] group">
                                        <div className="w-1.5 h-1.5 rounded-full border border-[#D4AF37] bg-[#FAF9F6] mb-4 group-hover:bg-[#D4AF37] transition-all" />
                                        <p className="text-[7px] font-bold text-[#A6A295] mb-1 uppercase">
                                            {new Date(m.timestamp).toLocaleDateString('es-ES', { month: 'short' })}
                                        </p>
                                        <p className="text-[10px] font-serif italic text-[#1A1A1A] text-center max-w-[50px] leading-tight">
                                            {m.milestoneId.replace(/_/g, ' ')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer with Seal & Signature */}
                    <div className="mt-auto flex justify-between items-end border-t border-[#E5E2D9]/40 pt-10 px-4">
                        <div className="flex flex-col gap-1">
                            <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-[#A6A295]">Memoria Digital · Nanapp</p>
                            <p className="text-[6px] italic text-[#A6A295]">Preservando lo esencial del primer viaje.</p>
                        </div>
                        
                        <NanappSeal />

                        <div className="text-right flex flex-col gap-1">
                            <p className="text-[7px] font-bold uppercase tracking-[0.5em] text-[#A6A295]">Heirloom Edition</p>
                            <p className="text-[6px] italic text-[#A6A295]">Generado en {new Date().getFullYear()}</p>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
