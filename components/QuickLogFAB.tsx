import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Baby, GlassWater } from 'lucide-react';
import { useToolData } from '../services/hooks/useToolData';
import { BreastfeedingLog, BottleLog } from './tools/types';
import { useBaby } from '../services/BabyContext';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    glow: string;
    onTap: () => void;
}

export const QuickLogFAB: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [flash, setFlash] = useState<string | null>(null);
    const { activeBaby } = useBaby();

    const { addLog: addBf } = useToolData<BreastfeedingLog>('breastfeeding');
    const { addLog: addBottle } = useToolData<BottleLog>('bottle');

    const babyId = activeBaby?.id;

    const log = (label: string, fn: () => void) => {
        fn();
        setFlash(label);
        setOpen(false);
        setTimeout(() => setFlash(null), 2000);
    };

    const actions: QuickAction[] = [
        {
            id: 'bottle',
            label: 'Biberón registrado ✓',
            icon: GlassWater,
            color: 'text-blue-300',
            bg: 'bg-blue-500/20 border-blue-500/30',
            glow: 'shadow-blue-500/20',
            onTap: () => log('Biberón registrado ✓', () => addBottle({
                timestamp: Date.now(),
                amount: 120,
                unit: 'ml',
                type: 'formula',
                ...(babyId ? { babyId } : {})
            })),
        },
    ];

    return (
        <>
            {/* Toast flash */}
            <AnimatePresence>
                {flash && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[200] bg-emerald-500 text-white text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-emerald-500/30 whitespace-nowrap"
                    >
                        {flash}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-[90] bg-slate-950/60 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>

            {/* Actions fan */}
            <div className="fixed bottom-24 right-5 z-[100] flex flex-col items-end gap-3">
                <AnimatePresence>
                    {open && actions.map((action, i) => (
                        <motion.button
                            key={action.id}
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                            onClick={action.onTap}
                            className={`flex items-center gap-3 pr-4 pl-3 py-3 rounded-2xl border backdrop-blur-md shadow-xl ${action.bg} ${action.glow}`}
                        >
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${action.bg}`}>
                                <action.icon size={18} className={action.color} />
                            </div>
                            <span className="text-sm font-bold text-white whitespace-nowrap">
                                Biberón
                            </span>
                        </motion.button>
                    ))}
                </AnimatePresence>

                {/* Main FAB */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setOpen(o => !o)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 border
                        ${open
                            ? 'bg-slate-700 border-slate-600 rotate-45'
                            : 'bg-gradient-to-br from-orange-400 to-orange-500 border-orange-300 shadow-orange-500/40'
                        }`}
                >
                    <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
                        <Plus size={26} className={open ? 'text-slate-200' : 'text-slate-950'} strokeWidth={2.5} />
                    </motion.div>
                </motion.button>
            </div>
        </>
    );
};
