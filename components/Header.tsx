
import React from 'react';
import { Settings, WifiOff, Baby, Heart, BarChart2 } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface HeaderProps {
    onOpenSettings: () => void;
    onOpenSupport: () => void;
    onOpenStats: () => void;
    onGoToStory: () => void;
    isOffline: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenSupport, onOpenStats, onGoToStory, isOffline }) => {
    const { t } = useLanguage();

    return (
        <header className="shrink-0 w-full flex items-center justify-between mb-2 p-4 pt-safe bg-slate-900/60 backdrop-blur-md border-b border-white/5 rounded-b-[2.5rem] shadow-lg">
            <button
                onClick={onGoToStory}
                className="flex items-center gap-3 group text-left"
            >
                <div className="relative group-hover:scale-105 transition-transform duration-300">
                    <img
                        src="/icons/icon-192.png"
                        alt="Nanapp Logo"
                        className="w-11 h-11 rounded-xl shadow-sm border border-orange-200/10"
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-orange-50 leading-none mb-1 font-['Quicksand']">
                        nanapp
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] text-orange-200/70 font-medium tracking-widest uppercase opacity-90 group-hover:text-orange-100 transition-colors">{t('app_slogan')}</p>
                        {isOffline && <WifiOff size={10} className="text-red-400" />}
                    </div>
                </div>
            </button>

            <div className="flex items-center gap-2">
                <button onClick={onOpenStats} className="p-2 rounded-full bg-slate-950/50 text-orange-100/70 hover:text-white transition-colors border border-orange-100/5 hover:bg-slate-800">
                    <BarChart2 size={18} />
                </button>
                <button onClick={onOpenSupport} className="p-2 rounded-full bg-slate-950/50 text-orange-100/70 hover:text-white transition-colors border border-orange-100/5 hover:bg-slate-800">
                    <Heart size={18} />
                </button>
                <button onClick={onOpenSettings} className="p-2 rounded-full bg-slate-950/50 text-orange-100/70 hover:text-white transition-colors border border-orange-100/5 hover:bg-slate-800">
                    <Settings size={18} />
                </button>
            </div>
        </header>
    );
};
