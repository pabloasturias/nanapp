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
    <div className="w-full bg-slate-950 border-t border-white/5 pb-[env(safe-area-inset-bottom)] relative z-20">
      <div className="flex justify-around items-center h-16 px-4">
        
        {/* HOME */}
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'home' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Home size={26} strokeWidth={activeTab === 'home' ? 2.5 : 2} className={activeTab === 'home' ? 'drop-shadow-lg scale-110 transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_home')}</span>
        </button>

        {/* AUDIO */}
        <button
          onClick={() => setActiveTab('audio')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'audio' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Music size={26} strokeWidth={activeTab === 'audio' ? 2.5 : 2} className={activeTab === 'audio' ? 'drop-shadow-lg scale-110 transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_audio')}</span>
        </button>

        {/* TOOLS */}
        <button
          onClick={() => setActiveTab('routine')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'routine' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Wrench size={24} strokeWidth={activeTab === 'routine' ? 2.5 : 2} className={activeTab === 'routine' ? 'drop-shadow-lg scale-110 transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_routine')}</span>
        </button>

        {/* DISCOVER */}
        <button
          onClick={() => setActiveTab('discover')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'discover' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Compass size={26} strokeWidth={activeTab === 'discover' ? 2.5 : 2} className={activeTab === 'discover' ? 'drop-shadow-lg scale-110 transition-transform' : 'transition-transform'} />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_discover')}</span>
        </button>

      </div>
    </div>
  );
};
