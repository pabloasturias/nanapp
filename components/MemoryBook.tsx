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
        <svg width={width} height={height} className="overflow-visible mt-4">
            <path d={path} fill="none" stroke={color} strokeWidth="0.75" />
            <circle cx={points[points.length-1].x} cy={points[points.length-1].y} r="2" fill={color} />
        </svg>
    );
};

export const MemoryBook: React.FC<MemoryBookProps> = ({ onClose }) => {
    const { activeBaby } = useBaby();
    const { t } = useLanguage();
    
    // Data fetching
    const { logs: growthLogs } = useToolData<GrowthLog>('growth');
    const { logs: milestoneLogs } = useToolData<MilestoneLog>('milestones');
    const { logs: wordLogs } = useToolData<FirstWordLog>('first_words');
    const { logs: teethingLogs } = useToolData<TeethingLog>('teething');
    const { logs: solidsLogs } = useToolData<SolidsLog>('solids');
    const { logs: sleepLogs } = useToolData<SleepLog>('sleep');
    const { logs: bottleLogs } = useToolData<BottleLog>('bottle');
    const { logs: footprintLogs } = useToolData<FootprintLog>('footprint');

    // --- MOCK DATA FOR "PERFECT EXAMPLE" if real data is missing ---
    const useMock = growthLogs.length < 2;
    const realFootprint = footprintLogs.find(l => l.type === 'pie' && (!l.babyId || l.babyId === activeBaby?.id));
    const realHandprint = footprintLogs.find(l => l.type === 'mano' && (!l.babyId || l.babyId === activeBaby?.id));
    
    const babyName = activeBaby?.name || 'Leo Alexander';
    const birthDate = activeBaby ? new Date(activeBaby.birthDate) : new Date('2024-04-11');
    const zodiac = getZodiac(birthDate);
    const moon = getMoonPhase(birthDate);

    const milestones = useMemo(() => {
        const real = milestoneLogs.filter(l => !l.babyId || l.babyId === activeBaby?.id).sort((a,b) => a.timestamp - b.timestamp);
        if (!useMock) return real.slice(0, 10);
        return [
            { timestamp: birthDate.getTime() + 86400000 * 45, milestoneId: 'Primera Sonrisa' },
            { timestamp: birthDate.getTime() + 86400000 * 120, milestoneId: 'Se dio la vuelta' },
            { timestamp: birthDate.getTime() + 86400000 * 180, milestoneId: 'Se mantuvo sentado' },
            { timestamp: birthDate.getTime() + 86400000 * 240, milestoneId: 'Empezó a gatear' },
            { timestamp: birthDate.getTime() + 86400000 * 300, milestoneId: 'Se puso de pie' },
            { timestamp: birthDate.getTime() + 86400000 * 360, milestoneId: 'Primeros pasos' }
        ];
    }, [milestoneLogs, activeBaby, useMock, birthDate]);

    const weightData = useMock ? [3.4, 4.1, 5.2, 6.4, 7.5, 8.8, 9.5] : growthLogs.map(l => l.weightKg || 0).filter(v => v > 0).reverse();
    const heightData = useMock ? [50, 53, 58, 62, 65, 70, 74] : growthLogs.map(l => l.heightCm || 0).filter(v => v > 0).reverse();

    const handleDownload = () => window.print();

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#121212] flex flex-col overflow-hidden font-sans"
        >
            {/* Elegant Header Controls */}
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
                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-white text-black font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                    <Download size={14} /> EXPORTAR PDF
                </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#1A1A1A] p-4 md:p-12 flex justify-center items-start print:p-0 print:bg-white">
                {/* ── THE POSTER (EDITORIAL LANDSCAPE) ── */}
                <div className="w-full max-w-[297mm] aspect-[1.414/1] bg-[#FAF9F6] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden p-[20mm] flex flex-col text-[#1A1A1A] print:shadow-none print:w-full print:h-full print:m-0">
                    
                    {/* Subtle Texture Layer */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

                    {/* Fine Borders */}
                    <div className="absolute inset-[10mm] border-[0.5px] border-[#E5E2D9] pointer-events-none" />
                    
                    {/* Header: Editorial Identity */}
                    <div className="flex justify-between items-start mb-16 relative z-10">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold tracking-[0.5em] text-[#A6A295] mb-6 uppercase">Vol. I · El Origen</p>
                            <h1 className="text-[80px] font-serif font-black leading-none tracking-tight text-[#1A1A1A] mb-2 lowercase">{babyName}</h1>
                            <div className="flex items-center gap-6 mt-4">
                                <div className="text-left">
                                    <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-widest">Nacimiento</p>
                                    <p className="text-lg font-serif italic text-[#1A1A1A]">{birthDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                                <div className="w-[1px] h-8 bg-[#E5E2D9]" />
                                <div className="text-left">
                                    <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-widest">Signo</p>
                                    <p className="text-lg font-serif italic text-[#1A1A1A]">{zodiac}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end text-right">
                            <MoonIllustration type={moon.type} />
                            <p className="text-[10px] font-bold text-[#A6A295] uppercase tracking-widest mt-4">{moon.label}</p>
                            <p className="text-[9px] italic text-[#A6A295] mt-1">La noche que llegaste</p>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-4 gap-x-12 relative z-10">
                        
                        {/* COL 1: FIRST STEPS (Timeline) */}
                        <div className="col-span-1 border-r border-[#E5E2D9] pr-8">
                            <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#A6A295] mb-10 uppercase">Primeros Pasos</h3>
                            <div className="space-y-8">
                                {milestones.map((m, i) => (
                                    <div key={i} className="flex flex-col group">
                                        <p className="text-[9px] font-bold text-[#D4AF37] mb-1">
                                            {new Date(m.timestamp).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }).toUpperCase()}
                                        </p>
                                        <p className="text-[13px] font-serif text-[#1A1A1A] leading-tight capitalize">{m.milestoneId.replace(/_/g, ' ')}</p>
                                    </div>
                                ))}
                                {milestones.length === 0 && <p className="text-xs italic text-[#A6A295]">Escribiendo la historia...</p>}
                            </div>
                        </div>

                        {/* COL 2: GROWTH (Charts) */}
                        <div className="col-span-1 border-r border-[#E5E2D9] pr-8">
                            <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#A6A295] mb-10 uppercase">Evolución</h3>
                            
                            <div className="mb-12">
                                <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-widest mb-1">Peso en Reposo</p>
                                <p className="text-2xl font-serif text-[#1A1A1A]">{weightData[weightData.length-1]} <span className="text-xs italic opacity-50">kg</span></p>
                                <FineChart data={weightData} color="#D4AF37" />
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-widest mb-1">Longitud</p>
                                <p className="text-2xl font-serif text-[#1A1A1A]">{heightData[heightData.length-1]} <span className="text-xs italic opacity-50">cm</span></p>
                                <FineChart data={heightData} color="#A6A295" />
                            </div>
                        </div>

                        {/* COL 3: SU MUNDO (Stats & Solids) */}
                        <div className="col-span-1 border-r border-[#E5E2D9] pr-8">
                            <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#A6A295] mb-10 uppercase">Su Mundo</h3>
                            
                            <div className="mb-12">
                                <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-widest mb-4">Primeros Sabores</p>
                                <div className="space-y-4">
                                    {solidsLogs.length > 0 ? solidsLogs.slice(0, 3).map((s, i) => (
                                        <div key={i} className="flex justify-between items-center border-b border-[#E5E2D9]/50 pb-2">
                                            <span className="text-[12px] font-serif italic">{s.food}</span>
                                            <span className="text-[10px]">{s.reaction === 'love' ? '❤️' : '✨'}</span>
                                        </div>
                                    )) : (
                                        ['Aguacate', 'Pera', 'Calabaza'].map((f, i) => (
                                            <div key={i} className="flex justify-between items-center border-b border-[#E5E2D9]/50 pb-2 opacity-30">
                                                <span className="text-[12px] font-serif italic">{f}</span>
                                                <span className="text-[10px]">✨</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div>
                                <p className="text-[9px] font-bold text-[#A6A295] uppercase tracking-widest mb-4">Sus Palabras</p>
                                <div className="flex flex-wrap gap-x-4 gap-y-2">
                                    {(wordLogs.length > 0 ? wordLogs : [{word: 'Mamá'}, {word: 'Agua'}, {word: 'No'}]).slice(0, 5).map((w, i) => (
                                        <span key={i} className={`text-[15px] font-serif italic ${wordLogs.length === 0 ? 'opacity-30' : ''}`}>"{w.word}"</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* COL 4: QUOTE & CLOSURE */}
                        <div className="col-span-1 flex flex-col justify-end">
                            <div className="mb-auto flex flex-col items-center">
                                <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#A6A295] mb-6 uppercase w-full">Sus Huellas</h3>
                                <div className="flex gap-4">
                                    <div className="relative w-24 h-36 bg-white/30 rounded-full flex items-center justify-center overflow-hidden border border-[#E5E2D9]/30">
                                        {realFootprint ? (
                                            <img src={realFootprint.imageData} className="w-full h-full object-contain rotate-[-10deg] opacity-70" alt="Huella Pie" />
                                        ) : (
                                            <Footprints size={40} className="text-[#A6A295] opacity-20 rotate-[-15deg]" />
                                        )}
                                        <span className="absolute bottom-2 text-[6px] font-bold text-[#A6A295] uppercase tracking-tighter">Pie</span>
                                    </div>
                                    <div className="relative w-24 h-36 bg-white/30 rounded-full flex items-center justify-center overflow-hidden border border-[#E5E2D9]/30">
                                        {realHandprint ? (
                                            <img src={realHandprint.imageData} className="w-full h-full object-contain rotate-[10deg] opacity-70" alt="Huella Mano" />
                                        ) : (
                                            <Hand size={40} className="text-[#A6A295] opacity-20 rotate-[15deg]" />
                                        )}
                                        <span className="absolute bottom-2 text-[6px] font-bold text-[#A6A295] uppercase tracking-tighter">Mano</span>
                                    </div>
                                </div>
                                <p className="text-[8px] font-bold text-[#A6A295] mt-4 uppercase tracking-widest">Escala 1:1 Digital</p>
                            </div>

                            <div className="mt-12 relative">
                                <Quote size={20} className="text-[#D4AF37] opacity-20 absolute -top-4 -left-2" />
                                <p className="text-[14px] font-serif italic leading-relaxed text-[#5C5A52]">
                                    "El tiempo es un hilo fino que une cada uno de estos instantes. Aunque ahora sean tu presente, mañana serán tu tesoro más preciado. Gracias por elegirnos para ver el mundo de nuevo."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer: Fine Print */}
                    <div className="mt-16 flex justify-between items-end border-t border-[#E5E2D9] pt-8 opacity-40">
                        <p className="text-[8px] font-bold uppercase tracking-[0.5em]">Creado con Amor · Nanapp</p>
                        <p className="text-[8px] font-bold uppercase tracking-[0.5em]">Edición Limitada 2024</p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
