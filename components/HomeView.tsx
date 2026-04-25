import React, { useState, useEffect } from 'react';
import { useFavorites } from '../services/hooks/useFavorites';
import { SOUNDS } from '../constants';
import { useLanguage } from '../services/LanguageContext';
import { useBaby } from '../services/BabyContext';
import { useStatistics } from '../services/hooks/useStatistics';
import { useToolData } from '../services/hooks/useToolData';
import { ToolDefinition, ToolId, GrowthLog, BreastfeedingLog, DiaperLog, MedsLog, SleepLog, AppointmentLog } from './tools/types';
import { Baby, GlassWater, Layers, Moon, Pill, Ruler, Smile, Utensils, Droplets, Syringe, Activity, FileText, Trophy, Mic, Calendar, RotateCcw, ShieldCheck, Edit2, Check, Plus, ChevronRight, X, Heart } from 'lucide-react';
import { SoundType } from '../types';
import { SoundButton } from './SoundButton';
import { motion, AnimatePresence } from 'framer-motion';
import { NightCompanion } from './NightCompanion';

const BoyIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M9 11h.01" />
    <path d="M15 11h.01" />
    <path d="M10 15c.5 1 1.5 1.5 2 1.5s1.5-.5 2-1.5" />
    <path d="M11 4c-1-2-2-2-2-2" />
    <path d="M13 4c1-2 2-2 2-2" />
    <path d="M12 4v-2" />
  </svg>
);

const GirlIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M9 11h.01" />
    <path d="M15 11h.01" />
    <path d="M10 15c.5 1 1.5 1.5 2 1.5s1.5-.5 2-1.5" />
    <circle cx="3.5" cy="10" r="2.5" />
    <circle cx="20.5" cy="10" r="2.5" />
    <path d="M8 5c2 1 4 1 6 0" />
  </svg>
);

// Same tools config as ToolsView
const TOOLS_CONFIG: ToolDefinition[] = [
    { id: 'breastfeeding', icon: Baby, translationKey: 'tool_breastfeeding', color: 'text-pink-400', bgColor: 'bg-pink-500/10' },
    { id: 'bottle', icon: GlassWater, translationKey: 'tool_bottle', color: 'text-blue-400', bgColor: 'bg-blue-500/10' },
    { id: 'solids', icon: Utensils, translationKey: 'tool_solids', color: 'text-orange-400', bgColor: 'bg-orange-500/10' },
    { id: 'diapers', icon: Layers, translationKey: 'tool_diapers', color: 'text-amber-400', bgColor: 'bg-amber-500/10' },
    { id: 'sleep', icon: Moon, translationKey: 'tool_sleep', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10' },
    { id: 'routines', icon: Activity, translationKey: 'tool_routines', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10' },
    { id: 'growth', icon: Ruler, translationKey: 'tool_growth', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10' },
    { id: 'first_words', icon: Mic, translationKey: 'tool_first_words', color: 'text-fuchsia-400', bgColor: 'bg-fuchsia-500/10' },
    { id: 'teething', icon: Smile, translationKey: 'tool_teething', color: 'text-rose-400', bgColor: 'bg-rose-500/10' },
    { id: 'meds', icon: Pill, translationKey: 'tool_meds', color: 'text-red-400', bgColor: 'bg-red-500/10' },
    { id: 'vaccines', icon: Syringe, translationKey: 'tool_vaccines', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'pumping', icon: Droplets, translationKey: 'tool_pumping', color: 'text-violet-400', bgColor: 'bg-violet-500/10' },
    { id: 'pediatrician_notes', icon: FileText, translationKey: 'tool_pediatrician_notes', color: 'text-slate-400', bgColor: 'bg-slate-500/10' },
    { id: 'milestones', icon: Trophy, translationKey: 'tool_milestones', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' },
    { id: 'medical_agenda', icon: Calendar, translationKey: 'tool_medical_agenda', color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { id: 'head_position', icon: RotateCcw, translationKey: 'tool_head_position', color: 'text-purple-400', bgColor: 'bg-purple-500/10' },
    { id: 'endocrine_info', icon: ShieldCheck, translationKey: 'tool_endocrine_info', color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
];

interface HomeViewProps {
    currentSoundId: SoundType | null;
    onPlaySound: (id: SoundType) => void;
    onOpenTool: (id: ToolId) => void;
    onOpenSettings?: () => void;
    playerControls?: React.ReactNode;
}

const isNightTime = () => {
    const h = new Date().getHours();
    return h >= 23 || h < 6;
};

export const HomeView: React.FC<HomeViewProps> = ({ currentSoundId, onPlaySound, onOpenTool, onOpenSettings, playerControls }) => {
    const { t } = useLanguage();
    const { activeBaby, addBaby } = useBaby();
    const { stats } = useStatistics();

    // Night mode — respects user preference from settings
    const nightModeEnabled = () => localStorage.getItem('nanapp_night_mode') !== 'false';
    const [isNight, setIsNight] = useState(() => isNightTime() && nightModeEnabled());
    useEffect(() => {
        const check = () => setIsNight(isNightTime() && nightModeEnabled());
        const timer = setInterval(check, 60000);
        window.addEventListener('nanapp_settings_changed', check);
        return () => { clearInterval(timer); window.removeEventListener('nanapp_settings_changed', check); };
    }, []);

    useEffect(() => {
        const handleForceNight = () => setForceNight(true);
        window.addEventListener('nanapp_force_night', handleForceNight);
        return () => window.removeEventListener('nanapp_force_night', handleForceNight);
    }, []);

    const { favoriteSounds, favoriteTools, toggleFavoriteSound, toggleFavoriteTool } = useFavorites();
    const [isEditingSounds, setIsEditingSounds] = useState(false);
    const [isEditingTools, setIsEditingTools] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [forceNight, setForceNight] = useState(false);

    const favSoundsData = SOUNDS.filter(s => favoriteSounds.includes(s.id));
    const favToolsData = TOOLS_CONFIG.filter(t => favoriteTools.includes(t.id));

    // ── Night mode override ──────────────────────────────────────
    if ((isNight || forceNight) && activeBaby) {
        return (
            <NightCompanion
                baby={activeBaby}
                onPlaySound={onPlaySound}
                currentSoundId={currentSoundId}
                onOpenTool={onOpenTool as any}
                playerControls={playerControls}
                onExitPreview={() => setForceNight(false)}
                isPreview={forceNight && !isNight}
            />
        );
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 flex flex-col px-4 overflow-y-auto overflow-x-hidden gap-6 pt-2 scrollbar-hide pb-12"
        >
            {/* ── SMART DASHBOARD ─────────────────────────────────── */}
            <SmartDashboard
                activeBaby={activeBaby}
                onAddBaby={() => setShowOnboarding(true)}
                onOpenTool={onOpenTool}
            />

            <AnimatePresence>
                {showOnboarding && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-xl flex flex-col p-6"
                    >
                        <BabyOnboardingFlow
                            onComplete={(b) => { addBaby(b); setShowOnboarding(false); }}
                            onCancel={() => setShowOnboarding(false)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Quick Sounds Section */}
            <section className="flex flex-col shrink-0 transition-all">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('tab_sounds')} (Favoritos)</h2>
                    <button 
                        onClick={() => setIsEditingSounds(!isEditingSounds)}
                        className={`p-1.5 rounded-full transition-colors ${isEditingSounds ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        {isEditingSounds ? <Check size={14} /> : <Edit2 size={14} />}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isEditingSounds ? (
                        <motion.div 
                            key="edit-sounds"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-2 gap-2"
                        >
                            {SOUNDS.map(sound => {
                                const isSelected = favoriteSounds.includes(sound.id);
                                return (
                                    <div 
                                        key={sound.id} 
                                        onClick={() => toggleFavoriteSound(sound.id)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'bg-orange-500/20 border-orange-500' : 'bg-slate-800/40 border-transparent hover:bg-slate-800'}`}
                                    >
                                        <sound.Icon size={18} className={isSelected ? 'text-orange-400' : 'text-slate-400'} />
                                        <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>{t(sound.id as any) || sound.label}</span>
                                        {isSelected && <Check size={14} className="ml-auto text-orange-400" />}
                                    </div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="view-sounds"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 gap-3"
                        >
                            {favSoundsData.map(sound => (
                                <SoundButton
                                    key={sound.id}
                                    sound={sound}
                                    isActive={currentSoundId === sound.id}
                                    onClick={() => onPlaySound(sound.id)}
                                />
                            ))}
                            {favSoundsData.length === 0 && (
                                <div onClick={() => setIsEditingSounds(true)} className="col-span-2 p-6 border-2 border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/5 transition-colors">
                                    <p className="text-slate-400 text-sm">Selecciona tus sonidos favoritos</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Optional Controls Layer when playing */}
                <AnimatePresence>
                    {playerControls && currentSoundId && !isEditingSounds && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 shrink-0"
                        >
                            {playerControls}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Quick Tools Section */}
            <section className="flex flex-col flex-1 min-h-0 transition-all">
                <div className="flex items-center justify-between mb-4 shrink-0">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('tab_tools')} (Favoritas)</h2>
                    <button 
                        onClick={() => setIsEditingTools(!isEditingTools)}
                        className={`p-1.5 rounded-full transition-colors ${isEditingTools ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        {isEditingTools ? <Check size={14} /> : <Edit2 size={14} />}
                    </button>
                </div>

                <AnimatePresence mode="wait">
                    {isEditingTools ? (
                        <motion.div 
                            key="edit-tools"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex-1 overflow-y-auto pr-2 pb-4 grid grid-cols-1 gap-2 content-start"
                        >
                            {TOOLS_CONFIG.map(tool => {
                                const isSelected = favoriteTools.includes(tool.id);
                                return (
                                    <div 
                                        key={tool.id} 
                                        onClick={() => toggleFavoriteTool(tool.id)}
                                        className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all shrink-0 ${isSelected ? 'bg-teal-500/10 border-teal-500/30' : 'bg-slate-800/40 border-transparent hover:bg-slate-800/80'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${tool.bgColor} ${tool.color}`}>
                                                <tool.icon size={20} />
                                            </div>
                                            <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>{t(tool.translationKey as any)}</span>
                                        </div>
                                        <div className={`p-1.5 rounded-full ${isSelected ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-slate-400'}`}>
                                            {isSelected ? <Check size={16} /> : <Plus size={16} />}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="view-tools"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-2 gap-3 flex-1 min-h-0 content-start"
                        >
                            {favToolsData.map(tool => (
                                <div
                                    key={tool.id}
                                    onClick={() => onOpenTool(tool.id)}
                                    className="bg-slate-800/50 backdrop-blur-md rounded-[1.5rem] p-4 border border-white/5 hover:bg-slate-800 transition-all cursor-pointer group relative overflow-hidden flex flex-col justify-between active:scale-[0.98] min-h-[4.5rem] h-auto"
                                >
                                    <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl opacity-20 ${tool.bgColor.replace('/10', '')}`} />

                                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${tool.bgColor} ${tool.color} mb-2 shrink-0`}>
                                        <tool.icon size={16} strokeWidth={2.5} />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-slate-200 leading-tight mb-0.5 line-clamp-2 break-words">{t(tool.translationKey as any)}</h3>
                                    </div>
                                </div>
                            ))}
                            {favToolsData.length === 0 && (
                                <div onClick={() => setIsEditingTools(true)} className="col-span-2 p-6 border-2 border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/5 transition-colors">
                                    <p className="text-slate-400 text-sm">Selecciona tus herramientas frecuentes</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </motion.div>
    );
};

// ─── SmartDashboard ──────────────────────────────────────────────────────────
const fmtAgo = (ms: number) => {
    const m = Math.floor(ms / 60000);
    if (m < 60) return `hace ${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `hace ${h}h${m % 60 > 0 ? ` ${m % 60}m` : ''}`;
    return `hace ${Math.floor(h / 24)}d`;
};

const SmartDashboard: React.FC<{
    activeBaby: any;
    onAddBaby: () => void;
    onOpenTool: (id: ToolId) => void;
}> = ({ activeBaby, onAddBaby, onOpenTool }) => {
    const { babies, setActiveBabyId } = useBaby();
    const { stats } = useStatistics();
    const { logs: bfLogs }     = useToolData<BreastfeedingLog>('breastfeeding');
    const { logs: diaperLogs } = useToolData<DiaperLog>('diapers');
    const { logs: medsLogs }   = useToolData<MedsLog>('meds');
    const { logs: sleepLogs }  = useToolData<SleepLog>('sleep');
    const { logs: agendaLogs } = useToolData<AppointmentLog>('medical_agenda');
    const { logs: growthLogs } = useToolData<GrowthLog>('growth');

    if (!activeBaby) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="shrink-0 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-900/40 via-slate-800/80 to-slate-900/90 border border-white/10 p-8 shadow-2xl text-center"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-3xl flex items-center justify-center mb-6 border border-orange-500/20 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                        <Baby size={40} className="text-orange-400" />
                    </div>
                    <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-200 via-orange-100 to-white mb-3 font-['Outfit'] tracking-tight">Bienvenido a nanapp</h1>
                    <p className="text-sm text-slate-300 mb-8 leading-relaxed max-w-xs mx-auto">
                        Crea el perfil de tu bebé para acceder al dashboard inteligente, registro de tomas, sueño y mucho más.
                    </p>
                    <button onClick={onAddBaby} className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-base px-8 py-4 rounded-full shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
                        <Plus size={20} />
                        Configurar bebé
                    </button>
                </div>
            </motion.div>
        );
    }

    const bid = activeBaby.id;
    const now = Date.now();
    const todayStart = new Date().setHours(0, 0, 0, 0);

    // ── Data ────────────────────────────────────────────────────
    const lastBf = bfLogs.filter(l => !l.babyId || l.babyId === bid).sort((a, b) => b.timestamp - a.timestamp)[0];
    const lastDiaper = diaperLogs.filter(l => !l.babyId || l.babyId === bid).sort((a, b) => b.timestamp - a.timestamp)[0];
    const lastSleep = sleepLogs.filter(l => !l.babyId || l.babyId === bid).sort((a, b) => b.timestamp - a.timestamp)[0];
    const latestGrowth = growthLogs.filter(l => !l.babyId || l.babyId === bid).sort((a, b) => b.timestamp - a.timestamp)[0];
    const todayMeds = medsLogs.filter(l => l.timestamp >= todayStart);
    const nextAppt = agendaLogs
        .filter(l => !l.completed && l.timestamp >= todayStart)
        .sort((a, b) => a.timestamp - b.timestamp)[0];

    const daysSinceBirth = Math.floor((now - activeBaby.birthDate) / (1000 * 60 * 60 * 24));
    const months = Math.floor(daysSinceBirth / 30.5);
    const bfMinutesAgo = lastBf ? Math.floor((now - lastBf.timestamp) / 60000) : null;
    const diaperMinutesAgo = lastDiaper ? Math.floor((now - lastDiaper.timestamp) / 60000) : null;

    // ── Storytelling Insights ───────────────────────────────────
    const hoursPlayed = Math.round(stats.totalPlayTimeMinutes / 60);
    const getInsight = () => {
        if (hoursPlayed > 0) {
            return {
                title: "Vuestro refugio sonoro",
                text: `Esta semana habéis compartido ${hoursPlayed} horas de calma. El ruido blanco ha sido vuestro aliado para que ${activeBaby.name} se sienta como en el útero.`,
                icon: Moon
            };
        }
        return {
            title: "Un nuevo comienzo",
            text: `Cada registro en nanapp es una pieza más del puzzle que estás construyendo con ${activeBaby.name}. Vas por buen camino.`,
            icon: Heart
        };
    };

    // ── Age-based Tips ──────────────────────────────────────────
    const getTip = (m: number) => {
        const tips = [
            "El ruido blanco imita el sonido del útero. Es el abrazo sonoro que ayuda a calmar su sistema nervioso.",
            "A esta edad, su visión aún es borrosa. Acércate a unos 20cm para que pueda reconocer tu cara.",
            "Las rutinas predecibles son su ancla. Hacer lo mismo antes de dormir le da seguridad emocional.",
            "¿Notas que intenta imitar tus sonidos? Háblale mucho, estás sentando las bases de su lenguaje.",
            "El movimiento es vida. Un poco de 'tummy time' diario fortalece su cuello para sus futuras aventuras.",
            "Empieza la fase de exploración. Asegura los enchufes y esquinas; su curiosidad no tiene límites.",
            "La ansiedad por separación es normal. Es la señal de que ha creado un vínculo fuerte y sano contigo.",
            "Fomentar su autonomía en pequeñas cosas le ayuda a ganar confianza. Déjale elegir entre dos juguetes.",
            "El juego es su trabajo. A través de él aprende causa-efecto y resolución de problemas básicos."
        ];
        const index = Math.min(m, tips.length - 1);
        return tips[index];
    };

    const insight = getInsight();
    const ageTip = getTip(months);

    // ── Alerts ──────────────────────────────────────────────────
    const alerts: { id: string; icon: React.ElementType; label: string; detail: string; color: string; bg: string; border: string; tool: ToolId }[] = [];

    if (bfMinutesAgo !== null && bfMinutesAgo > 180) {
        alerts.push({ id: 'bf', icon: Baby, label: 'Hace más de 3h sin toma', detail: `Última: ${fmtAgo(now - lastBf!.timestamp)} · Toca ${lastBf!.side === 'L' ? 'Der.' : 'Izq.'}`, color: 'text-pink-300', bg: 'bg-pink-950/60', border: 'border-pink-500/30', tool: 'breastfeeding' });
    }
    if (diaperMinutesAgo !== null && diaperMinutesAgo > 240) {
        alerts.push({ id: 'diaper', icon: Layers, label: 'Hace más de 4h sin pañal', detail: fmtAgo(now - lastDiaper!.timestamp), color: 'text-amber-300', bg: 'bg-amber-950/60', border: 'border-amber-500/30', tool: 'diapers' });
    }
    if (nextAppt) {
        const apptDate = new Date(nextAppt.timestamp);
        alerts.push({ id: 'appt', icon: Calendar, label: nextAppt.reason, detail: apptDate.toLocaleDateString('es', { weekday: 'short', day: 'numeric', month: 'short' }) + (nextAppt.doctorName ? ` · ${nextAppt.doctorName}` : ''), color: 'text-blue-300', bg: 'bg-blue-950/60', border: 'border-blue-500/30', tool: 'medical_agenda' });
    }

    return (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="shrink-0 flex flex-col gap-3">
            {/* ── BABY SELECTOR (only if multi) ── */}
            {babies.length > 1 && (
                <div className="flex gap-2 mb-1 overflow-x-auto pb-1 scrollbar-hide">
                    {babies.map(b => (
                        <button 
                            key={b.id}
                            onClick={() => setActiveBabyId(b.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                                activeBaby.id === b.id 
                                ? 'bg-orange-500/20 border-orange-500 text-orange-200' 
                                : 'bg-slate-800/40 border-white/5 text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                            <div className={`w-2 h-2 rounded-full ${b.gender === 'girl' ? 'bg-pink-400' : 'bg-blue-400'}`} />
                            <span className="text-xs font-bold">{b.name}</span>
                        </button>
                    ))}
                    <button onClick={onAddBaby} className="flex items-center gap-2 px-4 py-2 rounded-full border bg-slate-800/20 border-white/5 text-slate-500 hover:text-white transition-all">
                        <Plus size={14} />
                    </button>
                </div>
            )}

            {/* ── HERO ── */}
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-900/50 via-slate-800/60 to-slate-900/70 border border-white/5 p-4 shadow-xl">
                <div className="absolute -top-8 -right-8 w-28 h-28 bg-orange-500/15 rounded-full blur-[40px] pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-indigo-500/15 rounded-full blur-[40px] pointer-events-none" />

                <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br from-orange-400/20 to-pink-500/20 border border-orange-200/15 flex items-center justify-center">
                        {activeBaby.gender === 'girl'
                            ? <GirlIcon size={28} className="text-pink-300" />
                            : <BoyIcon size={28} className="text-blue-300" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between">
                            <h1 className="text-xl font-bold text-white tracking-tight truncate">{activeBaby?.name || 'Bebé'}</h1>
                            <span className="text-xs font-bold text-orange-300 shrink-0 ml-2">{daysSinceBirth || 0}d</span>
                        </div>
                        {latestGrowth && (
                            <div className="flex items-center gap-2 mt-0.5">
                                {latestGrowth.weightKg && <span className="text-xs text-emerald-300 font-semibold">{latestGrowth.weightKg}kg</span>}
                                {latestGrowth.heightCm && <span className="text-xs text-teal-300 font-semibold">{latestGrowth.heightCm}cm</span>}
                                <button onClick={() => onOpenTool('growth')} className="text-[9px] text-slate-500 hover:text-slate-300 ml-auto">Actualizar →</button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Story Insight Pill ── */}
                {insight && (
                    <div className="mb-4 p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                            {React.createElement(insight.icon, { size: 16 })}
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-orange-200 uppercase tracking-wider mb-0.5">{insight.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed italic opacity-80">"{insight.text}"</p>
                        </div>
                    </div>
                )}

                {/* ── Quick stat pills ── */}
                <div className="grid grid-cols-3 gap-2">
                    {/* Feeding */}
                    <button onClick={() => onOpenTool('breastfeeding')} className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/60 active:scale-95 transition-all">
                        <Baby size={16} className={`mb-1 ${bfMinutesAgo !== null && bfMinutesAgo > 180 ? 'text-pink-400' : 'text-pink-300/60'}`} />
                        <span className="text-[10px] font-bold text-white leading-none">
                            {lastBf ? `${bfMinutesAgo}m` : '—'}
                        </span>
                        <span className="text-[8px] text-slate-500 mt-0.5">Lactancia</span>
                        {lastBf && <span className="text-[8px] font-bold text-pink-300 mt-0.5 bg-pink-500/15 px-1.5 rounded-full">→{lastBf.side === 'L' ? 'D' : 'I'}</span>}
                    </button>

                    {/* Diaper */}
                    <button onClick={() => onOpenTool('diapers')} className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/60 active:scale-95 transition-all">
                        <Layers size={16} className={`mb-1 ${diaperMinutesAgo !== null && diaperMinutesAgo > 240 ? 'text-amber-400' : 'text-amber-300/60'}`} />
                        <span className="text-[10px] font-bold text-white leading-none">
                            {lastDiaper ? `${diaperMinutesAgo}m` : '—'}
                        </span>
                        <span className="text-[8px] text-slate-500 mt-0.5">Pañal</span>
                    </button>

                    {/* Sleep */}
                    <button onClick={() => onOpenTool('sleep')} className="flex flex-col items-center p-2.5 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/60 active:scale-95 transition-all">
                        <Moon size={16} className="mb-1 text-indigo-300/60" />
                        <span className="text-[10px] font-bold text-white leading-none">
                            {lastSleep ? fmtAgo(now - lastSleep.timestamp) : '—'}
                        </span>
                        <span className="text-[8px] text-slate-500 mt-0.5">Sueño</span>
                    </button>
                </div>

                {todayMeds.length > 0 && (
                    <button onClick={() => onOpenTool('meds')} className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-900/50 border border-white/5 hover:bg-slate-800/60 transition-all">
                        <Pill size={13} className="text-red-400 shrink-0" />
                        <span className="text-[10px] text-slate-300 font-medium truncate">
                            Medicamentos hoy: {todayMeds.map(m => m.medName).join(', ')}
                        </span>
                        <ChevronRight size={12} className="text-slate-600 ml-auto shrink-0" />
                    </button>
                )}
            </div>

            {/* ── Daily Tip ── */}
            <div className="bg-slate-900/40 rounded-3xl p-4 border border-white/5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center shrink-0">
                    <Smile size={20} className="text-teal-400" />
                </div>
                <div className="flex-1">
                    <h5 className="text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-0.5">Consejo para {months} meses</h5>
                    <p className="text-xs text-slate-400 leading-tight">{ageTip}</p>
                </div>
            </div>

            {/* ── ALERTS ── */}
            {alerts.length > 0 && (
                <div className="flex flex-col gap-2">
                    {alerts.map((alert, i) => (
                        <motion.button
                            key={alert.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            onClick={() => onOpenTool(alert.tool)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${alert.bg} ${alert.border} text-left active:scale-[0.98] transition-all`}
                        >
                            <div className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center ${alert.bg} border ${alert.border}`}>
                                <alert.icon size={16} className={alert.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className={`text-xs font-bold ${alert.color} leading-tight`}>{alert.label}</p>
                                <p className="text-[10px] text-slate-500 truncate mt-0.5">{alert.detail}</p>
                            </div>
                            <ChevronRight size={14} className="text-slate-600 shrink-0" />
                        </motion.button>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

// ─── Onboarding ───────────────────────────────────────────────────────────────
const BabyOnboardingFlow: React.FC<{ onComplete: (b: any) => void; onCancel: () => void }> = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState<'boy' | 'girl'>('boy');
    const [caregiverName, setCaregiverName] = useState('');
    const [caregiverRole, setCaregiverRole] = useState<'mama' | 'papa' | 'otro'>('mama');

    const handleNext = () => setStep(s => s + 1);

    return (
        <div className="flex flex-col h-full justify-center">
            <button onClick={onCancel} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white">
                <X size={24} />
            </button>

            {/* Step indicator */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0,1,2,3].map(i => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? 'w-6 bg-orange-400' : 'w-3 bg-slate-700'}`} />
                ))}
            </div>
            
            <AnimatePresence mode="wait">
                {step === 0 && (
                    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center px-4">
                        <div className="w-24 h-24 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,115,22,0.2)]">
                            <Baby size={48} className="text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-['Outfit']">¡Enhorabuena!</h2>
                        <p className="text-indigo-200 text-lg mb-8 max-w-xs mx-auto leading-relaxed">
                            Comienza una aventura increíble. Vamos a crear el espacio de tu bebé.
                        </p>
                        <button onClick={handleNext} className="bg-white text-slate-900 font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform">
                            Comenzar
                        </button>
                    </motion.div>
                )}

                {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col max-w-sm mx-auto w-full px-2">
                        <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">¿Cómo se llama?</h2>
                        <p className="text-indigo-300/70 text-sm mb-6">El nombre más bonito del mundo.</p>
                        <input
                            type="text" autoFocus value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ej. Leo, Vega, Sofía..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-5 text-2xl text-white font-bold mb-6 focus:border-orange-500 focus:bg-slate-800 outline-none transition-all shadow-inner"
                        />
                        <div className="flex bg-slate-800/50 p-1.5 rounded-2xl border border-slate-700 mb-8">
                            <button onClick={() => setGender('boy')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${gender === 'boy' ? 'bg-blue-500 text-white shadow-md' : 'text-slate-400'}`}>Niño</button>
                            <button onClick={() => setGender('girl')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${gender === 'girl' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400'}`}>Niña</button>
                        </div>
                        <button disabled={!name.trim()} onClick={handleNext} className="bg-orange-500 disabled:opacity-30 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform">
                            Siguiente
                        </button>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col max-w-sm mx-auto w-full px-2">
                        <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">¿Cuándo nació?</h2>
                        <p className="text-indigo-300/70 text-sm mb-6">Para calcular sus días de vida y percentiles.</p>
                        <input
                            type="date" value={date}
                            onChange={e => setDate(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-5 text-xl text-white font-bold mb-8 focus:border-orange-500 outline-none"
                        />
                        <button disabled={!date} onClick={handleNext} className="bg-orange-500 disabled:opacity-30 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform">
                            Siguiente
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col max-w-sm mx-auto w-full px-2">
                        <h2 className="text-2xl font-bold text-white mb-1 font-['Outfit']">¿Cómo te llamas?</h2>
                        <p className="text-indigo-300/70 text-sm mb-6">Para personalizar tu experiencia en la app.</p>

                        <input
                            type="text" value={caregiverName}
                            onChange={e => setCaregiverName(e.target.value)}
                            placeholder="Tu nombre (opcional)"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4 text-lg text-white font-medium mb-8 focus:border-orange-500 focus:bg-slate-800 outline-none transition-all shadow-inner"
                        />

                        <button
                            onClick={() => onComplete({
                                name: name.trim(),
                                birthDate: new Date(date).getTime(),
                                gender,
                                caregiverName: caregiverName.trim() || undefined,
                                caregiverRole,
                            })}
                            className="bg-orange-500 text-slate-950 font-bold text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:scale-105 transition-transform flex items-center justify-center gap-2"
                        >
                            <span className="text-2xl">✨</span> ¡Todo listo!
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

