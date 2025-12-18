import React from 'react';
import { X, Heart } from 'lucide-react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 animate-[fade-in_0.2s_ease-out]">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">

                {/* Header Image/Gradient */}
                <div className="h-32 bg-gradient-to-br from-indigo-900 via-slate-900 to-orange-900/40 relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-colors backdrop-blur-md"
                    >
                        <X size={20} />
                    </button>
                    <div className="absolute -bottom-6 left-8">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl p-2 shadow-xl border border-white/5 rotate-3">
                            {/* Logo placeholder or Icon */}
                            <div className="w-full h-full bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                                n
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 pt-10 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-orange-50 mb-1">Sobre nanapp</h2>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-widest mb-6">El arte de cuidar</p>

                    <div className="space-y-6 text-sm text-slate-300 leading-relaxed font-light">
                        <p>
                            <span className="text-orange-200 font-medium">Nanapp</span> nace de la tradición más antigua del mundo: el acto de dormir a un niño.
                        </p>
                        <p>
                            Está inspirada en cómo las abuelas y madres han calmado a sus nietos e hijos durante generaciones, susurrando nanas y transmitiendo una calma que solo el amor puede generar. Queríamos capturar esa esencia en una herramienta moderna.
                        </p>

                        <div className="my-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        <div className="bg-slate-800/30 p-6 rounded-2xl border border-white/5 relative">
                            <Heart size={16} className="text-pink-400 absolute top-6 right-6 opacity-50" />

                            <h3 className="text-orange-50 font-bold mb-4 font-serif italic text-lg">Dedicado a...</h3>

                            <p className="mb-4">
                                A todas las madres y padres que buscan un momento de calma.
                            </p>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                Hecho con ❤️ para Leo
                            </p>
                            <p className="text-[10px] text-slate-300 mt-1 font-mono">
                                v1.2.1 (Monetization Update)
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
