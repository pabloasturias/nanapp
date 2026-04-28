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
    const { addLog } = useToolData<FootprintLog>('footprint');
    
    const [image, setImage] = useState<string | null>(null);
    const [type, setType] = useState<'pie' | 'mano'>('pie');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSave = () => {
        if (!image) return;

        addLog({
            timestamp: Date.now(),
            imageData: image,
            type,
            babyId: activeBaby?.id
        });
        onClose();
    };

    const reset = () => {
        setImage(null);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-[#FAF9F6] flex flex-col font-sans"
        >
            <div className="p-4 flex items-center justify-between border-b border-[#E5E2D9]">
                <button onClick={onClose} className="p-2 text-[#A6A295] hover:text-[#1A1A1A]">
                    <X size={20} />
                </button>
                <div className="text-center">
                    <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#A6A295]">Registro de Recuerdo</h2>
                    <p className="text-[9px] italic text-[#A6A295]">{activeBaby?.name}</p>
                </div>
                <div className="w-10" />
            </div>

            <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                {!image ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 rounded-full bg-[#1A1A1A]/5 flex items-center justify-center mb-8">
                            <Camera size={40} className="text-[#D4AF37]" />
                        </div>
                        <h3 className="text-2xl font-serif italic text-[#1A1A1A] mb-4">Captura su primer paso</h3>
                        <p className="text-sm text-[#A6A295] leading-relaxed mb-12 max-w-xs">
                            Sube una foto de la huella de su mano o pie (en papel o digital) para incluirla en su lámina del primer año.
                        </p>

                        <div className="flex gap-4 w-full mb-8">
                            <button 
                                onClick={() => setType('pie')} 
                                className={`flex-1 p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'pie' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#E5E2D9] opacity-40'}`}
                            >
                                <Footprints size={32} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black">Pie</span>
                            </button>
                            <button 
                                onClick={() => setType('mano')} 
                                className={`flex-1 p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${type === 'mano' ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-[#E5E2D9] opacity-40'}`}
                            >
                                <Hand size={32} />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-black">Mano</span>
                            </button>
                        </div>

                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment"
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-sm tracking-widest shadow-xl flex items-center justify-center gap-3"
                        >
                            <ImageIcon size={18} /> HACER FOTO O SUBIR
                        </button>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        <div className="flex-1 relative rounded-[2rem] overflow-hidden border border-[#E5E2D9] bg-white shadow-inner">
                            <img src={image} alt="Preview" className="w-full h-full object-contain" />
                            <div className="absolute top-4 right-4">
                                <div className="bg-[#D4AF37] text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">
                                    {type === 'pie' ? 'Pie' : 'Mano'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button 
                                onClick={reset}
                                className="p-4 rounded-full bg-[#E5E2D9] text-[#1A1A1A]"
                            >
                                <RotateCcw size={20} />
                            </button>
                            <button 
                                onClick={handleSave}
                                className="flex-1 py-4 rounded-full bg-[#1A1A1A] text-white font-bold text-sm tracking-widest shadow-xl flex items-center justify-center gap-2"
                            >
                                <Check size={18} /> GUARDAR RECUERDO
                            </button>
                        </div>
                    </div>
                )}
            </div>
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
