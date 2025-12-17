import React, { useState } from 'react';
import { BookOpen, ChevronRight, X, ExternalLink, Check, Moon, Droplets, Plane, Sparkles, ShoppingCart, Info, Search } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';
import productsData from '../products.json';
import { Product } from '../types';

// Cast the JSON to the keyed structure
const productsByLang = productsData as Record<string, Product[]>;

// Helper to get icon by category
const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'sleep': return <Moon size={24} strokeWidth={1.5} />;
        case 'environment': return <Droplets size={24} strokeWidth={1.5} />;
        case 'travel': return <Plane size={24} strokeWidth={1.5} />;
        case 'hygiene': return <Sparkles size={24} strokeWidth={1.5} />;
        default: return <BookOpen size={24} strokeWidth={1.5} />;
    }
};

export const ProductsView: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Select products for current language (fallback to 'en' or empty)
    const currentProducts = productsByLang[language] || productsByLang['en'] || [];

    // Search filter
    const filteredProducts = currentProducts.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.shortDesc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto pb-24 px-1 relative">
            <div className="animate-[fade-in_0.5s_ease-out]">

                {/* Header */}
                <div className="px-4 pt-4 mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-500/10">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-orange-50">Recursos</h2>
                            <p className="text-xs text-slate-400 font-medium">Guía esencial para padres</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-4 relative">
                        <input
                            type="text"
                            placeholder="Buscar recurso..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500/50 transition-colors placeholder:text-slate-600"
                        />
                        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                    </div>
                </div>

                {/* Products List (Numbered) */}
                <div className="flex flex-col gap-3 px-4 pb-8">
                    {filteredProducts.map((product, index) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[1.5rem] p-4 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden"
                        >
                            {/* Number Watermark */}
                            <span className="absolute -right-4 -bottom-6 text-[80px] font-bold text-slate-800/20 select-none group-hover:text-slate-800/40 transition-colors pointer-events-none font-['Quicksand']">
                                {product.id}
                            </span>

                            <div className="flex gap-4 relative z-10">
                                {/* Number Circle */}
                                <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-slate-800 border border-white/5 items-center justify-center text-sm font-bold text-teal-500 font-mono">
                                    {product.id}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="sm:hidden text-xs font-mono text-teal-500 font-bold">#{product.id}</span>
                                            <div className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/5 flex items-center gap-1.5">
                                                <span className="text-slate-400">{getCategoryIcon(product.category)}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{product.category}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-orange-50 mb-1 leading-tight group-hover:text-teal-200 transition-colors">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-3 pr-8">
                                        {product.shortDesc}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs font-bold text-teal-400/80 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                        Leer más <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="text-center py-10 text-slate-500">
                            <p>No se encontraron recursos.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Product Detail Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-[fade-in_0.2s_ease-out]" onClick={() => setSelectedProduct(null)}>
                    <div
                        className="bg-slate-900 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-white/10 shadow-2xl relative animate-[slide-up_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="h-32 bg-gradient-to-br from-teal-900/40 to-slate-900 flex items-center justify-between px-8 relative overflow-hidden shrink-0">
                            <div className="relative z-10 flex gap-4 items-center mt-4">
                                <span className="text-5xl font-black text-white/10 font-mono tracking-tighter">#{selectedProduct.id}</span>
                            </div>

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 bg-black/20 rounded-full text-white/70 hover:bg-black/40 hover:text-white transition-colors backdrop-blur-md z-20"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="px-8 pb-8 -mt-8 relative z-10">
                            <div className="mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-teal-500/20 backdrop-blur-md mb-3">
                                    <span className="text-teal-400">{getCategoryIcon(selectedProduct.category)}</span>
                                    <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">{selectedProduct.category}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-orange-50 leading-none">{selectedProduct.name}</h2>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-8 text-sm font-light">
                                {selectedProduct.longDesc}
                            </p>

                            <div className="space-y-4 mb-8">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Lo que lo hace especial</h4>
                                <ul className="space-y-3">
                                    {selectedProduct.features?.map((feature, idx) => (
                                        <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                            <div className="mt-0.5 p-0.5 bg-teal-500/20 rounded-full text-teal-400 shrink-0 h-fit">
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Affiliate Links Section - Only render if links exist */}
                            {selectedProduct.affiliateLinks && selectedProduct.affiliateLinks.length > 0 ? (
                                <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5">
                                    <div className="flex items-center gap-2 mb-4 text-orange-200/80">
                                        <ShoppingCart size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Disponible en Amazon</span>
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {selectedProduct.affiliateLinks.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-between bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/20 hover:shadow-teal-500/20 hover:scale-[1.01] transition-all duration-300 group"
                                            >
                                                <span>{link.label}</span>
                                                <ExternalLink size={16} className="opacity-70 group-hover:opacity-100" />
                                            </a>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-center text-slate-600 mt-3">
                                        En calidad de Afiliado de Amazon, obtenemos ingresos por las compras adscritas que cumplen los requisitos aplicables.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-slate-800/30 border border-white/5 flex items-center gap-3">
                                    <div className="p-2 bg-slate-700/50 rounded-full text-slate-400">
                                        <Info size={18} />
                                    </div>
                                    <p className="text-xs text-slate-500">Este recurso es puramente informativo. No hay enlaces de compra disponibles para tu región.</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
