import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Baby, Layers, Moon, Music, ChevronRight, X } from 'lucide-react';
import { BabyProfile } from '../services/BabyContext';
import { useToolData } from '../services/hooks/useToolData';
import { BreastfeedingLog, DiaperLog } from './tools/types';
import { SoundType } from '../types';
import { SOUNDS } from '../constants';

// ─── Frases de noche (honestas, no motivacionales baratas) ───────────────────
const NIGHT_PHRASES = [
    "Lo estás haciendo bien. Aunque no lo parezca.",
    "El sueño volverá. Esta etapa, no.",
    "Nadie te va a dar una medalla por esto. Pero mereces una.",
    "No tienes que hacerlo perfecto. Solo estar aquí. Y aquí estás.",
    "Lo que haces a las {hora} nadie lo verá. Pero {nombre} lo lleva contigo.",
    "El agotamiento es real. El amor también.",
    "Eres su lugar seguro. Eso es enorme.",
    "No existe un manual. Tú lo estás escribiendo.",
    "Los días son largos. Los años son cortos. Este momento es único.",
    "Respira. Ya está aquí. Ya está a salvo.",
    "Mañana no recordarás a qué hora fue esto. Pero {nombre} lleva este cuidado contigo.",
    "Las mejores personas que cuidan bebés son las que se preguntan si lo hacen bien.",
    "A veces el mejor plan es simplemente llegar a mañana. Y llegarás.",
    "Esta noche también pasará. Ya has pasado {noches} antes.",
    "En este momento hay miles de personas en el mundo haciendo exactamente lo mismo.",
    "El silencio de la noche tiene su propia magia. Estáis solos los dos.",
    "No se necesita ser perfecto para esto. Solo constante. Y tú lo eres.",
    "Hoy has tomado cientos de decisiones por {nombre}. Todas con amor.",
    "Estás construyendo el recuerdo más importante de su vida sin saberlo.",
    "{nombre} no sabrá cómo fue esta noche. Solo sabrá que siempre estuviste.",
    "La oscuridad y el cansancio no duran. El vínculo que estás construyendo, sí.",
    "No hace falta hacer nada especial. Ya lo estás haciendo.",
    "Esta pequeña persona confía en ti completamente. Eso no se consigue con perfección.",
    "Hay algo sagrado en estas horas que el mundo no ve.",
    "Quizás mañana sea mejor. Si no, también pasará.",
    "Cada vez que te levantas, le estás enseñando algo sin saberlo.",
    "El amor no descansa. Tú tampoco. Eso dice todo.",
    "Este momento, aunque parezca interminable, ya está pasando.",
    "La paciencia que tienes ahora mismo es un superpoder silencioso.",
    "No estás solo/a en esto. Aunque lo parezca.",
];

// ─── Utilidades ───────────────────────────────────────────────────────────────
const getPhrase = (baby: BabyProfile, nightCount: number): string => {
    const hour = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    const name = baby.caregiverName || (baby.caregiverRole === 'papa' ? 'papá' : 'mamá');
    const babyName = baby.name;
    const idx = nightCount % NIGHT_PHRASES.length;
    return NIGHT_PHRASES[idx]
        .replace('{hora}', hour)
        .replace(/{nombre}/g, babyName)
        .replace('{noches}', String(nightCount));
};

interface NightCompanionProps {
    baby: BabyProfile;
    onPlaySound: (id: SoundType) => void;
    currentSoundId: SoundType | null;
    onOpenTool: (id: string) => void;
    playerControls?: React.ReactNode;
    onExitPreview?: () => void;
    isPreview?: boolean;
}

export const NightCompanion: React.FC<NightCompanionProps> = ({
    baby, onPlaySound, currentSoundId, onOpenTool, playerControls, onExitPreview, isPreview
}) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { addLog: addBf } = useToolData<BreastfeedingLog>('breastfeeding');
    const { addLog: addDiaper } = useToolData<DiaperLog>('diapers');
    const [justLogged, setJustLogged] = useState<string | null>(null);

    const nightNumber = Math.floor((Date.now() - baby.birthDate) / (1000 * 60 * 60 * 24));
    const phrase = getPhrase(baby, nightNumber);

    const caregiverLabel = baby.caregiverName
        ? baby.caregiverName
        : baby.caregiverRole === 'papa' ? 'Papá' : 'Mamá';

    // Live clock
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(timer);
    }, []);

    const timeStr = currentTime.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });

    const logQuick = (type: 'breast' | 'diaper') => {
        if (type === 'breast') {
            addBf({ timestamp: Date.now(), side: 'L', durationSeconds: 0, manual: true, babyId: baby.id });
            setJustLogged('Toma registrada ✓');
        } else {
            addDiaper({ timestamp: Date.now(), type: 'wet', babyId: baby.id });
            setJustLogged('Pañal registrado ✓');
        }
        setTimeout(() => setJustLogged(null), 2500);
    };

    // Pick a simple sound to suggest
    const firstSound = SOUNDS[0];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-between px-6 py-12"
            style={{
                background: 'radial-gradient(ellipse at top, #1a0505 0%, #0a0000 60%, #000000 100%)',
            }}
        >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[100px] pointer-events-none"
                style={{ background: 'rgba(180, 30, 30, 0.12)' }} />

            {/* Preview exit button */}
            {isPreview && onExitPreview && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={onExitPreview}
                    className="absolute top-5 right-5 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: 'rgba(180,30,30,0.3)', color: 'rgba(220,120,120,0.9)', border: '1px solid rgba(180,60,60,0.3)' }}
                >
                    <X size={12} /> Salir
                </motion.button>
            )}

            {/* ── TOP: Time + Night counter ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col items-center gap-1 pt-4"
            >
                <span className="text-5xl font-thin tracking-widest"
                    style={{ color: 'rgba(200, 100, 100, 0.9)', fontVariantNumeric: 'tabular-nums' }}>
                    {timeStr}
                </span>
                <div className="flex items-center gap-2 mt-2">
                    <Moon size={12} style={{ color: 'rgba(200, 100, 100, 0.5)' }} />
                    <span className="text-xs font-bold uppercase tracking-[0.2em]"
                        style={{ color: 'rgba(200, 100, 100, 0.5)' }}>
                        Noche {nightNumber} · {caregiverLabel}
                    </span>
                </div>
            </motion.div>

            {/* ── CENTER: Phrase ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                className="flex-1 flex items-center justify-center px-4"
            >
                <p className="text-center text-xl font-light leading-relaxed max-w-xs"
                    style={{ color: 'rgba(220, 140, 140, 0.85)' }}>
                    "{phrase}"
                </p>
            </motion.div>

            {/* ── Toast feedback ── */}
            <AnimatePresence>
                {justLogged && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-full text-sm font-bold"
                        style={{ background: 'rgba(180, 60, 60, 0.9)', color: 'rgba(255, 200, 200, 1)' }}
                    >
                        {justLogged}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── BOTTOM: Actions ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="w-full flex flex-col gap-3"
            >
                {/* Quick log row */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => logQuick('breast')}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all active:scale-95"
                        style={{
                            background: 'rgba(180, 30, 30, 0.15)',
                            borderColor: 'rgba(180, 60, 60, 0.3)',
                            color: 'rgba(220, 140, 140, 0.9)'
                        }}
                    >
                        <Baby size={18} />
                        <span className="text-sm font-bold">Toma</span>
                    </button>
                    <button
                        onClick={() => logQuick('diaper')}
                        className="flex items-center justify-center gap-2 py-4 rounded-2xl border transition-all active:scale-95"
                        style={{
                            background: 'rgba(180, 30, 30, 0.15)',
                            borderColor: 'rgba(180, 60, 60, 0.3)',
                            color: 'rgba(220, 140, 140, 0.9)'
                        }}
                    >
                        <Layers size={18} />
                        <span className="text-sm font-bold">Pañal</span>
                    </button>
                </div>

                {/* Sound button */}
                <button
                    onClick={() => onPlaySound(firstSound.id as SoundType)}
                    className="flex items-center justify-between px-5 py-4 rounded-2xl border w-full transition-all active:scale-95"
                    style={{
                        background: currentSoundId ? 'rgba(180, 30, 30, 0.25)' : 'rgba(180, 30, 30, 0.1)',
                        borderColor: currentSoundId ? 'rgba(200, 60, 60, 0.5)' : 'rgba(180, 60, 60, 0.2)',
                        color: 'rgba(220, 140, 140, 0.9)'
                    }}
                >
                    <div className="flex items-center gap-3">
                        <Music size={18} />
                        <span className="text-sm font-bold">
                            {currentSoundId ? 'Sonando · Pausar' : 'Poner ruido blanco'}
                        </span>
                    </div>
                    <ChevronRight size={16} style={{ color: 'rgba(180, 80, 80, 0.5)' }} />
                </button>

                {/* Player controls if playing */}
                {playerControls && currentSoundId && (
                    <div className="opacity-60">
                        {playerControls}
                    </div>
                )}

                {/* Exit hint */}
                <p className="text-center text-[10px] pb-2"
                    style={{ color: 'rgba(180, 60, 60, 0.35)' }}>
                    Modo noche · Activo hasta las 6:00
                </p>
            </motion.div>
        </motion.div>
    );
};
