import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, X, ExternalLink, Check, Moon, Droplets, Plane, Sparkles, ShoppingCart, User, Heart, Gift, Gamepad2 } from 'lucide-react';
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
        case 'toys': return <Gamepad2 size={24} strokeWidth={1.5} />;
        default: return <BookOpen size={24} strokeWidth={1.5} />;
    }
};

const CATEGORIES = [
    { id: 'all', translationKey: 'cat_all', icon: BookOpen },
    { id: 'toys', translationKey: 'cat_toys', icon: Gamepad2 },
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
    const [activeAge, setActiveAge] = useState('all'); // For Toys filter
    const [activeTab, setActiveTab] = useState<'products' | 'toys' | 'registry'>('products');

    // Select products for current language (fallback to 'en' or empty)
    // Memoize to avoid re-shuffling on every render unless language changes
    const currentProducts = useMemo(() => {
        const products = productsByLang[language] || productsByLang['en'] || [];
        // Randomize order
        return [...products].sort(() => Math.random() - 0.5);
    }, [language]);

    // Filter
    const filteredProducts = useMemo(() => {
        if (activeTab === 'toys') {
            let toys = currentProducts.filter(p => p.category.toLowerCase() === 'toys');
            if (activeAge !== 'all') {
                toys = toys.filter(p => p.subcategory === activeAge);
            }
            return toys;
        }

        // Top 50 Tab (Exclude toys)
        if (activeTab === 'products') {
            let filtered = currentProducts.filter(p => p.category.toLowerCase() !== 'toys');

            if (activeCategory !== 'all') {
                filtered = filtered.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
            }
            return filtered;
        }

        return [];
    }, [currentProducts, activeCategory, activeAge, activeTab]);

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
                            <p className="text-xs text-slate-400 font-medium tracking-wide">{t('resource_subtitle')}</p>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="px-4 mb-6">
                    <div className="flex bg-slate-800/50 p-1 rounded-2xl border border-white/5 relative">
                        {/* Selected Indicator Background */}
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(33.33%-4px)] bg-slate-700/80 rounded-xl shadow-sm transition-all duration-300 ease-out border border-white/5
                                ${activeTab === 'products' ? 'left-1' : activeTab === 'toys' ? 'left-[calc(33.33%+2px)]' : 'left-[calc(66.66%+2px)]'}
                            `}
                        />

                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex-1 relative z-10 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'products' ? 'text-teal-300' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {t('tab_top50')}
                        </button>
                        <button
                            onClick={() => setActiveTab('toys')}
                            className={`flex-1 relative z-10 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'toys' ? 'text-purple-300' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {t('cat_toys')}
                        </button>
                        <button
                            onClick={() => setActiveTab('registry')}
                            className={`flex-1 relative z-10 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'registry' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {t('tab_registry')}
                        </button>
                    </div>
                </div>

                {activeTab !== 'registry' ? (
                    <>
                        {/* Category Chips (Only for Top 50) */}
                        {activeTab === 'products' && (
                            <div className="px-4 mb-6 relative">
                                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mask-gradient-r">
                                    {CATEGORIES.filter(c => c.id !== 'toys').map(cat => (
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
                        )}

                        {/* Age Filter for Toys */}
                        {activeTab === 'toys' && (
                            <div className="px-4 mb-6 animate-[fade-in_0.2s_ease-out]">
                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar justify-center">
                                    {['all', '0-6m', '6-12m', '1-2y', '2y+'].map(age => (
                                        <button
                                            key={age}
                                            onClick={() => setActiveAge(age)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border
                                                ${activeAge === age
                                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                                                    : 'bg-slate-800/30 border-white/5 text-slate-500 hover:text-slate-300'}
                                            `}
                                        >
                                            {age === 'all' ? t('cat_all') : age}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products List */}
                        <div className="flex flex-col gap-3 px-4 pb-8 animate-[fade-in_0.3s_ease-out]">
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
                    </>
                ) : (
                    // Registry Tab Content
                    <div className="px-4 animate-[slide-up_0.3s_ease-out]">
                        <a
                            href="http://www.amazon.es/baby-reg/homepage?tag=ID_de_afiliado-21"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block relative overflow-hidden rounded-[2rem] bg-slate-800 border border-white/5 shadow-2xl group transition-all duration-300 hover:scale-[1.01] hover:border-white/10"
                        >
                            {/* Content same as before */}
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-700/20 to-transparent pointer-events-none" />
                            <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-white rotate-12 pointer-events-none">
                                <Gift size={240} strokeWidth={1} />
                            </div>

                            <div className="relative z-10 p-6 sm:p-8">
                                <span className="inline-block text-xs font-bold text-teal-400 uppercase tracking-widest mb-3">
                                    {t('registry_hero_subtitle')}
                                </span>

                                <h3 className="text-2xl sm:text-3xl font-bold mb-4 font-['Quicksand'] text-white leading-tight">
                                    {t('registry_hero_title')}
                                </h3>

                                <p className="text-slate-300 text-sm leading-relaxed mb-8 font-light max-w-[95%]">
                                    {t('registry_hero_desc')}
                                </p>

                                <div className="space-y-3 mb-8">
                                    {/* Bullets */}
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-teal-500/10 shrink-0 mt-0.5"><Check size={12} className="text-teal-400" strokeWidth={3} /></div>
                                        <span className="text-sm text-slate-200">{t('registry_bullet_1')}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-teal-500/10 shrink-0 mt-0.5"><Check size={12} className="text-teal-400" strokeWidth={3} /></div>
                                        <span className="text-sm text-slate-200">{t('registry_bullet_2')}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="p-1 rounded-full bg-teal-500/10 shrink-0 mt-0.5"><Check size={12} className="text-teal-400" strokeWidth={3} /></div>
                                        <span className="text-sm text-slate-200">{t('registry_bullet_3')}</span>
                                    </div>
                                </div>

                                <div className="inline-flex w-full items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-900/20 hover:shadow-orange-500/20 transition-all">
                                    <span>{t('amazon_banner_cta')}</span>
                                    <ExternalLink size={16} strokeWidth={2.5} />
                                </div>
                            </div>
                        </a>
                    </div>
                )}
            </div>

            {/* Product Detail "Page" (Full Screen Overlay) */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[100] bg-slate-900 animate-[slide-in-right_0.3s_ease-out] overflow-y-auto">
                    {/* Header/Nav */}
                    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl px-4 py-4 flex items-center justify-between border-b border-white/5 shadow-lg">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                        >
                            <div className="p-2 bg-slate-800 rounded-full group-hover:bg-slate-700 transition-colors">
                                <ChevronRight size={20} className="rotate-180" />
                            </div>
                            <span className="font-bold text-sm uppercase tracking-wide">{t('back')}</span>
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto pb-32">
                        <div className="h-72 bg-gradient-to-br from-teal-900/40 to-slate-900 flex items-center justify-between px-8 relative overflow-hidden shrink-0">
                            {/* Decor */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[50px] translate-y-1/4 -translate-x-1/4" />
                        </div>

                        <div className="px-6 sm:px-10 -mt-20 relative z-10">
                            <div className="mb-8">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-teal-500/30 backdrop-blur-md mb-6 shadow-xl">
                                    <span className="text-teal-400">{getCategoryIcon(selectedProduct.category)}</span>
                                    <span className="text-xs font-bold text-teal-100 uppercase tracking-wider">
                                        {t(`cat_${selectedProduct.category.toLowerCase()}` as any)}
                                    </span>
                                </div>
                                <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight font-['Quicksand'] mb-4 drop-shadow-sm">{selectedProduct.name}</h2>
                                <p className="text-xl text-slate-400 font-light leading-snug">{selectedProduct.shortDesc}</p>
                            </div>

                            <p className="text-slate-300 leading-relaxed mb-12 text-lg font-light">
                                {selectedProduct.longDesc}
                            </p>

                            <div className="bg-slate-800/30 rounded-[2rem] p-8 border border-white/5 mb-12">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-4 mb-6">Lo que lo hace especial</h4>
                                <ul className="space-y-5">
                                    {selectedProduct.features?.map((feature, idx) => (
                                        <li key={idx} className="flex gap-4 text-base text-slate-200">
                                            <div className="mt-1 p-1 bg-teal-500/20 rounded-full text-teal-400 shrink-0 h-fit">
                                                <Check size={16} strokeWidth={3} />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Affiliate Links Section */}
                            {selectedProduct.affiliateLink && (
                                <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent z-40 flex justify-center">
                                    <div className="w-full max-w-md">
                                        <a
                                            href={selectedProduct.affiliateLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full py-4 px-6 rounded-[1.5rem] font-bold text-lg text-center flex items-center justify-between bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_25px_rgba(20,184,166,0.3)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)] active:scale-[0.98] transition-all duration-300 group"
                                        >
                                            <span className="ml-2">{t('buy_amazon')}</span>
                                            <div className="bg-white/20 p-2 rounded-full group-hover:scale-110 transition-transform">
                                                <ExternalLink size={24} className="text-white" />
                                            </div>
                                        </a>
                                        <p className="text-[10px] text-center text-slate-500 mt-3 pb-2">
                                            {t('affiliate_disclaimer')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
