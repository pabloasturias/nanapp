
import React from 'react';
import { Play, Pause, Square, Plus, Minus, Clock } from 'lucide-react';
import { useLanguage } from '../services/LanguageContext';

interface ControlsProps {
  isPlaying: boolean;
  isPaused: boolean; 
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  
  timerDuration: number; 
  timerRemaining: number | null;
  onAdjustTimer: (delta: number) => void;
  isTimerActive: boolean; 
  onToggleTimerActive: () => void;
  hapticsEnabled: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  isPlaying,
  isPaused,
  onPlay,
  onPause,
  onStop,
  timerDuration,
  timerRemaining,
  onAdjustTimer,
  isTimerActive,
  onToggleTimerActive,
  hapticsEnabled
}) => {
  const { t } = useLanguage();
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const triggerHaptic = () => {
    if (hapticsEnabled && navigator.vibrate) {
        navigator.vibrate(10);
    }
  };

  const hasTimeRemaining = timerRemaining !== null && timerRemaining > 0;
  const isCountingDown = isPlaying && hasTimeRemaining;

  const handleMainAction = () => {
      triggerHaptic();
      if (isPlaying) {
          onPause();
      } else {
          onPlay();
      }
  };

  return (
    <div className="flex flex-col gap-3 w-full bg-slate-900/80 backdrop-blur-xl p-4 rounded-[2.5rem] border border-orange-100/5 shadow-[0_-10px_40px_-10px_rgba(2,6,23,0.6)]">
      
      <div className="flex items-center justify-between bg-slate-950/40 rounded-3xl p-1.5 px-4 border border-orange-100/5">
         <div className="flex items-center gap-2 text-slate-400">
             <Clock size={14} />
             <span className="text-[10px] font-bold uppercase tracking-wider">{t('timer')}</span>
         </div>

         <div className="flex items-center gap-2">
             <button 
                onClick={() => { onAdjustTimer(-10); triggerHaptic(); }}
                disabled={timerDuration <= 10}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
             >
                <Minus size={14} />
             </button>

             <button 
                onClick={() => { onToggleTimerActive(); triggerHaptic(); }}
                className={`relative min-w-[80px] h-8 flex items-center justify-center rounded-2xl border transition-all duration-300 
                ${!isTimerActive ? 'bg-transparent border-transparent text-slate-600' : 
                   hasTimeRemaining 
                    ? 'bg-orange-500/10 border-orange-500/30 text-orange-200 shadow-[inset_0_0_15px_rgba(249,115,22,0.1)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}
             >
                {isCountingDown && (
                   <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse shadow-[0_0_5px_rgba(251,146,60,0.8)]" />
                )}
                <span className="font-mono font-bold text-base leading-none">
                    {hasTimeRemaining 
                        ? formatTime(timerRemaining!) 
                        : `${timerDuration}m`}
                </span>
             </button>

             <button 
                onClick={() => { onAdjustTimer(10); triggerHaptic(); }}
                className="p-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
             >
                <Plus size={14} />
             </button>
         </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-0 h-16">
          <button
            onClick={handleMainAction}
            className={`col-span-3 flex items-center justify-center gap-3 h-full rounded-[2rem] border transition-all active:scale-95 shadow-xl
                ${isPlaying 
                    ? 'bg-slate-800 border-slate-700 text-orange-400 shadow-orange-500/5' 
                    : 'bg-orange-400 border-orange-300 text-white shadow-orange-500/20'}`}
          >
              {isPlaying ? (
                  <>
                    <Pause size={28} fill="currentColor" />
                    <span className="text-sm font-bold uppercase tracking-widest">{t('pause')}</span>
                  </>
              ) : (
                  <>
                    <Play size={28} fill="currentColor" className="ml-1" />
                    <span className="text-sm font-bold uppercase tracking-widest">{isPaused ? t('start') : t('start')}</span>
                  </>
              )}
          </button>

          <button
            onClick={() => { onStop(); triggerHaptic(); }}
            className="col-span-1 flex flex-col items-center justify-center gap-1 h-full rounded-[2rem] bg-slate-800/80 border border-slate-700/50 text-slate-400 hover:text-red-300 hover:border-red-500/20 transition-all active:scale-95"
          >
              <Square size={20} fill="currentColor" />
              <span className="text-[9px] font-bold uppercase">{t('finish')}</span>
          </button>
      </div>
    </div>
  );
};
