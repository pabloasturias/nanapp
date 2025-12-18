import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, X, ExternalLink, Check, Moon, Droplets, Plane, Sparkles, ShoppingCart, User, Heart, Gift } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';
import productsData from '../products.json';
import { Product } from '../types';

// Cast the JSON to the keyed structure
const data = (productsData as any).default || productsData;
const productsByLang = data as Record<string, Product[]>;

// Helper to get icon by category
const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
        case 'sleep': return <Moon size={24} strokeWidth={1.5} />;
        case 'environment': return <Droplets size={24} strokeWidth={1.5} />;
        case 'travel': return <Plane size={24} strokeWidth={1.5} />;
        case 'hygiene': return <Sparkles size={24} strokeWidth={1.5} />;
        case 'mom': return <User size={24} strokeWidth={1.5} />;
        case 'health': return <Heart size={24} strokeWidth={1.5} />;
        default: return <BookOpen size={24} strokeWidth={1.5} />;
    }
};

const CATEGORIES = [
    { id: 'all', translationKey: 'cat_all', icon: BookOpen },
    { id: 'sleep', translationKey: 'cat_sleep', icon: Moon },
    { id: 'environment', translationKey: 'cat_environment', icon: Droplets },
    { id: 'health', translationKey: 'cat_health', icon: Heart },
    { id: 'mom', translationKey: 'cat_mom', icon: User },
    { id: 'travel', translationKey: 'cat_travel', icon: Plane },
    { id: 'hygiene', translationKey: 'cat_hygiene', icon: Sparkles },
];

export const ProductsView: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeCategory, setActiveCategory] = useState('all');

    // Select products for current language (fallback to 'en' or empty)
    // Memoize to avoid re-shuffling on every render unless language changes
    const currentProducts = useMemo(() => {
        const products = productsByLang[language] || productsByLang['en'] || [];
        // Randomize order
        return [...products].sort(() => Math.random() - 0.5);
    }, [language]);

    // Filter
    const filteredProducts = activeCategory === 'all'
        ? currentProducts
        : currentProducts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

    return (
        <div className="flex-1 overflow-y-auto pb-24 px-1 relative">
            <div className="animate-[fade-in_0.5s_ease-out]">

                {/* Header */}
                <div className="px-4 pt-4 mb-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.15)] border border-teal-500/10">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-orange-50 font-['Quicksand']">Recursos</h2>
                            <p className="text-xs text-slate-400 font-medium tracking-wide">Guía esencial para padres</p>
                        </div>
                    </div>
                </div>

                {/* Category Chips */}
                <div className="px-4 mb-6 relative">
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient-r">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border
                                    ${activeCategory === cat.id
                                        ? 'bg-teal-500/20 border-teal-500/50 text-teal-300'
                                        : 'bg-slate-800/50 border-white/5 text-slate-400 hover:bg-slate-800'}
                                `}
                            >
                                <cat.icon size={14} />
                                <span className="text-xs font-bold uppercase tracking-wide">{t(cat.translationKey as any)}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Amazon Registry Banner */}
                <div className="px-4 mb-8">
                    <a
                        href="http://www.amazon.es/baby-reg/homepage?tag=ID_de_afiliado-21"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-400 to-amber-600 shadow-xl shadow-orange-500/20 group hover:shadow-orange-500/30 transition-all duration-300 hover:scale-[1.01]"
                    >
                        {/* Background Deco */}
                        <div className="absolute -top-4 -right-4 p-8 opacity-10 rotate-12 pointer-events-none text-white">
                            <Gift size={140} strokeWidth={1.5} />
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />

                        <div className="relative z-10 p-6 sm:p-8">
                            <div className="flex items-start justify-between mb-2">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/20 mb-4 shadow-sm">
                                    <Gift size={14} className="text-white" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white">{t('amazon_banner_subtitle')}</span>
                                </div>
                            </div>

                            <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-['Quicksand'] leading-tight text-white max-w-[85%] drop-shadow-sm">
                                {t('amazon_banner_title')}
                            </h3>

                            <div className="flex flex-col gap-2 mb-8">
                                <div className="flex items-center gap-2 text-sm font-medium text-white/95">
                                    <div className="p-0.5 rounded-full bg-white/20">
                                        <Check size={12} className="text-white" strokeWidth={4} />
                                    </div>
                                    <span>{t('amazon_benefit_1')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-white/95">
                                    <div className="p-0.5 rounded-full bg-white/20">
                                        <Check size={12} className="text-white" strokeWidth={4} />
                                    </div>
                                    <span>{t('amazon_benefit_2')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-white/95">
                                    <div className="p-0.5 rounded-full bg-white/20">
                                        <Check size={12} className="text-white" strokeWidth={4} />
                                    </div>
                                    <span>{t('amazon_benefit_3')}</span>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-2 bg-white text-orange-600 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-orange-50 transition-colors">
                                <span>{t('amazon_banner_cta')}</span>
                                <ExternalLink size={16} strokeWidth={2.5} />
                            </div>
                        </div>
                    </a>
                </div>

                {/* Products List (No Numbering) */}
                <div className="flex flex-col gap-3 px-4 pb-8">
                    {filteredProducts.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[1.5rem] p-4 hover:bg-slate-800/60 transition-all duration-300 cursor-pointer active:scale-[0.98] overflow-hidden"
                        >
                            <div className="flex gap-4 relative z-10">

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-white/5 flex items-center gap-1.5">
                                                {/* Use toLowerCase() for safe key generation */}
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {t(`cat_${product.category.toLowerCase()}` as any)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-orange-50 mb-1 leading-tight group-hover:text-teal-200 transition-colors font-['Quicksand']">
                                        {product.name}
                                    </h3>

                                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-3 pr-8 font-light">
                                        {product.shortDesc}
                                    </p>

                                    <div className="flex items-center gap-1 text-xs font-bold text-teal-400/80 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                                        Ver detalles <ChevronRight size={14} />
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
                        className="bg-slate-900 w-full max-w-lg h-[80vh] sm:h-auto max-h-[85vh] overflow-y-auto rounded-t-[2.5rem] sm:rounded-[2.5rem] border-t sm:border border-white/10 shadow-2xl relative animate-[slide-up_0.3s_ease-out]"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="h-32 bg-gradient-to-br from-teal-900/40 to-slate-900 flex items-center justify-between px-8 relative overflow-hidden shrink-0">
                            <div className="relative z-10 flex gap-4 items-center mt-4">
                                {/* Removed Number */}
                            </div>

                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="absolute top-6 right-6 p-2 bg-black/20 rounded-full text-white/70 hover:bg-black/40 hover:text-white transition-colors backdrop-blur-md z-20"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="px-8 pb-12 -mt-8 relative z-10">
                            <div className="mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-teal-500/20 backdrop-blur-md mb-3">
                                    <span className="text-teal-400">{getCategoryIcon(selectedProduct.category)}</span>
                                    <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">
                                        {t(`cat_${selectedProduct.category.toLowerCase()}` as any)}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold text-orange-50 leading-none font-['Quicksand']">{selectedProduct.name}</h2>
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

                            {/* Affiliate Links Section */}
                            {selectedProduct.affiliateLink && (
                                <div className="bg-slate-800/30 rounded-2xl p-4 border border-white/5 mb-8">
                                    <div className="flex items-center gap-2 mb-4 text-orange-200/80">
                                        <ShoppingCart size={16} />
                                        <span className="text-xs font-bold uppercase tracking-wider">Disponible Online</span>
                                    </div>

                                    <a
                                        href={selectedProduct.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-center flex items-center justify-between bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-900/20 hover:shadow-teal-500/20 hover:scale-[1.01] transition-all duration-300 group"
                                    >
                                        <span>{t('buy_amazon')}</span>
                                        <ExternalLink size={16} className="opacity-70 group-hover:opacity-100" />
                                    </a>

                                    <p className="text-[10px] text-center text-slate-600 mt-3">
                                        {t('affiliate_disclaimer')}
                                    </p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
