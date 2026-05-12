import React, { useState } from 'react';
import { AlertTriangle, BookOpen, ShieldCheck, Info, ChevronDown, ChevronUp, CheckCircle2, XCircle, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../services/LanguageContext';

export const EndocrineDashboard: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
                <ShieldCheck size={14} className="text-emerald-400" />
                <div className="flex gap-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
            </div>
            <span className="text-[10px] opacity-70">{t('endo_disruptors' as any)}</span>
        </div>
    );
};

export const EndocrineFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { t } = useLanguage();
    const [openSection, setOpenSection] = useState<string | null>('what');

    const toggle = (id: string) => setOpenSection(openSection === id ? null : id);

    return (
        <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
            <div className="p-6 space-y-8 pb-32">

                {/* Intro Header */}
                <div className="text-center space-y-4 pt-4">
                    <div className="relative w-20 h-20 mx-auto">
                        <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse"></div>
                        <div className="relative w-full h-full bg-slate-900 rounded-full flex items-center justify-center border border-slate-700 shadow-2xl">
                            <ShieldCheck size={40} className="text-emerald-400" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white font-['Quicksand'] tracking-tight">{t('tool_endocrine_info')}</h2>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">{t('tool_endocrine_subtitle')}</p>
                    </div>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        {t('tool_endocrine_intro')}
                    </p>
                </div>

                {/* Section 1: What are they? */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <button onClick={() => toggle('what')} className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-indigo-400" />
                            <h3 className="font-bold text-slate-200">{t('tool_endocrine_what_title')}</h3>
                        </div>
                        {openSection === 'what' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openSection === 'what' && (
                        <div className="p-5 pt-0 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 mt-2 space-y-3">
                            <p>{t('tool_endocrine_what_text')}</p>
                            <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                                <strong className="block text-indigo-300 mb-1">{t('tool_endocrine_why_baby')}</strong>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: PLASTICS */}
                <div className="space-y-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">{t('tool_endocrine_risk_plastics')}</h4>
                                <p className="text-xs text-slate-400 mt-1">{t('tool_endocrine_risk_plastics_desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: COSMETICS */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">{t('tool_endocrine_risk_cosmetics')}</h4>
                                <p className="text-xs text-slate-400 mt-1">{t('tool_endocrine_risk_cosmetics_desc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section 4: TEXTILES & HOME */}
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">{t('tool_endocrine_risk_home')}</h4>
                                <p className="text-xs text-slate-400 mt-1">{t('tool_endocrine_risk_home_desc')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary / Checklist */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} />
                        {t('tool_endocrine_list_title')}
                    </h3>
                    <div className="space-y-3">
                        {[
                            t('tool_endocrine_tip_1'),
                            t('tool_endocrine_tip_2'),
                            t('tool_endocrine_tip_3'),
                            t('tool_endocrine_tip_4'),
                        ].map((tip, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-950/50 p-3 rounded-xl border border-emerald-900/30">
                                <div className="w-5 h-5 rounded-full border-2 border-emerald-500/50 flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                                </div>
                                <span className="text-xs font-medium text-slate-200">{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Light Section */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">{t('endo_traffic_light' as any)}</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { name: t('endo_ing_1' as any), risk: 'high', label: t('endo_ing_1_desc' as any) },
                            { name: t('endo_ing_2' as any), risk: 'medium', label: t('endo_ing_2_desc' as any) },
                            { name: t('endo_ing_3' as any), risk: 'low', label: t('endo_ing_3_desc' as any) }
                        ].map((ing, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-900 border border-white/5 rounded-2xl">
                                <span className="text-sm font-bold text-slate-200">{ing.name as string}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">{ing.label as string}</span>
                                    <div className={`w-3 h-3 rounded-full ${ing.risk === 'high' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : ing.risk === 'medium' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Healthy Swaps */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={14} />
                        {t('tool_endocrine_swaps')}
                    </h3>
                    <div className="space-y-3">
                        {[
                            { from: t('endo_swap_1_from' as any), to: t('endo_swap_1_to' as any) },
                            { from: t('endo_swap_2_from' as any), to: t('endo_swap_2_to' as any) },
                            { from: t('endo_swap_3_from' as any), to: t('endo_swap_3_to' as any) }
                        ].map((swap, i) => (
                            <div key={i} className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-white/5">
                                <div className="flex-1 text-xs text-rose-400 line-through opacity-50">{swap.from}</div>
                                <ArrowRight size={12} className="text-slate-600" />
                                <div className="flex-1 text-xs text-emerald-400 font-bold">{swap.to}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Scan Simulator */}
                <div className="pt-4 pb-8">
                    <button className="w-full py-5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-[2rem] flex items-center justify-center gap-3 text-white font-bold text-lg shadow-xl shadow-emerald-900/40 active:scale-[0.98] transition-all group">
                        <Search className="group-hover:scale-110 transition-transform" />
                        {t('endo_scan_btn' as any)}
                        <Sparkles size={16} className="animate-pulse" />
                    </button>
                    <p className="text-[10px] text-slate-600 text-center mt-4 uppercase font-bold tracking-widest">{t('endo_scan_desc' as any)}</p>
                </div>

                <div className="text-center px-4">
                    <p className="text-[10px] text-slate-600 italic">
                        {t('tool_endocrine_disclaimer')}
                    </p>
                </div>
            </div>
        </div>
    );
};
