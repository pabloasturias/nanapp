
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
  <div
    className={`flex items-center justify-center ${className}`}
    style={{ width: size, height: size }}
  >
    <span className="text-[10px] font-bold leading-none">shh</span>
    <Icons.Music2 size={8} className="ml-0.5 -mt-1" strokeWidth={2} />
  </div>
);

export const SoundButton: React.FC<SoundButtonProps> = ({ sound, isActive, onClick }) => {
  const { t } = useLanguage();
  const IconComponent = sound.Icon || Icons.HelpCircle;

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
        <IconComponent
          size={24}
          className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-200/80'}
        />
      </div>
      <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-orange-50'}`}>
        {t(sound.id as any)}
      </span>
    </button>
  );
};
