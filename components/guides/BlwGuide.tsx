import React, { useState } from 'react';
import { UtensilsCrossed, Apple, AlertTriangle, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const BlwGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('basics');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-32">
            <div className="text-center space-y-4 pt-10 px-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                        <UtensilsCrossed size={40} className="text-orange-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('guide_blw_title')}</h2>
                    <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mt-1">{t('guide_blw_subtitle')}</p>
                </div>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('blw_intro')}
                </p>
            </div>

            <div className="p-6 space-y-6 mt-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-orange-900/10">
                    <button onClick={() => toggle('basics')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400">
                                <ShieldCheck size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('blw_requisites_title')}</h3>
                        </div>
                        {openSection === 'basics' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'basics' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                {t('blw_requisites_desc')}
                            </p>
                            <div className="space-y-3">
                                {[
                                    { text: t('blw_req_1') },
                                    { text: t('blw_req_2') },
                                    { text: t('blw_req_3') }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-white/5 items-center">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full shrink-0"></div>
                                        <span className="text-xs text-slate-300">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-orange-900/10">
                    <button onClick={() => toggle('gagging')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('blw_gagging_title')}</h3>
                        </div>
                        {openSection === 'gagging' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'gagging' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <div className="bg-emerald-900/20 p-4 rounded-xl border border-emerald-500/30">
                                <h4 className="font-bold text-emerald-400 text-sm mb-1">{t('blw_arcada_title')}</h4>
                                <p className="text-xs text-emerald-100/70">{t('blw_arcada_desc')}</p>
                            </div>
                            <div className="bg-red-900/20 p-4 rounded-xl border border-red-500/30">
                                <h4 className="font-bold text-red-400 text-sm mb-1">{t('blw_choking_title')}</h4>
                                <p className="text-xs text-red-100/70">{t('blw_choking_desc')}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-orange-900/10">
                    <button onClick={() => toggle('cuts')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Apple size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('blw_cuts_title')}</h3>
                        </div>
                        {openSection === 'cuts' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'cuts' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {t('blw_cuts_desc')}
                            </p>
                            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                                <li>{t('blw_cuts_1')}</li>
                                <li>{t('blw_cuts_2')}</li>
                            </ul>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
