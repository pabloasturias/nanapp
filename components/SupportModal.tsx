import React from 'react';
import { X, Heart, Star, ExternalLink } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToProducts: () => void;
}

const PACKAGE_NAME = "com.nanapp.android";

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
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
      <div className="relative w-full max-w-sm bg-slate-900 border border-orange-500/20 rounded-[2rem] shadow-2xl overflow-hidden animate-[scale-in_0.2s_ease-out]">

        {/* Header Image / Icon */}
        <div className="bg-gradient-to-b from-orange-500/20 to-slate-900/50 p-6 flex justify-center pt-8 relative">
          {/* Floating Stars Animation (Vega Wink) */}
          <div className="absolute top-4 left-8 text-orange-400/40 animate-pulse"><Star size={14} fill="currentColor" /></div>
          <div className="absolute top-8 right-10 text-amber-300/60 animate-bounce delay-100"><Star size={12} fill="currentColor" /></div>
          <div className="absolute bottom-6 left-12 text-orange-300/30 animate-pulse delay-300"><Star size={8} fill="currentColor" /></div>

          <div className="p-4 bg-orange-500 rounded-full text-white shadow-[0_0_30px_rgba(249,115,22,0.4)] relative z-10">
            <Heart size={40} fill="currentColor" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-colors z-20"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-2 text-center space-y-6">
          <div>
            <h2 className="text-xl font-bold text-orange-50 font-['Quicksand'] mb-2">{t('support_title')}</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {t('support_body')}
            </p>
          </div>

          {/* Action Button */}
          <a
            href={`https://play.google.com/store/apps/details?id=${PACKAGE_NAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-bold shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]"
          >
            <Star size={20} fill="currentColor" className="text-white" />
            <span>{t('support_btn')}</span>
          </a>

          <a
            href="https://www.buymeacoffee.com/pabloasturias" // Placeholder, verified by user context
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full p-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
          >
            <Heart size={20} fill="currentColor" className="text-amber-900/50" />
            <span>{t('support_donate')}</span>
          </a>

          <div className="pt-2">
            <p className="text-xs text-slate-500 font-medium">
              {t('support_footer')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};