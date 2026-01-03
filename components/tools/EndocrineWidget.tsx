import React, { useState } from 'react';
import { AlertTriangle, BookOpen, ShieldCheck, Info, ChevronDown, ChevronUp, CheckCircle2, XCircle } from 'lucide-react';

export const EndocrineDashboard: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <ShieldCheck size={24} className="text-emerald-400 mb-1" />
            <span className="text-[10px] opacity-70">Info Salud</span>
        </div>
    );
};

export const EndocrineFull: React.FC<{ onClose: () => void }> = ({ onClose }) => {
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
                        <h2 className="text-2xl font-bold text-white font-['Quicksand'] tracking-tight">Disruptores Endocrinos</h2>
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mt-1">Guía de Protección Infantil</p>
                    </div>
                    <p className="text-sm text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Los bebés son especialmente vulnerables a los químicos invisibles que interfieren con sus hormonas. Aquí tienes una guía práctica para minimizar riesgos.
                    </p>
                </div>

                {/* Section 1: What are they? */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <button onClick={() => toggle('what')} className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <BookOpen size={20} className="text-indigo-400" />
                            <h3 className="font-bold text-slate-200">¿Qué son y por qué importan?</h3>
                        </div>
                        {openSection === 'what' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                    {openSection === 'what' && (
                        <div className="p-5 pt-0 text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 mt-2 space-y-3">
                            <p>
                                Los <strong>Disruptores Endocrinos (EDCs)</strong> son sustancias químicas exógenas que, una vez dentro del cuerpo, se comportan como "hackers" hormonales. Pueden bloquear, imitar o alterar la producción de hormonas naturales.
                            </p>
                            <div className="bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20">
                                <strong className="block text-indigo-300 mb-1">¿Por qué el bebé es más vulnerable?</strong>
                                <ul className="list-disc pl-4 space-y-1 text-xs">
                                    <li>Su sistema hormonal y neurológico está en pleno desarrollo.</li>
                                    <li>Su metabolismo es más rápido y elimina peor los tóxicos.</li>
                                    <li>Por su tamaño, la dosis por kilo de peso es mucho mayor que en un adulto.</li>
                                    <li>Pasan mucho tiempo en el suelo (polvo) y se llevan todo a la boca.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Section 2: PLASTICS */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Principales Fuentes de Riesgo</h3>

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 shrink-0">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-base">1. Plásticos (BPA y Ftalatos)</h4>
                                <p className="text-xs text-slate-400 mt-1">Presentes en tuppers, biberones antiguos, juguetes blandos.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                <strong className="flex items-center gap-2 text-rose-400 mb-2"><XCircle size={14} /> Evitar</strong>
                                <ul className="space-y-1.5 text-slate-400 list-disc pl-3">
                                    <li>Códigos de reciclaje 3, 6 y 7 (Suelen contener BPA/PVC).</li>
                                    <li>Calentar comida en tápers de plástico (el calor libera químicos).</li>
                                    <li>Juguetes de "plástico blando" con olor fuerte (pueden tener ftalatos).</li>
                                </ul>
                            </div>
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                                <strong className="flex items-center gap-2 text-emerald-400 mb-2"><CheckCircle2 size={14} /> Preferir</strong>
                                <ul className="space-y-1.5 text-slate-400 list-disc pl-3">
                                    <li>Vidrio, Silicona Alimentaria, Acero Inoxidable.</li>
                                    <li>Códigos 2, 4 y 5 (Polipropileno/Polietileno) son más seguros si usas plástico.</li>
                                    <li>Juguetes de madera natural o tela.</li>
                                </ul>
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
                                <h4 className="font-bold text-white text-base">2. Cosmética e Higiene</h4>
                                <p className="text-xs text-slate-400 mt-1">La piel del bebé es un órgano muy permeable.</p>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm text-slate-300">
                            <p>Muchos productos contienen <strong>Parabenos</strong> (conservantes) o <strong>Ftalatos</strong> (a menudo ocultos bajo la palabra "Parfum" o "Fragancia").</p>
                            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                                <p><strong className="text-purple-300">El truco:</strong> Menos es más. Un bebé no necesita oler a perfume.</p>
                                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                                    <li>Evita productos con "Parfum" en la lista de ingredientes (INCI).</li>
                                    <li>Busca sellos "Eco" o "Bio" certificados.</li>
                                    <li>Si usas toallitas, que sean 99% agua o lávalas tras usar.</li>
                                    <li>Evita cremas solares con filtros químicos (Oxybenzone). Usa filtros minerales (Zinc/Titanio).</li>
                                </ul>
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
                                <h4 className="font-bold text-white text-base">3. Textil y Aire</h4>
                                <p className="text-xs text-slate-400 mt-1">Ropa nueva y polvo doméstico.</p>
                            </div>
                        </div>

                        <ul className="space-y-3 text-sm text-slate-300">
                            <li className="flex gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                <span><strong>Lava SIEMPRE la ropa nueva</strong> antes de ponérsela. Elimina restos de tintes y aprestos industriales.</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                <span><strong>Evita insecticidas</strong> y ambientadores de hogar en spray o enchufe.</span>
                            </li>
                            <li className="flex gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                <span><strong>Ventila a diario.</strong> El aire interior puede estar hasta 5 veces más contaminado que el exterior. Abrir 10 minutos basta.</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Summary / Checklist */}
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 border border-emerald-500/30 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} />
                        Lista Rápida de Prevención
                    </h3>
                    <div className="space-y-3">
                        {[
                            "No calentar plástico en microondas/lavavajillas.",
                            "Usar cosmética sin perfume ni parabenos.",
                            "Lavar ropa nueva antes de usar.",
                            "Ventilar la habitación 10 min al día.",
                            "Priorizar alimentos frescos vs enlatados.",
                            "Pasar la aspiradora/fregona para reducir polvo tóxico."
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

                <div className="text-center px-4">
                    <p className="text-[10px] text-slate-600 italic">
                        Nota: Vivimos rodeados de química y el riesgo cero no existe. No te obsesiones, pero toma pequeñas decisiones informadas que reducen la carga tóxica total (efecto cóctel).
                    </p>
                </div>
            </div>
        </div>
    );
};
