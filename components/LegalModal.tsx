
import React from 'react';
import { X, Shield, Volume2, Stethoscope, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700/50 rounded-[2rem] shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-800 rounded-xl text-slate-300">
                    <Shield size={20} />
                </div>
                <h2 className="text-lg font-bold text-orange-50 font-['Quicksand']">{t('legal_title')}</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-orange-50 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            
            {/* Volume Warning */}
            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-orange-500/10 rounded-xl text-orange-300 shrink-0 h-fit">
                    <Volume2 size={22} />
                </div>
                <div>
                    <h3 className="text-orange-50 font-bold mb-1 text-sm">{t('legal_vol_title')}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {t('legal_vol')}
                    </p>
                </div>
            </div>

            {/* Medical Disclaimer */}
            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-red-500/10 rounded-xl text-red-300 shrink-0 h-fit">
                    <Stethoscope size={22} />
                </div>
                <div>
                    <h3 className="text-orange-50 font-bold mb-1 text-sm">{t('legal_med_title')}</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                        {t('legal_med')}
                    </p>
                </div>
            </div>

            {/* General Safety */}
            <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 flex gap-3">
                <AlertTriangle size={20} className="text-yellow-500 shrink-0" />
                <p className="text-[10px] text-slate-400 leading-relaxed">
                    nanapp no se hace responsable del uso indebido de la aplicación. La supervisión parental es obligatoria en todo momento.
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};
