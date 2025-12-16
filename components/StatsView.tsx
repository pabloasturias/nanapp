import React from 'react';
import { useStatistics, Statistics } from '../services/hooks/useStatistics';
import { useLanguage } from '../services/LanguageContext';
import { BarChart2, Clock, Play, Trophy } from 'lucide-react';
import { SOUNDS } from '../constants';

export const StatsView: React.FC = () => {
    const { stats } = useStatistics();
    const { t } = useLanguage();

    const getSoundName = (id: string | null) => {
        if (!id) return '-';
        return t(id as any);
    };

    const getSoundIcon = (id: string | null) => {
        if (!id) return null;
        const sound = SOUNDS.find(s => s.id === id);
        return sound ? sound.Icon : null;
    }

    const FavIcon = getSoundIcon(stats.mostUsedSound);

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white overflow-y-auto pb-24">
            {/* Header */}
            <div className="p-6 pt-12 pb-2">
                <h1 className="text-3xl font-bold text-orange-50 mb-1">{t('tab_stats')}</h1>
                <p className="text-slate-400 text-sm">{t('stats_subtitle')}</p>
            </div>

            <div className="p-6 space-y-4">

                {/* Total Play Time Card */}
                <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-orange-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Clock size={100} className="text-orange-500" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{t('stats_total_time')}</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-white">{Math.floor(stats.totalPlayTimeMinutes / 60)}</span>
                            <span className="text-sm text-slate-400">h</span>
                            <span className="text-4xl font-bold text-white">{stats.totalPlayTimeMinutes % 60}</span>
                            <span className="text-sm text-slate-400">m</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Total Sessions */}
                    <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-blue-500/10">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 mb-3">
                            <Play size={20} fill="currentColor" />
                        </div>
                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t('stats_sessions')}</h3>
                        <p className="text-2xl font-bold text-white mt-1">{stats.totalSessions}</p>
                    </div>

                    {/* Favorite Sound */}
                    <div className="bg-slate-800/50 p-5 rounded-[2rem] border border-pink-500/10">
                        <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300 mb-3">
                            {FavIcon ? <FavIcon size={20} /> : <Trophy size={20} />}
                        </div>
                        <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t('stats_favorite')}</h3>
                        <p className="text-sm font-bold text-white mt-1 leading-tight line-clamp-2">
                            {getSoundName(stats.mostUsedSound)}
                        </p>
                    </div>
                </div>

                {/* Motivation / Tip */}
                <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 p-6 rounded-[2rem] border border-indigo-500/10 mt-4">
                    <p className="text-indigo-200 text-sm font-medium italic">
                        "{t('stats_praise')}"
                    </p>
                </div>

            </div>
        </div>
    );
};
