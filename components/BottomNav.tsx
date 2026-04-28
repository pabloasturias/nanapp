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
    <div className="fixed bottom-6 left-6 right-6 mx-auto max-w-[400px] z-50">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex justify-around items-center h-16 px-2">
        
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
