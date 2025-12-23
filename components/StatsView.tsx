import React, { useMemo } from 'react';
import { useStatistics } from '../services/hooks/useStatistics';
import { useLanguage } from '../services/LanguageContext';
import { useToolData } from '../services/hooks/useToolData';
import { ArrowLeft, Clock, Play, Trophy, Activity, Moon, GlassWater, Ruler, Layers } from 'lucide-react';
import { SOUNDS } from '../constants';
import { BottleLog, SleepLog, DiaperLog, GrowthLog } from './tools/types';

interface StatsViewProps {
    onBack: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onBack }) => {
    const { stats } = useStatistics();
    const { t } = useLanguage();

    // --- Tools Data ---
    const { logs: bottleLogs } = useToolData<BottleLog>('bottle');
    const { logs: sleepLogs } = useToolData<SleepLog>('sleep');
    const { logs: diaperLogs } = useToolData<DiaperLog>('diapers');
    const { logs: growthLogs } = useToolData<GrowthLog>('growth');

    // --- Calculations ---

    const todayStats = useMemo(() => {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // Bottle (Milk Only)
        const milkVol = bottleLogs
            .filter(l => l.timestamp >= startOfDay && l.type !== 'water')
            .reduce((sum, l) => sum + (l.amount || 0), 0);

        // Sleep
        const sleepMinutes = sleepLogs
            .filter(l => l.timestamp >= startOfDay)
            .reduce((sum, l) => {
                const duration = l.durationMinutes || (l.endTime ? (l.endTime - l.timestamp) / 60000 : 0);
                return sum + duration;
            }, 0);

        // Diapers
        const wetCount = diaperLogs.filter(l => l.timestamp >= startOfDay && (l.type === 'wet' || l.type === 'mixed')).length;
        const dirtyCount = diaperLogs.filter(l => l.timestamp >= startOfDay && (l.type === 'dirty' || l.type === 'mixed')).length;

        return { milkVol, sleepMinutes, wetCount, dirtyCount };
    }, [bottleLogs, sleepLogs, diaperLogs]);

    const latestGrowth = useMemo(() => growthLogs.length > 0 ? growthLogs[0] : null, [growthLogs]);

    // --- Helpers ---

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
    const chartHeight = [40, 65, 30, 85, 50, 95, 60]; // Static visual for now

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white overflow-y-auto pb-24 absolute inset-0 z-20 animate-[slide-left_0.3s_ease-out]">
            {/* Header with Back Button */}
            <div className="p-6 pt-12 pb-2 flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-orange-50 leading-none">Dashboard</h1>
                    <p className="text-slate-400 text-xs">Resumen de actividad</p>
                </div>
            </div>

            <div className="p-6 space-y-6">

                {/* --- DAILY SUMMARY ROW --- */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        Resumen de Hoy
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Sleep Card */}
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-2xl flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
                                    <Moon size={18} />
                                </div>
                                <span className="text-xs font-bold text-indigo-200 uppercase opacity-60">Sueño</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white">{Math.floor(todayStats.sleepMinutes / 60)}</span>
                                <span className="text-xs text-indigo-300 ml-1">h</span>
                                <span className="text-lg font-bold text-white ml-2">{Math.round(todayStats.sleepMinutes % 60)}</span>
                                <span className="text-xs text-indigo-300 ml-1">m</span>
                            </div>
                        </div>

                        {/* Bottle Card */}
                        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-blue-500/20 rounded-xl text-blue-300">
                                    <GlassWater size={18} />
                                </div>
                                <span className="text-xs font-bold text-blue-200 uppercase opacity-60">Leche</span>
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white">{todayStats.milkVol}</span>
                                <span className="text-xs text-blue-300 ml-1">ml</span>
                            </div>
                        </div>

                        {/* Diapers Card */}
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-amber-500/20 rounded-xl text-amber-300">
                                    <Layers size={18} />
                                </div>
                                <span className="text-xs font-bold text-amber-200 uppercase opacity-60">Pañales</span>
                            </div>
                            <div className="flex gap-4 text-sm font-bold">
                                <div className="text-amber-100"><span className="text-lg">{todayStats.wetCount}</span> 💧</div>
                                <div className="text-amber-100"><span className="text-lg">{todayStats.dirtyCount}</span> 💩</div>
                            </div>
                        </div>

                        {/* Growth Card */}
                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2">
                                <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-300">
                                    <Ruler size={18} />
                                </div>
                                <span className="text-xs font-bold text-emerald-200 uppercase opacity-60">Medidas</span>
                            </div>
                            <div>
                                {latestGrowth ? (
                                    <>
                                        <div className="text-lg font-bold text-white">{latestGrowth.weightKg} <span className="text-xs text-emerald-300">kg</span></div>
                                        <div className="text-sm text-emerald-200/70">{latestGrowth.heightCm} cm</div>
                                    </>
                                ) : (
                                    <span className="text-xs text-emerald-500 italic">Sin datos</span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>


                {/* --- AUDIO STATS --- */}
                <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        Sonidos y Relajación
                    </h3>

                    {/* Main Dashboard Card */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-xl mb-4">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t('stats_total_time')}</h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold text-white tracking-tighter">{Math.floor(stats.totalPlayTimeMinutes / 60)}</span>
                                    <span className="text-sm text-slate-400">h</span>
                                    <span className="text-5xl font-bold text-white tracking-tighter">{stats.totalPlayTimeMinutes % 60}</span>
                                    <span className="text-sm text-slate-400">m</span>
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                                <Activity size={24} />
                            </div>
                        </div>

                        {/* Visual Chart */}
                        <div className="flex items-end justify-between gap-2 h-24 mt-4 border-b border-white/5 pb-2">
                            {chartHeight.map((h, i) => (
                                <div key={i} className="w-full bg-slate-700/30 rounded-t-sm relative group">
                                    <div
                                        className="absolute bottom-0 left-0 right-0 bg-indigo-500/50 rounded-t-sm group-hover:bg-indigo-400 transition-colors"
                                        style={{ height: `${h}%` }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                            <span>L</span>
                            <span>M</span>
                            <span>X</span>
                            <span>J</span>
                            <span>V</span>
                            <span>S</span>
                            <span>D</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Total Sessions */}
                        <div className="bg-slate-800/40 p-5 rounded-[2rem] border border-white/5 hover:bg-slate-800/60 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 mb-3">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{t('stats_sessions')}</h3>
                            <p className="text-2xl font-bold text-white mt-1">{stats.totalSessions}</p>
                        </div>

                        {/* Favorite Sound */}
                        <div className="bg-slate-800/40 p-5 rounded-[2rem] border border-white/5 hover:bg-slate-800/60 transition-colors">
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
                    <div className="p-6 rounded-[2rem] bg-slate-800/30 border border-white/5 flex gap-4 items-center">
                        <div className="shrink-0 p-2 bg-amber-500/10 rounded-full text-amber-400">
                            <Clock size={20} />
                        </div>
                        <p className="text-slate-300 text-xs font-medium italic leading-relaxed">
                            "{t('stats_praise')}"
                        </p>
                    </div>
                </section>

            </div>
        </div>
    );
};
