import React from 'react';
import { Package, HeartHandshake, ShoppingBag, Lightbulb, Sparkles, Cat, Hand, Smile, EyeOff, AlertCircle, Music2, Ghost, Utensils, Layers, ShieldAlert, Milk, PauseCircle, Footprints, Flower2, Sunrise, Moon } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

export const TipsView: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex-1 overflow-y-auto pb-24 px-1">
        <div className="space-y-8 animate-[fade-in_0.5s_ease-out]">
            
            {/* Header */}
            <div className="flex items-center gap-4 mb-2 px-2 pt-2">
                <div className="p-3 bg-teal-500/20 rounded-2xl text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.1)]">
                    <Sparkles size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-orange-50 font-['Quicksand']">{t('tips_title')}</h2>
                    <p className="text-sm text-slate-400">{t('tips_subtitle')}</p>
                </div>
            </div>

            {/* GROUP 1: PREVENCIÓN (Anticipation) */}
            <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-orange-200/50 uppercase tracking-widest">{t('tips_grp_prev')}</h3>
                
                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-red-300 shrink-0"><EyeOff size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_overtired_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_overtired_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-indigo-300 shrink-0"><Ghost size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_arsenic_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_arsenic_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-orange-300 shrink-0"><Utensils size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_hunger_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_hunger_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-blue-300 shrink-0"><PauseCircle size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_pause_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_pause_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-amber-200 shrink-0"><Sunrise size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_dawn_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_dawn_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* GROUP 2: TÉCNICAS MANUALES (Physical Relief) */}
            <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-orange-200/50 uppercase tracking-widest">{t('tips_grp_physical')}</h3>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-purple-300 shrink-0"><AlertCircle size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_colic_relief_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_colic_relief_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-emerald-300 shrink-0"><Footprints size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_reflex_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_reflex_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-orange-300 shrink-0"><Cat size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_tiger_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_tiger_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-teal-300 shrink-0"><Hand size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_pat_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_pat_desc')}</p>
                        </div>
                    </div>
                </div>

                 <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-pink-300 shrink-0"><Smile size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_suck_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_suck_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* GROUP 3: ALIMENTACIÓN (Feeding) */}
            <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-orange-200/50 uppercase tracking-widest">{t('tips_grp_feed')}</h3>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-yellow-300 shrink-0"><Milk size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_cluster_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_cluster_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-rose-300 shrink-0"><Music2 size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_bf_noise_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_bf_noise_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-indigo-300 shrink-0"><Moon size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_wean_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_wean_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* GROUP 4: ENTORNO Y CONTENCIÓN (Environment) */}
            <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-orange-200/50 uppercase tracking-widest">{t('tips_grp_env')}</h3>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-emerald-300 shrink-0"><Layers size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_diaper_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_diaper_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-pink-300 shrink-0"><Flower2 size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_scent_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_scent_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-indigo-300 shrink-0"><Package size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_swaddle_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_swaddle_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-rose-300 shrink-0"><HeartHandshake size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_carry_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_carry_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-amber-300 shrink-0"><ShoppingBag size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_sack_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_sack_desc')}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900/40 rounded-[2rem] p-5 border border-orange-100/5 hover:bg-slate-900/60 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-yellow-300 shrink-0"><Lightbulb size={24} /></div>
                        <div>
                            <h3 className="text-orange-50 font-bold mb-1">{t('tips_red_title')}</h3>
                            <p className="text-sm text-slate-300 leading-relaxed">{t('tips_red_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* GROUP 5: SALUD PARENTAL */}
            <div className="space-y-4">
                <h3 className="px-4 text-xs font-bold text-orange-200/50 uppercase tracking-widest">{t('tips_grp_health')}</h3>
                <div className="bg-red-900/30 rounded-[2rem] p-5 border border-red-500/20 hover:bg-red-900/40 transition-colors">
                    <div className="flex gap-4">
                        <div className="mt-1 text-red-400 shrink-0"><ShieldAlert size={24} /></div>
                        <div>
                            <h3 className="text-red-200 font-bold mb-1">{t('tips_mental_title')}</h3>
                            <p className="text-sm text-red-100/80 leading-relaxed">{t('tips_mental_desc')}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-6 py-4 text-center">
                <p className="text-xs text-slate-500 italic">
                    "{t('tips_quote')}"
                </p>
            </div>
        </div>
    </div>
  );
};