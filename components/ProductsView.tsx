import React, { useState } from 'react';
import { ShoppingBag, ChevronRight, X, ExternalLink, Check, Moon, Droplets, Plane, Sparkles, AlertCircle } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';
import productsData from '../products.json';
import { Product } from '../types';

// Cast the JSON to the keyed structure
const productsByLang = productsData as Record<string, Product[]>;

// Helper to get icon by category
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'sleep': return <Moon size={32} strokeWidth={1.5} />;
        case 'environment': return <Droplets size={32} strokeWidth={1.5} />;
        case 'travel': return <Plane size={32} strokeWidth={1.5} />;
        case 'hygiene': return <Sparkles size={32} strokeWidth={1.5} />;
        default: return <ShoppingBag size={32} strokeWidth={1.5} />;
    }
};

export const ProductsView: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Select products for current language (fallback to 'en' or empty)
    const currentProducts = productsByLang[language] || productsByLang['en'] || [];

    const categories = [
        { id: 'all', label: 'Todos' },
        { id: 'sleep', label: 'Para Dormir' },
        { id: 'environment', label: 'Ambiente' },
        { id: 'travel', label: 'Viaje' },
        { id: 'hygiene', label: 'Cuidados' }
    ];

    const filteredProducts = activeCategory === 'all'
        ? currentProducts
        : currentProducts.filter(p => p.category === activeCategory);

    return (
        <div className="flex-1 overflow-y-auto pb-24 px-1 relative">
            <div className="animate-[fade-in_0.5s_ease-out]">

                {/* Header */}
                <div className="px-4 pt-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)] border border-indigo-500/10">
                            <ShoppingBag size={24} />
                        </div>
                        <div>
                            {/* Standard Font (Inter) */}
                            <h2 className="text-2xl font-bold text-orange-50">Aliados del Descanso</h2>
                            <p className="text-xs text-slate-400 font-medium">Selección experta para noches tranquilas</p>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 px-4 overflow-x-auto pb-4 no-scrollbar mb-2">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`
                                whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 border
                                ${activeCategory === cat.id
                                    ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/25'
                                    : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'}
                            `}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 gap-4 px-4 pb-8">
                    {filteredProducts.map(product => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-5 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-indigo-300 p-4 bg-slate-800/50 rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                                    {getCategoryIcon(product.category)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-bold text-orange-50 mb-1 leading-tight group-hover:text-indigo-200 transition-colors">
                                            {product.name}
                                        </h3>
                                        {/* REMOVED PRICE */}
                                    </div>
                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-3">
                                        {product.shortDesc}
                                    </p>
                                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-300 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                        Ver detalles <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setSelectedProduct(null)}>
                    <div
                        className="bg-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-white/10 shadow-2xl relative animate-[slide-up_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header Image Area */}
                        <div className="h-48 bg-gradient-to-br from-indigo-900/40 to-slate-900 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
                            <span className="text-white/80 relative z-10 drop-shadow-2xl filter animate-float">
                                {getCategoryIcon(selectedProduct.category)}
                            </span>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-4 right-4 p-2 bg-black/20 rounded-full text-white/70 hover:bg-black/40 hover:text-white transition-colors backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-1 block">Recomendado</span>
                                    {/* Standard Font */}
                                    <h2 className="text-2xl font-bold text-orange-50 leading-tight">{selectedProduct.name}</h2>
                                </div>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-8 text-sm">
                                {selectedProduct.longDesc}
                            </p>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Características Clave</h4>
                                <ul className="space-y-3">
                                    {selectedProduct.features?.map((feature, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                            <div className="mt-0.5 p-0.5 bg-emerald-500/20 rounded-full text-emerald-400 shrink-0 h-fit">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <a
                                href={selectedProduct.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                    w-full py-4 rounded-2xl font-bold text-center flex items-center justify-center gap-2 transition-all duration-300
                                    ${selectedProduct.url && selectedProduct.url !== '#'
                                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02]'
                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'}
                                `}
                            >
                                {selectedProduct.url && selectedProduct.url !== '#' ? (
                                    <>
                                        Ver en Amazon <ExternalLink size={18} />
                                    </>
                                ) : (
                                    <>No disponible</>
                                )}
                            </a>
                            <p className="text-[10px] text-center text-slate-600 mt-4 px-8">
                                Como afiliado de Amazon, podemos recibir una pequeña comisión por compras elegibles sin coste extra para ti.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
