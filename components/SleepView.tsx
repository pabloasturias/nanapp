
import React from 'react';
import { Moon, Thermometer, ShieldCheck, TrendingUp, Smile, Clock, Zap, Sun, Brain, AlertCircle, Shirt, Stethoscope, Activity, Shield, Ghost, ZapOff, HeartHandshake, Cat, Package, Hand, Milk, Utensils, Layers } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

export const SleepView: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="flex-1 overflow-y-auto pb-24 px-1">
            <div className="space-y-6 animate-[fade-in_0.5s_ease-out]">

                {/* Header */}
                <div className="flex items-center gap-4 mb-2 px-2 pt-2">
                    <div className="p-3 bg-indigo-500/20 rounded-2xl text-indigo-300">
                        <Moon size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-orange-50">{t('sleep_title')}</h2>
                        <p className="text-sm text-slate-400">{t('sleep_subtitle')}</p>
                    </div>
                </div>

                {/* 1. BENEFITS */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-amber-500/10 rounded-xl text-amber-300">
                            <TrendingUp size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-orange-50">{t('benefits_title')}</h2>
                    </div>
                    <div className="space-y-5">
                        <div className="flex gap-4">
                            <div className="mt-1 text-purple-300 shrink-0"><Brain size={22} /></div>
                            <div>
                                <h3 className="text-orange-50 font-bold mb-1">{t('ben_brain_title')}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">{t('ben_brain_desc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 text-yellow-300 shrink-0"><Smile size={22} /></div>
                            <div>
                                <h3 className="text-orange-50 font-bold mb-1">{t('ben_mood_title')}</h3>
                                <p className="text-sm text-slate-300 leading-relaxed">{t('ben_mood_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. FUNDAMENTALS (Environment & Biology) */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-300">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-orange-50">{t('env_title')}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-800/50 rounded-2xl flex flex-col items-center text-center gap-2">
                            <Thermometer className="text-rose-300" size={24} />
                            <h4 className="text-orange-50 font-bold text-sm">{t('temp_range')}</h4>
                            <p className="text-[10px] text-slate-400">{t('env_temp')}</p>
                        </div>
                        <div className="p-4 bg-slate-800/50 rounded-2xl flex flex-col items-center text-center gap-2">
                            <Moon className="text-indigo-300" size={24} />
                            <h4 className="text-orange-50 font-bold text-sm">{t('env_dark')}</h4>
                            <p className="text-[10px] text-slate-400">{t('env_dark_desc')}</p>
                        </div>
                    </div>
                    <div className="mt-4 p-4 rounded-2xl bg-slate-800/30 border border-slate-700/50">
                        <div className="flex gap-2 items-center mb-1">
                            <ShieldCheck size={16} className="text-emerald-400" />
                            <span className="text-sm font-bold text-slate-200">{t('env_abc')}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed">{t('env_abc_desc')}</p>
                    </div>
                </div>

                {/* TOG CHART */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-teal-500/10 rounded-xl text-teal-300">
                            <Shirt size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-orange-50">{t('tog_title')}</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('tog_desc')}</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-blue-900/20 rounded-xl border-l-4 border-blue-400">
                            <p className="text-xs text-blue-200 font-bold">{t('tog_cold')}</p>
                        </div>
                        <div className="p-3 bg-green-900/20 rounded-xl border-l-4 border-green-400">
                            <p className="text-xs text-green-200 font-bold">{t('tog_ideal')}</p>
                        </div>
                        <div className="p-3 bg-red-900/20 rounded-xl border-l-4 border-red-400">
                            <p className="text-xs text-red-200 font-bold">{t('tog_hot')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4">
                    <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 flex gap-4">
                        <div className="mt-1 text-orange-400 shrink-0"><Sun size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('bio_daynight_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed mb-2">{t('bio_daynight_desc')}</p>
                            <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                <li>{t('bio_day')}</li>
                                <li>{t('bio_night')}</li>
                            </ul>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 flex gap-4">
                        <div className="mt-1 text-amber-300 shrink-0"><Zap size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('bio_cycle_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('bio_cycle_desc')}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 flex gap-4">
                        <div className="mt-1 text-lime-300 shrink-0"><Activity size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('bio_tummy_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('bio_tummy_desc')}</p>
                        </div>
                    </div>
                </div>

                {/* 3. WAKE WINDOWS */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-300">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-orange-50">{t('windows_title')}</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('windows_subtitle')}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-800/50 p-3 rounded-xl text-slate-300 font-medium">0 - 1 Mes</div>
                            <div className="bg-slate-800/80 p-3 rounded-xl text-orange-200 font-bold text-right">{t('win_0_1')}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-800/50 p-3 rounded-xl text-slate-300 font-medium">2 - 3 Meses</div>
                            <div className="bg-slate-800/80 p-3 rounded-xl text-orange-200 font-bold text-right">{t('win_2_3')}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-800/50 p-3 rounded-xl text-slate-300 font-medium">4 - 6 Meses</div>
                            <div className="bg-slate-800/80 p-3 rounded-xl text-orange-200 font-bold text-right">{t('win_4_6')}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="bg-slate-800/50 p-3 rounded-xl text-slate-300 font-medium">6 - 12 Meses</div>
                            <div className="bg-slate-800/80 p-3 rounded-xl text-orange-200 font-bold text-right">{t('win_6_12')}</div>
                        </div>
                    </div>
                </div>

                {/* 4. TÉCNICAS DE CALMADO (The 5 S's adapted) */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-300">
                            <HeartHandshake size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-orange-50">{t('tips_grp_physical')}</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">Técnicas de consuelo</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <Cat className="text-orange-300" size={20} />
                                    <h4 className="text-orange-200 font-bold text-sm">{t('tips_tiger_title')}</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{t('tips_tiger_desc')}</p>
                            </div>
                            <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <Package className="text-indigo-300" size={20} />
                                    <h4 className="text-orange-200 font-bold text-sm">{t('tips_swaddle_title')}</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{t('tips_swaddle_desc')}</p>
                            </div>
                            <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <Hand className="text-teal-300" size={20} />
                                    <h4 className="text-orange-200 font-bold text-sm">{t('tips_pat_title')}</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{t('tips_pat_desc')}</p>
                            </div>
                            <div className="p-4 bg-slate-800/40 rounded-2xl border border-white/5">
                                <div className="flex gap-3 mb-2">
                                    <Smile className="text-pink-300" size={20} />
                                    <h4 className="text-orange-200 font-bold text-sm">{t('tips_suck_title')}</h4>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">{t('tips_suck_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. ALIMENTACIÓN Y SUEÑO */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-300">
                            <Milk size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-orange-50">{t('tips_grp_feed')}</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="mt-1 text-slate-400 shrink-0"><Utensils size={20} /></div>
                            <div>
                                <h3 className="text-orange-50 font-bold mb-1 text-sm">{t('tips_hunger_title')}</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">{t('tips_hunger_desc')}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="mt-1 text-slate-400 shrink-0"><Layers size={20} /></div>
                            <div>
                                <h3 className="text-orange-50 font-bold mb-1 text-sm">{t('tips_cluster_title')}</h3>
                                <p className="text-xs text-slate-300 leading-relaxed">{t('tips_cluster_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 6. HEALTH & CHALLENGES */}
                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-300">
                            <Stethoscope size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-orange-50">{t('health_title')}</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-800/40 rounded-2xl border border-red-500/10">
                            <h4 className="text-orange-200 font-bold text-sm mb-1">{t('health_fever_title')}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('health_fever_desc')}</p>
                        </div>
                        <div className="p-4 bg-slate-800/40 rounded-2xl border border-orange-500/10">
                            <h4 className="text-orange-200 font-bold text-sm mb-1">{t('health_reflux_title')}</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('health_reflux_desc')}</p>
                        </div>
                    </div>
                </div>

                {/* NEW: MAJOR CHALLENGES (Colic & Arsenic Hour) */}
                <div className="space-y-4">
                    <h3 className="px-4 text-xs font-bold text-orange-200/50 uppercase tracking-widest">{t('challenges_title')}</h3>

                    {/* COLIC CARD */}
                    <div className="bg-pink-900/10 rounded-[2rem] p-6 border border-pink-500/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-pink-500/20 rounded-xl text-pink-300">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-orange-50">{t('colic_title')}</h2>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('colic_rule')}</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-900/40 rounded-2xl mb-4">
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">{t('colic_desc')}</p>
                        </div>
                        {/* How Sound Helps */}
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 text-slate-400"><ZapOff size={18} /></div>
                            <div>
                                <h4 className="text-xs font-bold text-orange-200 mb-1">{t('how_sound_helps')}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">{t('colic_sound_help')}</p>
                            </div>
                        </div>
                    </div>

                    {/* ARSENIC HOUR CARD */}
                    <div className="bg-indigo-900/10 rounded-[2rem] p-6 border border-indigo-500/20">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-300">
                                <Ghost size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-orange-50">{t('tips_arsenic_title')}</h2>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wide">18:00 - 22:00</p>
                            </div>
                        </div>
                        <div className="p-4 bg-slate-900/40 rounded-2xl mb-4">
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">{t('tips_arsenic_desc')}</p>
                        </div>
                        {/* How Sound Helps */}
                        <div className="flex gap-4 items-start">
                            <div className="mt-1 text-slate-400"><ZapOff size={18} /></div>
                            <div>
                                <h4 className="text-xs font-bold text-orange-200 mb-1">{t('how_sound_helps')}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">{t('arsenic_sound_help')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-6 border border-orange-100/5">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="p-2 bg-red-500/10 rounded-xl text-red-300">
                            <TrendingUp size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-orange-50">{t('crisis_title')}</h2>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('crisis_subtitle')}</p>
                        </div>
                    </div>

                    <div className="space-y-4 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-800">

                        <div className="relative pl-12">
                            <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-orange-400 z-10"></div>
                            <h4 className="text-orange-200 font-bold text-sm">{t('crisis_4m_title')}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('crisis_4m_desc')}</p>
                        </div>

                        <div className="relative pl-12">
                            <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-indigo-400 z-10"></div>
                            <h4 className="text-orange-200 font-bold text-sm">{t('crisis_8m_title')}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('crisis_8m_desc')}</p>
                        </div>

                        <div className="relative pl-12">
                            <div className="absolute left-3 top-1 w-4 h-4 rounded-full bg-slate-800 border-2 border-teal-400 z-10"></div>
                            <h4 className="text-orange-200 font-bold text-sm">{t('crisis_12m_title')}</h4>
                            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{t('crisis_12m_desc')}</p>
                        </div>
                    </div>
                </div>

                {/* LEGAL DISCLAIMER */}
                <div className="px-4 py-6 mt-4 opacity-50 hover:opacity-80 transition-opacity">
                    <div className="flex gap-3 mb-2">
                        <Shield size={16} className="text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                            <strong>{t('legal_title')}</strong>
                        </p>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed pl-7">
                        {t('legal_vol')}<br /><br />
                        {t('legal_med')}
                    </p>
                </div>

            </div>
        </div>
    );
};
