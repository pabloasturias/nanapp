import React, { useState } from 'react';
import { HeartHandshake, Baby, MoveUp, AlertCircle, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const BabywearingGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('ergonomics');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-32">
            <div className="text-center space-y-4 pt-10 px-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-teal-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                        <HeartHandshake size={40} className="text-teal-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('guide_babywear_title')}</h2>
                    <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mt-1">{t('guide_babywear_subtitle')}</p>
                </div>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('wearing_intro')}
                </p>
            </div>

            <div className="p-6 space-y-6 mt-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-teal-900/10">
                    <button onClick={() => toggle('ergonomics')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
                                <Baby size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('wearing_ergo_title')}</h3>
                        </div>
                        {openSection === 'ergonomics' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'ergonomics' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                {t('wearing_ergo_desc')}
                            </p>
                            <div className="space-y-3">
                                {[
                                    { title: t('wearing_ergo_m_title' as any), text: t('wearing_ergo_m' as any) },
                                    { title: t('wearing_ergo_c_title' as any), text: t('wearing_ergo_c' as any) },
                                    { title: t('wearing_ergo_kiss_title' as any), text: t('wearing_ergo_kiss' as any) }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                                        <div className="w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold text-teal-400">{i + 1}</span>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-200 block mb-1">{item.title}</span>
                                            <span className="text-xs text-slate-400">{item.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-teal-900/10">
                    <button onClick={() => toggle('types')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <MoveUp size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('wearing_types_title')}</h3>
                        </div>
                        {openSection === 'types' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'types' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/30">
                                <h4 className="font-bold text-indigo-300 text-sm mb-1">{t('wearing_type_wrap_title')}</h4>
                                <p className="text-xs text-slate-300">{t('wearing_type_wrap_desc')}</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/30">
                                <h4 className="font-bold text-indigo-300 text-sm mb-1">{t('wearing_type_backpack_title')}</h4>
                                <p className="text-xs text-slate-300">{t('wearing_type_backpack_desc')}</p>
                            </div>
                            <div className="bg-slate-950 p-4 rounded-xl border border-indigo-900/30">
                                <h4 className="font-bold text-indigo-300 text-sm mb-1">{t('wearing_type_ring_title')}</h4>
                                <p className="text-xs text-slate-300">{t('wearing_type_ring_desc')}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gradient-to-br from-amber-900/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-2 flex items-center gap-2">
                        <AlertCircle size={20} />
                        {t('wearing_warning_title')}
                    </h3>
                    <p className="text-xs text-amber-100/70 leading-relaxed">
                        {t('wearing_warning_desc')}
                    </p>
                </div>
            </div>
        </div>
    );
};
