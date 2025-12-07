
import React from 'react';
import * as Icons from 'lucide-react';
import { SoundOption, SoundType } from '../types';
import { useLanguage } from '../services/LanguageContext';

interface SoundButtonProps {
  sound: SoundOption;
  isActive: boolean;
  onClick: () => void;
}

const ShushIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <circle cx="12" cy="11" r="9" />
        <circle cx="9" cy="9" r="1.2" fill="currentColor" />
        <circle cx="15" cy="9" r="1.2" fill="currentColor" />
        <path d="M9 14 Q12 16 15 14" />
        <rect x="17" y="8" width="3" height="10" rx="1.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="18.5" cy="6.5" r="1.5" fill="currentColor" stroke="currentColor" strokeWidth="0.5" />
    </svg>
);

export const SoundButton: React.FC<SoundButtonProps> = ({ sound, isActive, onClick }) => {
  const { t } = useLanguage();
  const IconComponent = (Icons as any)[sound.iconName] || Icons.HelpCircle;

  return (
    <button
      onClick={(e) => {
          e.stopPropagation(); 
          onClick();
      }}
      className={`group relative flex flex-col items-center justify-center p-2 w-full h-full min-h-[65px] rounded-[2rem] border transition-all duration-300
        ${isActive 
          ? 'bg-orange-400 border-orange-300 shadow-[0_0_30px_rgba(251,146,60,0.25)]' 
          : 'bg-slate-800/60 border-orange-100/5 hover:bg-slate-800 hover:border-orange-100/10'
        }`}
    >
      <div className={`mb-2 p-3 rounded-full transition-transform duration-500 ${isActive ? 'scale-105 bg-white/25' : 'bg-slate-900/50 group-hover:bg-slate-900'}`}>
        {sound.id === SoundType.SHUSH ? (
            <ShushIcon 
                size={24} 
                className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-200/80'}
            />
        ) : (
            <IconComponent 
            size={24} 
            className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-200/80'} 
            strokeWidth={1.5}
            />
        )}
      </div>
      <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-50'}`}>
        {t(sound.id as any)}
      </span>
    </button>
  );
};
