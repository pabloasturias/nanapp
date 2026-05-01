import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Phone, ChevronDown, ChevronUp, Activity, Heart } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const CprGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('choking');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-32">
            <div className="text-center space-y-4 pt-10 px-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                        <ShieldAlert size={40} className="text-red-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('guide_cpr_title')}</h2>
                    <p className="text-xs font-bold text-red-400 uppercase tracking-widest mt-1">{t('guide_cpr_subtitle')}</p>
                </div>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('cpr_intro')}
                </p>
            </div>

            <div className="p-6 space-y-6 mt-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-red-900/10">
                    <button onClick={() => toggle('choking')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('cpr_choking_title')}</h3>
                        </div>
                        {openSection === 'choking' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'choking' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                {t('cpr_choking_desc')}
                            </p>
                            <div className="space-y-3">
                                {[
                                    { step: 1, text: t('cpr_choking_step_1') },
                                    { step: 2, text: t('cpr_choking_step_2') },
                                    { step: 3, text: t('cpr_choking_step_3') },
                                    { step: 4, text: t('cpr_choking_step_4') }
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

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-red-900/10">
                    <button onClick={() => toggle('cpr')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                <Activity size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('cpr_cpr_title')}</h3>
                        </div>
                        {openSection === 'cpr' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'cpr' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                {t('cpr_cpr_desc')}
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-orange-900/30">
                                <h4 className="font-bold text-orange-300 text-sm mb-2">{t('cpr_cpr_ratio')}</h4>
                                <ul className="text-xs text-orange-200/80 space-y-2 list-disc pl-4">
                                    <li>{t('cpr_cpr_step_1')}</li>
                                    <li>{t('cpr_cpr_step_2')}</li>
                                    <li>{t('cpr_cpr_step_3')}</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-red-900/40 to-slate-900 border border-red-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center gap-2">
                        <Phone size={20} />
                        {t('cpr_emergency_title')}
                    </h3>
                    <p className="text-xs text-red-100/70 leading-relaxed mb-4">
                        {t('cpr_emergency_desc')}
                    </p>
                    <div className="text-center bg-slate-950/50 p-4 rounded-xl border border-red-900/30">
                        <span className="text-3xl font-black text-white tracking-widest">112</span>
                    </div>
                </div>

                <div className="p-6 rounded-[2.5rem] bg-slate-800/50 text-center relative overflow-hidden mt-8">
                    <Heart className="mx-auto mb-3 text-slate-500" size={24} />
                    <p className="text-xs text-slate-400 leading-relaxed max-w-[250px] mx-auto">
                        {t('cpr_disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};
