import React, { useState } from 'react';
import { Moon, Clock, ArrowRight, Zap, AlertCircle, ChevronDown, ChevronUp, Coffee, Baby } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const SleepGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('windows');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-32">
            {/* Header */}
            <div className="text-center space-y-4 pt-10 px-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                        <Moon size={40} className="text-indigo-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('guide_sleep_title')}</h2>
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">{t('guide_sleep_subtitle')}</p>
                </div>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('sleep_intro')}
                </p>
            </div>

            <div className="p-6 space-y-6 mt-4">
                
                {/* Wake Windows Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-indigo-900/10">
                    <button onClick={() => toggle('windows')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                                <Clock size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('sleep_windows_title')}</h3>
                        </div>
                        {openSection === 'windows' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'windows' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                {t('sleep_windows_desc')}
                            </p>
                            <div className="space-y-2">
                                {[
                                    { age: t('sleep_age_1'), time: t('sleep_time_1') },
                                    { age: t('sleep_age_2'), time: t('sleep_time_2') },
                                    { age: t('sleep_age_3'), time: t('sleep_time_3') },
                                    { age: t('sleep_age_4'), time: t('sleep_time_4') },
                                ].map((win, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-white/5">
                                        <span className="text-xs font-bold text-slate-300">{win.age}</span>
                                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">{win.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Regressions Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-indigo-900/10">
                    <button onClick={() => toggle('regressions')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                                <Zap size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('sleep_regressions_title')}</h3>
                        </div>
                        {openSection === 'regressions' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'regressions' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {t('sleep_regressions_desc')}
                            </p>
                            
                            <div className="bg-slate-950 p-4 rounded-xl border border-rose-900/30 space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={40} /></div>
                                <h4 className="font-bold text-rose-400 text-sm">{t('sleep_reg_4m_title')}</h4>
                                <p className="text-xs text-slate-300">{t('sleep_reg_4m_desc')}</p>
                            </div>

                            <div className="bg-slate-950 p-4 rounded-xl border border-orange-900/30 space-y-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10"><Baby size={40} /></div>
                                <h4 className="font-bold text-orange-400 text-sm">{t('sleep_reg_8m_title')}</h4>
                                <p className="text-xs text-slate-300">{t('sleep_reg_8m_desc')}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Over-tiredness Warning */}
                <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
                        <AlertCircle size={20} />
                        {t('sleep_tired_title')}
                    </h3>
                    <p className="text-xs text-amber-100/70 leading-relaxed mb-4">
                        {t('sleep_tired_desc')}
                    </p>
                    <div className="space-y-3">
                        {[
                            t('sleep_tired_tip_1'),
                            t('sleep_tired_tip_2'),
                            t('sleep_tired_tip_3'),
                            t('sleep_tired_tip_4')
                        ].map((tip, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-amber-900/30">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0" />
                                <span className="text-xs font-medium text-slate-200">{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Final Advice */}
                <div className="p-6 rounded-[2.5rem] bg-indigo-600/20 border border-indigo-500/20 text-center relative overflow-hidden shadow-xl mt-8">
                    <div className="relative z-10 flex flex-col items-center">
                        <Coffee className="mb-3 text-indigo-400" size={24} />
                        <h3 className="text-sm font-bold text-indigo-200 mb-2">{t('sleep_final_title')}</h3>
                        <p className="text-xs text-indigo-200/60 leading-relaxed max-w-[250px]">
                            {t('sleep_final_desc')}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
