import React, { useState } from 'react';
import { ProductsView } from './ProductsView';
import { MemoryBook } from './MemoryBook';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DiscoverView: React.FC = () => {
    const [showMemoryBook, setShowMemoryBook] = useState(false);

    return (
        <div className="flex-1 min-h-0 flex flex-col h-full bg-slate-950 overflow-y-auto pb-24">
            
            {/* Memory Book Incentive Card */}
            <div className="p-6">
                <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMemoryBook(true)}
                    className="w-full relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-rose-500 p-1 group shadow-xl shadow-purple-500/20"
                >
                    <div className="relative bg-slate-950 rounded-[2.4rem] p-6 flex items-center gap-5">
                        {/* Ambient glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-purple-500/30 transition-all" />
                        
                        <div className="w-16 h-16 shrink-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-rose-500/20 border border-white/10 flex items-center justify-center shadow-inner">
                            <BookOpen size={32} className="text-purple-300" />
                        </div>

                        <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles size={14} className="text-orange-300" />
                                <span className="text-[10px] font-black text-orange-200 uppercase tracking-widest">Nuevo: Edición Física</span>
                            </div>
                            <h3 className="text-xl font-black text-white leading-none mb-2">Lámina del Primer Año</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">Genera un PDF minimalista y elegante con el resumen de su año, listo para encuadrar.</p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </motion.button>
            </div>

            <ProductsView />

            <AnimatePresence>
                {showMemoryBook && (
                    <MemoryBook onClose={() => setShowMemoryBook(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};
