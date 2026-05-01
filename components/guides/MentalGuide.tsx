import React, { useState } from 'react';
import { HeartPulse, ArrowRight, Zap, AlertTriangle, ChevronDown, ChevronUp, Coffee, LifeBuoy } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const MentalGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('burnout');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-32">
            {/* Header */}
            <div className="text-center space-y-4 pt-10 px-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                        <HeartPulse size={40} className="text-rose-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('guide_mental_title')}</h2>
                    <p className="text-xs font-bold text-rose-400 uppercase tracking-widest mt-1">{t('guide_mental_subtitle')}</p>
                </div>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('mental_intro')}
                </p>
            </div>

            <div className="p-6 space-y-6 mt-4">
                
                {/* Burnout Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-rose-900/10">
                    <button onClick={() => toggle('burnout')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('mental_burnout_title')}</h3>
                        </div>
                        {openSection === 'burnout' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'burnout' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-2">
                                {t('mental_burnout_desc')}
                            </p>
                            <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
                                <h4 className="font-bold text-rose-300 text-sm mb-2">{t('mental_burnout_alert')}</h4>
                                <ul className="text-xs text-rose-200/80 space-y-2 list-disc pl-4">
                                    <li>{t('mental_burnout_tip_1')}</li>
                                    <li>{t('mental_burnout_tip_2')}</li>
                                    <li>{t('mental_burnout_tip_3')}</li>
                                    <li>{t('mental_burnout_tip_4')}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Code Red Protocol */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-rose-900/10">
                    <button onClick={() => toggle('codered')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                <LifeBuoy size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('mental_code_title')}</h3>
                        </div>
                        {openSection === 'codered' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'codered' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {t('mental_code_desc')}
                            </p>
                            
                            <div className="space-y-3">
                                {[
                                    { step: 1, text: t('mental_code_step_1') },
                                    { step: 2, text: t('mental_code_step_2') },
                                    { step: 3, text: t('mental_code_step_3') },
                                    { step: 4, text: t('mental_code_step_4') },
                                    { step: 5, text: t('mental_code_step_5') }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-red-400">{item.step}</span>
                                        </div>
                                        <span className="text-xs text-slate-300 pt-1">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Mental Load */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2">
                        <Zap size={20} />
                        {t('mental_load_title')}
                    </h3>
                    <p className="text-xs text-indigo-100/70 leading-relaxed mb-4">
                        {t('mental_load_desc')}
                    </p>
                    <p className="text-xs text-indigo-100/70 leading-relaxed font-bold">
                        {t('mental_load_sol')}
                    </p>
                </div>

                {/* Final Advice */}
                <div className="p-6 rounded-[2.5rem] bg-rose-600/20 border border-rose-500/20 text-center relative overflow-hidden shadow-xl mt-8">
                    <div className="relative z-10 flex flex-col items-center">
                        <Coffee className="mb-3 text-rose-400" size={24} />
                        <h3 className="text-sm font-bold text-rose-200 mb-2">{t('mental_final_title')}</h3>
                        <p className="text-xs text-rose-200/60 leading-relaxed max-w-[250px]">
                            {t('mental_final_desc')}
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};
