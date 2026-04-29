
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
      className={`group relative flex flex-col items-center justify-center p-4 w-full aspect-square rounded-[2.5rem] border transition-all duration-500 overflow-hidden
        ${isActive
          ? 'bg-slate-900 border-orange-500/50 shadow-[0_20px_50px_rgba(249,115,22,0.2)] scale-[0.98]'
          : 'bg-slate-800/20 border-white/5 hover:bg-slate-800/40 hover:border-white/10 active:scale-95'
        }`}
    >
      {/* Background Glow for Active State */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent animate-pulse" />
      )}

      {/* Pulsing ring for active sound */}
      {isActive && (
        <div className="absolute inset-0 border-2 border-orange-500/20 rounded-[2.5rem] animate-[ping_2s_infinite]" />
      )}

      <div className={`relative z-10 mb-3 p-4 rounded-3xl transition-all duration-500 ${
        isActive 
          ? 'bg-orange-500 text-slate-950 rotate-[360deg] shadow-[0_0_20px_rgba(249,115,22,0.4)]' 
          : 'bg-slate-800/50 text-slate-400 group-hover:text-orange-200 group-hover:bg-slate-700/50'
      }`}>
        <IconComponent
          size={28}
          strokeWidth={isActive ? 2.5 : 1.5}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <span className={`text-[13px] font-bold tracking-tight transition-colors duration-300 ${isActive ? 'text-orange-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
          {t(sound.id as any)}
        </span>
        {isActive && (
          <div className="flex gap-1 mt-1.5">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className="w-1 h-1 rounded-full bg-orange-400 animate-bounce" 
                style={{ animationDelay: `${i * 0.15}s` }} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Glass Highlight */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
    </button>
  );
};
