
import React from 'react';
import { X, Brain, Ear, Activity } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface WhyItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WhyItWorksModal: React.FC<WhyItWorksModalProps> = ({ isOpen, onClose }) => {
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
            <h2 className="text-lg font-bold text-orange-50 font-['Quicksand']">{t('why_works')}</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-orange-50 transition-colors">
                <X size={20} />
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
            
            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-teal-500/10 rounded-xl text-teal-300 shrink-0 h-fit">
                    <Ear size={22} />
                </div>
                <div>
                    <h3 className="text-orange-50 font-bold mb-1">{t('why_womb_title')}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {t('why_womb_desc')}
                    </p>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="mt-1 p-2 bg-indigo-500/10 rounded-xl text-indigo-300 shrink-0 h-fit">
                    <Activity size={22} />
                </div>
                <div>
                    <h3 className="text-orange-50 font-bold mb-1">{t('why_mask_title')}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {t('why_mask_desc')}
                    </p>
                </div>
            </div>

             <div className="flex gap-4">
                <div className="mt-1 p-2 bg-rose-500/10 rounded-xl text-rose-300 shrink-0 h-fit">
                    <Brain size={22} />
                </div>
                <div>
                    <h3 className="text-orange-50 font-bold mb-1">{t('why_assoc_title')}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                        {t('why_assoc_desc')}
                    </p>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};
