import React from 'react';
import { Heart, Music, Sparkles, BookOpen, ArrowLeft, Star, ShieldCheck, Users, Baby } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface StoryViewProps {
    onBack: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ onBack }) => {
    const { t } = useLanguage();
    return (
        <div className="flex-1 overflow-y-auto pb-24 px-1 animate-[fade-in_0.5s_ease-out]">

            {/* Back Button */}
            <button
                onClick={onBack}
                className="mb-4 flex items-center gap-2 text-slate-400 hover:text-orange-200 transition-colors pl-4 pt-4"
            >
                <ArrowLeft size={18} />
                <span className="text-sm font-bold uppercase tracking-wide">{t('back')}</span>
            </button>

            <div className="space-y-8 px-2">

                {/* Hero Section */}
                <div className="relative bg-slate-900/40 rounded-[2.5rem] p-8 border border-orange-100/5 overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="p-4 bg-orange-400/10 rounded-full border border-orange-200/20 mb-6 shadow-[0_0_30px_rgba(251,146,60,0.1)]">
                            <Baby size={40} className="text-orange-200" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-orange-50 font-['Quicksand'] mb-2">{t('story_nana')}</h2>
                        <p className="text-sm text-orange-200/60 uppercase tracking-[0.2em] font-bold">El arte de cuidar</p>
                    </div>
                </div>

                {/* Dedication Section (Merged from AboutModal) */}
                <div className="px-4">
                    <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 p-6 rounded-[2rem] border border-indigo-500/10 relative overflow-hidden">
                        <Heart size={80} className="absolute -top-4 -right-4 text-pink-500/5 rotate-12" />

                        <h3 className="text-xl font-bold text-indigo-100 mb-6 font-serif italic relative z-10">Dedicado a...</h3>

                        <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-light relative z-10">
                            <p>
                                En profundo agradecimiento a las madres y abuelas llenas de paciencia que cuidaron de nosotros. Porque la paciencia es una virtud que, muchas veces, viene en frasco de mujer.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features / Philosophy Section */}
                <div className="px-4 space-y-10 uppercase-headings">
                    <div className="flex gap-5">
                        <div className="shrink-0 mt-1 text-orange-300 opacity-80"><Music size={24} /></div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-50 mb-3 font-['Quicksand']">{t('story_more_title')}</h3>
                            <p className="text-slate-300 leading-relaxed text-base font-light">{t('story_more_desc')}</p>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="shrink-0 mt-1 text-rose-300 opacity-80"><BookOpen size={24} /></div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-50 mb-3 font-['Quicksand']">{t('story_leg_title')}</h3>
                            <p className="text-slate-300 leading-relaxed text-base font-light">{t('story_leg_desc')}</p>
                        </div>
                    </div>

                    <div className="flex gap-5">
                        <div className="shrink-0 mt-1 text-emerald-300 opacity-80"><ShieldCheck size={24} /></div>
                        <div>
                            <h3 className="text-xl font-bold text-orange-50 mb-3 font-['Quicksand']">{t('story_promise_title')}</h3>
                            <p className="text-slate-300 leading-relaxed text-base font-light">{t('story_promise_desc')}</p>
                        </div>
                    </div>

                    <div className="bg-slate-800/30 rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Users size={20} className="text-indigo-200" />
                                <h3 className="text-lg font-bold text-orange-50 font-['Quicksand']">{t('story_community_title')}</h3>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-4">
                                {t('story_why_desc')}
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed font-medium">{t('story_community_desc')}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Quote */}
                <div className="text-center pt-8 pb-4 space-y-4">
                    <p className="font-['Quicksand'] text-sm text-orange-100 italic opacity-60 px-8">"{t('story_quote')}"</p>
                    <div className="flex justify-center">
                        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-slate-900 border border-white/5">
                            <Star size={10} className="text-amber-500/50" />
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-700 font-mono">v1.0.2 · Asturias, Spain</p>
                </div>
            </div>
        </div>
    );
};