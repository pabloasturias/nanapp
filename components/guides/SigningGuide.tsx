import React, { useState } from 'react';
import { Hand, Ear, ChevronDown, ChevronUp, MessageSquareHeart } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const SigningGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('intro');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto pb-32">
            <div className="text-center space-y-4 pt-10 px-6">
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 bg-fuchsia-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                        <MessageSquareHeart size={40} className="text-fuchsia-400" />
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('guide_signing_title')}</h2>
                    <p className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest mt-1">{t('guide_signing_subtitle')}</p>
                </div>
                <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {t('sign_intro')}
                </p>
            </div>

            <div className="p-6 space-y-6 mt-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-fuchsia-900/10">
                    <button onClick={() => toggle('intro')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400">
                                <Ear size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('sign_why_title')}</h3>
                        </div>
                        {openSection === 'intro' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'intro' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                {t('sign_why_desc')}
                            </p>
                            <div className="bg-slate-950 p-4 rounded-xl border border-white/5">
                                <p className="text-xs text-slate-300 italic">
                                    "{t('sign_why_quote')}"
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg shadow-fuchsia-900/10">
                    <button onClick={() => toggle('signs')} className="w-full p-5 flex items-center justify-between hover:bg-slate-800/80 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                                <Hand size={20} />
                            </div>
                            <h3 className="font-bold text-slate-200">{t('sign_basic_title')}</h3>
                        </div>
                        {openSection === 'signs' ? <ChevronUp size={16} className="text-slate-500" /> : <ChevronDown size={16} className="text-slate-500" />}
                    </button>
                    {openSection === 'signs' && (
                        <div className="p-5 pt-0 border-t border-slate-800/50 mt-2 space-y-4">
                            <div className="space-y-3">
                                {[
                                    { title: t('sign_milk_title'), text: t('sign_milk_desc') },
                                    { title: t('sign_more_title'), text: t('sign_more_desc') },
                                    { title: t('sign_eat_title'), text: t('sign_eat_desc') }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-indigo-900/30">
                                        <div className="w-8 h-8 bg-indigo-500/10 rounded-full flex items-center justify-center shrink-0">
                                            <Hand size={14} className="text-indigo-400" />
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

                <div className="bg-gradient-to-br from-fuchsia-900/40 to-slate-900 border border-fuchsia-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-fuchsia-400 mb-2">{t('sign_tips_title')}</h3>
                    <ul className="text-xs text-fuchsia-100/70 leading-relaxed list-disc pl-4 space-y-2">
                        <li>{t('sign_tip_1')}</li>
                        <li>{t('sign_tip_2')}</li>
                        <li>{t('sign_tip_3')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
