import React, { useState } from 'react';
import { useLanguage } from '../services/LanguageContext';
import { 
    BookOpen, ShieldCheck, Baby, Trophy, ChevronRight, 
    Sparkles, Info, X, SlidersHorizontal 
} from 'lucide-react';
import { EndocrineDashboard, EndocrineFull } from './tools/EndocrineWidget';
import { ToolId } from './tools/types';

export const AcademyView: React.FC<{ onOpenSettings: () => void }> = ({ onOpenSettings }) => {
    const { t } = useLanguage();
    const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

    const handleOpenGuide = (id: string) => {
        setSelectedGuideId(id);
        window.history.pushState({ tab: 'academy', guideId: id }, '');
    };

    const handleCloseGuide = () => {
        if (window.history.state?.guideId) {
            window.history.back();
        } else {
            setSelectedGuideId(null);
        }
    };

    // Handle Browser Back Button for internal guides
    React.useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            const state = event.state;
            if (state && state.guideId) {
                setSelectedGuideId(state.guideId);
            } else {
                setSelectedGuideId(null);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const renderGuideContent = (id: string) => {
        switch (id) {
            case 'endocrine_info': return <EndocrineFull onClose={handleCloseGuide} />;
            default: return (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full opacity-60">
                    <p className="text-slate-400 text-lg mb-2">Próximamente...</p>
                    <p className="text-xs text-slate-600 max-w-[200px] leading-relaxed">Esta guía estará disponible pronto en la versión Pro.</p>
                </div>
            );
        }
    };

    return (
        <div className="flex-1 pb-8 px-1 relative animate-[fade-in_0.5s_ease-out]">
            
            {/* Guide Detail Modal */}
            {selectedGuideId && (
                <div className="fixed inset-0 z-[60] bg-slate-950 animate-[slide-up_0.2s_ease-out] flex flex-col">
                    <div className="p-4 flex items-center gap-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md">
                        <button onClick={handleCloseGuide} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
                            <ChevronRight className="rotate-180" size={24} />
                        </button>
                        <h2 className="text-lg font-bold text-white flex-1 text-center pr-8">
                            {selectedGuideId === 'endocrine_info' ? t('tool_endocrine_info') : t('tab_academy')}
                        </h2>
                    </div>
                    <div className="flex-1 overflow-hidden">
                        {renderGuideContent(selectedGuideId)}
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="px-4 pt-4 mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/10">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white font-['Quicksand']">{t('tab_academy')}</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pequeña Sabiduría</p>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-6">
                
                {/* Special Tools (moved from ToolsView) */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Guías Especiales</h3>
                    <div 
                        onClick={() => handleOpenGuide('endocrine_info')}
                        className="bg-slate-900 border border-emerald-500/20 rounded-[2rem] p-5 flex items-center gap-4 hover:bg-slate-800 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-emerald-500/10 blur-2xl" />
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-white">{t('tool_endocrine_info')}</h3>
                            <p className="text-[10px] text-slate-400">{t('tool_endocrine_subtitle')}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate-600" />
                    </div>
                </div>

                {/* Standard Guides */}
                <div className="space-y-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Biblioteca de Padres</h3>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            { id: 'pediatric', title: 'pediatric_guide_title', sub: 'pediatric_guide_subtitle', color: 'from-blue-500/20 to-indigo-500/20', icon: ShieldCheck },
                            { id: 'feeding', title: 'feeding_guide_title', sub: 'feeding_guide_subtitle', color: 'from-pink-500/20 to-rose-500/20', icon: Baby },
                            { id: 'development', title: 'development_guide_title', sub: 'development_guide_subtitle', color: 'from-yellow-500/20 to-orange-500/20', icon: Trophy }
                        ].map((guide, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleOpenGuide(guide.id)}
                                className={`p-5 rounded-[2rem] bg-gradient-to-br ${guide.color} border border-white/5 flex items-center gap-4 hover:scale-[1.01] transition-all cursor-pointer`}
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/60">
                                    <guide.icon size={24} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm font-bold text-white">{t(guide.title as any)}</h3>
                                    <p className="text-[10px] text-slate-400">{t(guide.sub as any)}</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-600" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Inspiration Card */}
                <div className="p-6 rounded-[2.5rem] bg-indigo-600 text-white relative overflow-hidden mt-8 shadow-xl shadow-indigo-900/20">
                    <div className="relative z-10">
                        <Sparkles className="mb-3 text-indigo-200" size={24} />
                        <h3 className="text-lg font-bold mb-1">El conocimiento es paz</h3>
                        <p className="text-xs text-indigo-100/80 leading-relaxed">
                            Aprende sobre el desarrollo de tu bebé para entender sus necesidades y disfrutar más de cada etapa.
                        </p>
                    </div>
                    <BookOpen className="absolute -right-8 -bottom-8 text-white/10" size={160} />
                </div>
            </div>
        </div>
    );
};
