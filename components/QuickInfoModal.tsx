
import React from 'react';
import { X, AlertCircle, Ghost } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface QuickInfoModalProps {
  isOpen: boolean;
  type: 'colic' | 'arsenic' | null;
  onClose: () => void;
}

export const QuickInfoModal: React.FC<QuickInfoModalProps> = ({ isOpen, type, onClose }) => {
  const { t } = useLanguage();

  if (!isOpen || !type) return null;

  const isColic = type === 'colic';
  const title = isColic ? t('colic_title') : t('tips_arsenic_title');
  const icon = isColic ? <AlertCircle size={28} className="text-pink-300" /> : <Ghost size={28} className="text-indigo-300" />;
  const content = isColic ? t('tips_colic_relief_desc') : t('tips_arsenic_desc');
  const bgClass = isColic ? 'bg-pink-500/10 border-pink-500/20' : 'bg-indigo-500/10 border-indigo-500/20';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">
        <div className={`p-6 ${bgClass} border-b`}>
            <div className="flex justify-between items-start">
                <div className="p-3 bg-slate-900/50 rounded-2xl shadow-sm">{icon}</div>
                <button onClick={onClose} className="p-2 rounded-full bg-slate-900/50 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-white font-['Quicksand']">{title}</h2>
        </div>
        <div className="p-6">
            <p className="text-sm text-slate-300 leading-relaxed font-medium">{content}</p>
            <div className="mt-6 pt-4 border-t border-slate-800">
                <p className="text-xs text-slate-500 text-center">
                    {t('legal_med')}
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};
