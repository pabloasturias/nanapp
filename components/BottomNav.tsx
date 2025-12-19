import React from 'react';
import { Music, Moon, BookOpen, Hammer, Wrench } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface BottomNavProps {
  activeTab: 'sounds' | 'sleep' | 'tips' | 'story' | 'stats' | 'tools';
  setActiveTab: (tab: 'sounds' | 'sleep' | 'tips' | 'story' | 'stats' | 'tools') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-lg w-full z-50 bg-slate-900/95 backdrop-blur-lg border-t border-orange-100/5 rounded-t-[2rem] pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around items-center h-20">
        <button
          onClick={() => setActiveTab('sounds')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'sounds' || activeTab === 'story' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Music size={26} strokeWidth={activeTab === 'sounds' ? 2.5 : 2} className={activeTab === 'sounds' ? 'drop-shadow-lg' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_sounds')}</span>
        </button>

        <button
          onClick={() => setActiveTab('tools')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'tools' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <div className="relative w-[26px] h-[26px] flex items-center justify-center">
            <Hammer size={18} className={`absolute ${activeTab === 'tools' ? 'drop-shadow-lg' : ''} -rotate-45 -translate-x-1 text-current`} strokeWidth={activeTab === 'tools' ? 2.5 : 2} />
            <Wrench size={18} className={`absolute ${activeTab === 'tools' ? 'drop-shadow-lg' : ''} rotate-45 translate-x-1 text-current`} strokeWidth={activeTab === 'tools' ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_tools')}</span>
        </button>

        <button
          onClick={() => setActiveTab('sleep')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'sleep' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Moon size={26} strokeWidth={activeTab === 'sleep' ? 2.5 : 2} className={activeTab === 'sleep' ? 'drop-shadow-lg' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wide">{t('tab_sleep')}</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${activeTab === 'tips' ? 'text-orange-300' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <BookOpen size={26} strokeWidth={activeTab === 'tips' ? 2.5 : 2} className={activeTab === 'tips' ? 'drop-shadow-lg' : ''} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Recursos</span>
        </button>
      </div>
    </div>
  );
};
