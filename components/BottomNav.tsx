
import React from 'react';
import { Music, Moon, Sparkles, BarChart2 } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface BottomNavProps {
  activeTab: 'sounds' | 'sleep' | 'tips' | 'story' | 'stats';
  setActiveTab: (tab: 'sounds' | 'sleep' | 'tips' | 'story' | 'stats') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  return (
    <div className="fixed bottom-6 left-4 right-4 mx-auto max-w-sm w-full z-50 glass-nav rounded-2xl border border-white/10 shadow-2xl pb-0">
      <div className="flex justify-around items-center h-16 px-2">
        <button
          onClick={() => setActiveTab('sounds')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center rounded-xl transition-all duration-300 ${activeTab === 'sounds' || activeTab === 'story' ? 'text-orange-300 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
        >
          <Music size={22} strokeWidth={activeTab === 'sounds' ? 2.5 : 2} className={activeTab === 'sounds' ? 'drop-shadow-lg scale-110 transition-transform' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{t('tab_sounds')}</span>
        </button>

        <button
          onClick={() => setActiveTab('sleep')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center rounded-xl transition-all duration-300 ${activeTab === 'sleep' ? 'text-orange-300 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
        >
          <Moon size={22} strokeWidth={activeTab === 'sleep' ? 2.5 : 2} className={activeTab === 'sleep' ? 'drop-shadow-lg scale-110 transition-transform' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{t('tab_sleep')}</span>
        </button>

        <button
          onClick={() => setActiveTab('stats')}
          className={`flex flex-col items-center gap-1 w-full h-full justify-center rounded-xl transition-all duration-300 ${activeTab === 'stats' ? 'text-orange-300 bg-white/5' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
        >
          <BarChart2 size={22} strokeWidth={activeTab === 'stats' ? 2.5 : 2} className={activeTab === 'stats' ? 'drop-shadow-lg scale-110 transition-transform' : ''} />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">{t('tab_stats')}</span>
        </button>
      </div>
    </div>
  );
};
