import React from 'react';
import { Home, Music, Wrench, Compass, BookOpen } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface BottomNavProps {
  activeTab: 'audio' | 'tools' | 'academy' | 'discover';
  setActiveTab: (tab: 'audio' | 'tools' | 'academy' | 'discover') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-slate-950 pb-[max(16px,env(safe-area-inset-bottom))] pt-2 px-4 shrink-0 relative z-30">
      <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl h-16 flex justify-around items-center px-2 shadow-2xl max-w-md mx-auto">
        {/* AUDIO / SOUNDS */}
        <button
          onClick={() => setActiveTab('audio')}
          className={`relative flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'audio' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === 'audio' && <div className="absolute -top-3 w-8 h-1 bg-orange-400 rounded-b-full shadow-[0_2px_10px_rgba(251,146,60,0.8)]" />}
          <Music size={22} strokeWidth={activeTab === 'audio' ? 2.5 : 2} className={activeTab === 'audio' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_sounds')}</span>
        </button>

        {/* TOOLS */}
        <button
          onClick={() => setActiveTab('tools')}
          className={`relative flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'tools' ? 'text-teal-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === 'tools' && <div className="absolute -top-3 w-8 h-1 bg-teal-400 rounded-b-full shadow-[0_2px_10px_rgba(45,212,191,0.8)]" />}
          <Wrench size={20} strokeWidth={activeTab === 'tools' ? 2.5 : 2} className={activeTab === 'tools' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_tools')}</span>
        </button>

        {/* ACADEMY */}
        <button
          onClick={() => setActiveTab('academy')}
          className={`relative flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'academy' ? 'text-indigo-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === 'academy' && <div className="absolute -top-3 w-8 h-1 bg-indigo-400 rounded-b-full shadow-[0_2px_10px_rgba(129,140,248,0.8)]" />}
          <BookOpen size={20} strokeWidth={activeTab === 'academy' ? 2.5 : 2} className={activeTab === 'academy' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_academy')}</span>
        </button>

        {/* DISCOVER */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`relative flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'discover' ? 'text-pink-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          {activeTab === 'discover' && <div className="absolute -top-3 w-8 h-1 bg-pink-400 rounded-b-full shadow-[0_2px_10px_rgba(244,114,182,0.8)]" />}
          <Compass size={22} strokeWidth={activeTab === 'discover' ? 2.5 : 2} className={activeTab === 'discover' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_discover')}</span>
        </button>

      </div>
    </div>
  );
};
