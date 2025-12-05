import React from 'react';
import { Heart, Music, Sparkles, BookOpen, ArrowLeft, Star } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface StoryViewProps {
    onBack: () => void;
}

export const StoryView: React.FC<StoryViewProps> = ({ onBack }) => {
  const { t } = useLanguage();
  return (
    <div className="flex-1 overflow-y-auto pb-24 px-1 animate-[fade-in_0.5s_ease-out]">
        
        {/* Navigation */}
        <button 
            onClick={onBack}
            className="mb-6 flex items-center gap-2 text-slate-400 hover:text-orange-200 transition-colors pl-2"
        >
            <ArrowLeft size={18} />
            <span className="text-sm font-bold uppercase tracking-wide">{t('back')}</span>
        </button>

        <div className="space-y-8">
            
            {/* Hero Section */}
            <div className="relative bg-slate-900/40 rounded-[2.5rem] p-8 border border-orange-100/5 overflow-hidden text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                    <div className="p-4 bg-orange-400/10 rounded-full border border-orange-200/20 mb-6 shadow-[0_0_30px_rgba(251,146,60,0.1)]">
                        <Heart size={40} className="text-orange-200" fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <h2 className="text-3xl font-bold text-orange-50 font-['Quicksand'] mb-2">{t('story_nana')}</h2>
                    <p className="text-sm text-orange-200/60 uppercase tracking-[0.2em] font-bold">{t('story_origin')}</p>
                </div>
            </div>

            {/* The Story Content */}
            <div className="px-4 space-y-8">
                
                <div className="flex gap-5">
                    <div className="shrink-0 mt-1 text-orange-300 opacity-80">
                        <Music size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-orange-50 mb-3">{t('story_more_title')}</h3>
                        <p className="text-slate-300 leading-relaxed text-lg font-light">
                            {t('story_more_desc')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-5">
                    <div className="shrink-0 mt-1 text-rose-300 opacity-80">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-orange-50 mb-3">{t('story_leg_title')}</h3>
                        <p className="text-slate-300 leading-relaxed text-lg font-light">
                            {t('story_leg_desc')}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800/30 rounded-3xl p-6 border border-white/5">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles size={20} className="text-amber-200" />
                        <h3 className="text-lg font-bold text-orange-50">{t('story_why_title')}</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {t('story_why_desc')}
                    </p>
                    <p className="text-slate-400 text-sm leading-relaxed mt-4 font-medium">
                        {t('story_why_desc2')}
                    </p>
                </div>

            </div>

            {/* Signature / Dedication (Vega's Wink) */}
            <div className="text-center pt-8 pb-4 space-y-4">
                <p className="font-['Quicksand'] text-sm text-orange-100 italic opacity-60">"{t('story_quote')}"</p>
                
                <div className="flex justify-center">
                    <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/10">
                        <p className="text-[10px] text-indigo-200 uppercase tracking-widest font-bold">{t('inspired_by')}</p>
                        {/* Vega Star Icon */}
                        <div className="relative">
                            <Star size={12} className="text-amber-200 fill-amber-200 animate-pulse" />
                            <div className="absolute inset-0 bg-amber-200 blur-sm opacity-50 animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};