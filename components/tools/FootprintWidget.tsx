import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Check, Footprints, Info, Sparkles, Download, RotateCcw, Hand } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';
import { useToolData } from '../../services/hooks/useToolData';
import { FootprintLog } from './types';
import { useBaby } from '../../services/BabyContext';

interface FootprintWidgetProps {
    onClose: () => void;
}

export const FootprintFull: React.FC<FootprintWidgetProps> = ({ onClose }) => {
    const { t } = useLanguage();
    const { activeBaby } = useBaby();
    const { logs, addLog, deleteLog } = useToolData<FootprintLog>('footprint');
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasContent, setHasContent] = useState(false);
    const [showInstructions, setShowInstructions] = useState(true);
    const [type, setType] = useState<'pie' | 'mano'>('pie');

    useEffect(() => {
        if (!showInstructions) {
            setupCanvas();
        }
    }, [showInstructions]);

    const setupCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.fillStyle = '#1A1A1A';
    };

    const draw = (x: number, y: number, pressure: number = 0.5) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const posX = x - rect.left;
        const posY = y - rect.top;

        const radius = type === 'pie' ? 18 + (pressure * 20) : 15 + (pressure * 15);
        const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, radius);
        gradient.addColorStop(0, 'rgba(26, 26, 26, 0.4)');
        gradient.addColorStop(0.5, 'rgba(26, 26, 26, 0.1)');
        gradient.addColorStop(1, 'rgba(26, 26, 26, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(posX, posY, radius, 0, Math.PI * 2);
        ctx.fill();
        
        setHasContent(true);
    };

    const handleTouch = (e: React.TouchEvent) => {
        e.preventDefault();
        const touches = e.targetTouches;
        for (let i = 0; i < touches.length; i++) {
            const touch = touches[i];
            draw(touch.clientX, touch.clientY, touch.force || 0.5);
        }
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!ctx || !canvas) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasContent(false);
    };

    const handleSave = () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasContent) return;

        const imageData = canvas.toDataURL('image/png');
        addLog({
            timestamp: Date.now(),
            imageData,
            type,
            babyId: activeBaby?.id
        });
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col font-sans"
        >
            <div className="p-4 flex items-center justify-between border-b border-[#E5E2D9]">
                <button onClick={onClose} className="p-2 text-[#A6A295] hover:text-[#1A1A1A]">
                    <X size={20} />
                </button>
                <div className="text-center">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#A6A295]">{t('tool_footprint')}</h2>
                    <p className="text-[9px] italic text-[#A6A295]">{activeBaby?.name}</p>
                </div>
                <div className="w-10" />
            </div>

            <AnimatePresence mode="wait">
                {showInstructions ? (
                    <motion.div 
                        key="instructions"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex-1 flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="flex gap-4 mb-8">
                            <div className="w-20 h-20 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center">
                                <Footprints size={32} className="text-[#D4AF37]" />
                            </div>
                            <div className="w-20 h-20 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center">
                                <Hand size={32} className="text-[#D4AF37]" />
                            </div>
                        </div>
                        <h3 className="text-xl font-serif italic text-[#1A1A1A] mb-4">Captura sus pequeños pasos y caricias</h3>
                        <p className="text-sm text-[#A6A295] leading-relaxed mb-12 max-w-xs">
                            Elige qué quieres capturar y presiona suavemente sobre la pantalla para crear un recuerdo eterno.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4 w-full mb-12">
                            <button onClick={() => setType('pie')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'pie' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#E5E2D9] opacity-40'}`}>
                                <Footprints size={32} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Pie</span>
                            </button>
                            <button onClick={() => setType('mano')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'mano' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#E5E2D9] opacity-40'}`}>
                                <Hand size={32} />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Mano</span>
                            </button>
                        </div>

                        <button 
                            onClick={() => setShowInstructions(false)}
                            className="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-sm tracking-widest shadow-xl hover:scale-105 transition-all"
                        >
                            COMENZAR
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="canvas"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex-1 flex flex-col p-4 relative"
                    >
                        <div className="flex-1 relative border border-dashed border-[#E5E2D9] rounded-[2rem] overflow-hidden bg-white/50">
                            <canvas 
                                ref={canvasRef}
                                onTouchStart={handleTouch}
                                onTouchMove={handleTouch}
                                className="w-full h-full touch-none"
                            />
                            
                            {!hasContent && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
                                    {type === 'pie' ? <Footprints size={80} className="text-[#A6A295] mb-4" /> : <Hand size={80} className="text-[#A6A295] mb-4" />}
                                    <p className="text-xs uppercase tracking-widest font-bold text-[#A6A295]">Presiona la {type} aquí</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex items-center justify-between gap-4">
                            <button 
                                onClick={handleClear}
                                className="p-4 rounded-full bg-[#E5E2D9] text-[#1A1A1A] hover:bg-[#D4D1C5] transition-colors"
                            >
                                <RotateCcw size={20} />
                            </button>
                            
                            <button 
                                onClick={handleSave}
                                disabled={!hasContent}
                                className="flex-1 py-4 rounded-full bg-[#1A1A1A] disabled:opacity-20 text-white font-bold text-sm tracking-widest shadow-xl flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> GUARDAR {type.toUpperCase()}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export const FootprintDashboard: React.FC = () => {
    const { logs } = useToolData<FootprintLog>('footprint');
    const lastLog = logs[0];

    if (!lastLog) return <span className="text-[#A6A295]">Sin huellas</span>;

    return (
        <div className="flex items-center gap-2">
            <div className="w-6 h-8 bg-white/50 rounded border border-black/5 overflow-hidden">
                <img src={lastLog.imageData} alt="Huella" className="w-full h-full object-contain opacity-60" />
            </div>
            <span className="text-[10px] font-bold text-[#1A1A1A]">{lastLog.type === 'pie' ? 'Pie' : 'Mano'}</span>
        </div>
    );
};
