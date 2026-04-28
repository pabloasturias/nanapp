import React, { useState } from 'react';
import { ProductsView } from './ProductsView';
import { MemoryBook } from './MemoryBook';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DiscoverView: React.FC = () => {
    const [showMemoryBook, setShowMemoryBook] = useState(false);

    return (
        <div className="flex-1 min-h-0 flex flex-col h-full bg-slate-950 pb-8">
            


            <ProductsView />

            <AnimatePresence>
                {showMemoryBook && (
                    <MemoryBook onClose={() => setShowMemoryBook(false)} />
                )}
            </AnimatePresence>
        </div>
    );
};
