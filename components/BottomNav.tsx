import React from 'react';
import { Home, Music, Wrench, Compass } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface BottomNavProps {
  activeTab: 'home' | 'audio' | 'routine' | 'discover';
  setActiveTab: (tab: 'home' | 'audio' | 'routine' | 'discover') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="w-full bg-slate-950">
      <div className="bg-slate-900 border border-white/5 rounded-[2.2rem] h-16 flex justify-around items-center px-4 shadow-xl">
        
        {/* HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'home' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} className={activeTab === 'home' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_home')}</span>
        </button>

        {/* AUDIO */}
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'audio' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Music size={22} strokeWidth={activeTab === 'audio' ? 2.5 : 2} className={activeTab === 'audio' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_audio')}</span>
        </button>

        {/* TOOLS */}
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'routine' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Wrench size={20} strokeWidth={activeTab === 'routine' ? 2.5 : 2} className={activeTab === 'routine' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_routine')}</span>
        </button>

        {/* DISCOVER */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center transition-all ${activeTab === 'discover' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Compass size={22} strokeWidth={activeTab === 'discover' ? 2.5 : 2} className={activeTab === 'discover' ? 'drop-shadow-lg scale-110' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider">{t('tab_discover')}</span>
        </button>

      </div>
    </div>
  );
};
