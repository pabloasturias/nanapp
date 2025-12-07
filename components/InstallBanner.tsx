import React from 'react';
import { Download, X } from 'lucide-react';

interface InstallBannerProps {
  onInstall: () => void;
  onDismiss: () => void;
  message: string;
  installText: string;
}

export const InstallBanner: React.FC<InstallBannerProps> = ({ onInstall, onDismiss, message, installText }) => {
  return (
    <div className="fixed top-4 left-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl shadow-2xl p-4 animate-slide-down">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-white/20 p-2 rounded-xl">
            <Download className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-tight">{message}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onInstall}
            className="bg-white text-orange-600 px-4 py-2 rounded-xl font-semibold text-sm hover:bg-orange-50 transition-colors"
          >
            {installText}
          </button>
          <button
            onClick={onDismiss}
            className="bg-white/20 p-2 rounded-xl hover:bg-white/30 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
