import React, { useState, useMemo } from 'react';
import { BookOpen, ChevronRight, X, ExternalLink, Check, Moon, Droplets, Plane, Sparkles, ShoppingCart, User, Heart, Gift, Gamepad2, ChevronLeft, Star } from 'lucide-react'; // Added ChevronLeft, Star
import { useLanguage } from '../services/LanguageContext';
import { Product } from '../types';

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
    { id: 'sleep', translationKey: 'cat_sleep', icon: Moon },
    { id: 'environment', translationKey: 'cat_environment', icon: Droplets },
    { id: 'health', translationKey: 'cat_health', icon: Heart },
    { id: 'mom', translationKey: 'cat_mom', icon: User },
    { id: 'travel', translationKey: 'cat_travel', icon: Plane },
    { id: 'hygiene', translationKey: 'cat_hygiene', icon: Sparkles },
    // Toys is handled separately
];

type ViewMode = 'menu' | 'top50' | 'toys' | 'registry' | 'books';

export const ProductsView: React.FC = () => {
    const { t, language } = useLanguage();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [currentView, setCurrentView] = useState<ViewMode>('menu');
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeAge, setActiveAge] = useState('all'); // For Toys filter
    const [products, setProducts] = useState<Product[]>([]);

    // Load products dynamically
    React.useEffect(() => {
        const loadProducts = async () => {
            try {
                // Dynamic import with Vite glob or direct import if path is known
                // We use direct import construction which Vite supports if files exist
                const module = await import(`../data/products/${language}.json`);
                setProducts(module.default || module);
            } catch (err) {
                console.error(`Failed to load products for ${language}`, err);
                setProducts([]);
            }
        };
        loadProducts();
    }, [language]);

    // Select products for current language
    const currentProducts = useMemo(() => {
        return [...products].sort(() => Math.random() - 0.5);
    }, [products]);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        if (currentView === 'toys') {
            let toys = currentProducts.filter(p => p.category.toLowerCase() === 'toys');
            if (activeAge !== 'all') {
                toys = toys.filter(p => p.subcategory === activeAge);
            }
            return toys; // Already sorted randomly by currentProducts, or we can sort by ID
        }

        if (currentView === 'books') {
            return currentProducts.filter(p => p.category.toLowerCase() === 'books');
        }

        if (currentView === 'registry') {
            return []; // Registry uses a static view, no product list
        }

        // Top 50 view (Default)
        // Filter out toys and books from the main list if they are in dedicated sections
        let products = currentProducts.filter(p =>
            p.category.toLowerCase() !== 'toys' &&
            p.category.toLowerCase() !== 'books'
        );

        if (activeCategory !== 'all') {
            products = products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
        }

        return products;
    }, [currentView, activeCategory, activeAge, currentProducts]);


    // Render Logic for Product Detail Overlay
    const renderProductDetail = () => {
        if (!selectedProduct) return null;

        return (
            <div className="fixed inset-0 z-[100] bg-slate-900 animate-[slide-in-right_0.3s_ease-out] overflow-y-auto">
                <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl px-4 py-4 flex items-center justify-between border-b border-white/5 shadow-lg">
                    <button
                        onClick={() => setSelectedProduct(null)}
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors group"
                    >
                        <div className="p-2 bg-slate-800 rounded-full group-hover:bg-slate-700 transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span className="font-bold text-sm uppercase tracking-wide">{t('back')}</span>
                    </button>
                    {/* Share or standard header actions could go here */}
                </div>

                <div className="max-w-3xl mx-auto pb-32">
                    <div className="px-6 pt-6 relative z-10">
                        <div className="bg-slate-900/80 backdrop-blur-md rounded-[2rem] border border-white/5 p-6 shadow-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-teal-500/10 border border-teal-500/20">
                                <span className="text-xs font-bold text-teal-300 uppercase tracking-widest">
                                    {t(`cat_${selectedProduct.category.toLowerCase()}` as any)}
                                </span>
                            </div>

                            <h2 className="text-3xl font-bold text-white leading-tight font-['Quicksand'] mb-2">{selectedProduct.name}</h2>
                            <p className="text-lg text-slate-400 font-light mb-6">{selectedProduct.shortDesc}</p>

                            <a
                                href={selectedProduct.affiliateLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white p-4 rounded-xl font-bold uppercase tracking-wide transition-all shadow-lg shadow-orange-500/20 mb-8"
                            >
                                <ShoppingCart size={20} />
                                {t('buy_amazon')}
                            </a>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t('description_title')}</h3>
                                    <p className="text-slate-300 leading-relaxed text-base">{selectedProduct.longDesc}</p>
                                </div>

                                {selectedProduct.features && selectedProduct.features.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t('features_title')}</h3>
                                        <ul className="space-y-3">
                                            {selectedProduct.features.map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-xl">
                                                    <div className="mt-0.5 text-teal-400 bg-teal-400/10 p-1 rounded-full"><Check size={12} strokeWidth={3} /></div>
                                                    <span className="text-sm text-slate-300">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Render Menu (Landing Page)
    const renderMenu = () => (
        <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4 relative animate-[fade-in_0.3s_ease-out]">
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-2xl text-teal-300 border border-teal-500/10">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-orange-50 font-['Quicksand']">{t('tab_resources')}</h2>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">{t('resource_subtitle')}</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-4">
                {/* Top 50 Card */}
                <button
                    onClick={() => setCurrentView('top50')}
                    className="group relative h-40 w-full overflow-hidden rounded-[2rem] border border-white/5 bg-slate-800/50 p-6 text-left transition-all hover:border-teal-500/30 hover:bg-slate-800"
                >
                    <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-teal-500/10 to-transparent" />
                    <div className="absolute bottom-[-20%] right-[-10%] opacity-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Star size={160} className="text-teal-400" fill="currentColor" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-teal-500/20 p-3 text-teal-300 backdrop-blur-sm">
                                <Star size={24} fill="currentColor" className="text-teal-400" />
                            </div>
                            <div className="rounded-full bg-white/5 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{t('tab_top50')}</h3>
                            <p className="text-sm text-slate-400">{t('top50_subtitle')}</p>
                        </div>
                    </div>
                </button>

                {/* Toys Card */}
                <button
                    onClick={() => setCurrentView('toys')}
                    className="group relative h-40 w-full overflow-hidden rounded-[2rem] border border-white/5 bg-slate-800/50 p-6 text-left transition-all hover:border-purple-500/30 hover:bg-slate-800"
                >
                    <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-purple-500/10 to-transparent" />
                    <div className="absolute bottom-[-10%] right-[-5%] opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12">
                        <Gamepad2 size={160} className="text-purple-400" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-purple-500/20 p-3 text-purple-300 backdrop-blur-sm">
                                <Gamepad2 size={24} />
                            </div>
                            <div className="rounded-full bg-white/5 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">{t('cat_toys')}</h3>
                            <p className="text-sm text-slate-400">{t('toys_subtitle')}</p>
                        </div>
                    </div>
                </button>

                {/* Books Card */}
                <button
                    onClick={() => setCurrentView('books')}
                    className="group relative h-32 w-full overflow-hidden rounded-[2rem] border border-white/5 bg-slate-800/50 p-6 text-left transition-all hover:border-blue-500/30 hover:bg-slate-800"
                >
                    <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-blue-500/10 to-transparent" />
                    <div className="absolute bottom-[-10%] right-[-5%] opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <BookOpen size={120} className="text-blue-400" />
                    </div>

                    <div className="relative z-10 flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between">
                            <div className="rounded-xl bg-blue-500/20 p-3 text-blue-300 backdrop-blur-sm">
                                <BookOpen size={24} />
                            </div>
                            <div className="rounded-full bg-white/5 p-2 text-slate-400 opacity-0 transition-all group-hover:opacity-100">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">{t('books_title')}</h3>
                            <p className="text-xs text-slate-400">{t('books_subtitle')}</p>
                        </div>
                    </div>
                </button>

                {/* Registry Card */}
                <button
                    onClick={() => setCurrentView('registry')}
                    className="group relative h-28 w-full overflow-hidden rounded-[2rem] border border-white/5 bg-slate-800/50 p-6 text-left transition-all hover:border-orange-500/30 hover:bg-slate-800"
                >
                    <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-orange-500/10 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between h-full">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-orange-500/20 p-3 text-orange-300 backdrop-blur-sm">
                                <Gift size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">{t('tab_registry')}</h3>
                                <p className="text-xs text-slate-400">{t('registry_subtitle')}</p>
                            </div>
                        </div>
                        <ChevronRight size={20} className="text-slate-500" />
                    </div>
                </button>

            </div>
        </div>
    );

    // Render Lists
    const renderList = () => (
        <div className="flex-1 overflow-y-auto pb-24 px-1 relative animate-[slide-in-right_0.2s_ease-out]">
            {/* Nav Header */}
            <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md px-4 py-4 mb-4 border-b border-white/5">
                <button
                    onClick={() => setCurrentView('menu')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                >
                    <ChevronLeft size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">
                        Menú
                    </span>
                </button>
                <h2 className="mt-2 text-xl font-bold text-white font-['Quicksand']">
                    {currentView === 'top50' ? t('tab_top50') : currentView === 'toys' ? t('cat_toys') : currentView === 'books' ? t('cat_books') : t('tab_registry')}
                </h2>
            </div>

            {currentView === 'top50' && (
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
            )}

            {currentView === 'toys' && (
                <div className="px-4 mb-6">
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

            {currentView === 'registry' ? (
                <div className="px-4">
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 rounded-[2rem] p-8 text-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                        <Gift size={64} className="mx-auto text-orange-500 mb-6 drop-shadow-sm" />

                        <h3 className="text-2xl font-bold text-orange-900 mb-2 font-['Quicksand']">{t('registry_hero_title')}</h3>
                        <p className="text-orange-800 text-lg mb-6 font-medium">{t('registry_hero_subtitle')}</p>

                        <p className="text-orange-900/70 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                            {t('registry_hero_desc')}
                        </p>

                        <div className="space-y-4 mb-8 text-left max-w-xs mx-auto">
                            {[t('registry_bullet_1'), t('registry_bullet_2'), t('registry_bullet_3')].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="p-1 rounded-full bg-orange-500/20 text-orange-600"><Check size={12} strokeWidth={3} /></div>
                                    <span className="text-sm text-orange-900/80 font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <a
                            href="https://www.amazon.es/gp/baby/homepage?tag=100bcb-21"
                            target="_blank"
                            className="flex items-center justify-center gap-2 w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all active:scale-95"
                        >
                            {t('amazon_banner_cta')}
                            <ExternalLink size={18} />
                        </a>
                    </div>
                </div>
            ) : (
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
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    {t(`cat_${product.category.toLowerCase()}` as any) || product.category}
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
                                        {t('see_details')} <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <>
            {currentView === 'menu' ? renderMenu() : renderList()}
            {renderProductDetail()}
        </>
    );
};
