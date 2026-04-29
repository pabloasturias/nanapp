
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

  const isCountingDown = isPlaying && timerRemaining !== null;

  const handleMainAction = () => {
      triggerHaptic();
      if (isPlaying) {
          onPause();
      } else {
          onPlay();
      }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-slate-900/40 backdrop-blur-3xl p-5 rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden">
      
      {/* Background Decorative Gradient */}
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-500/10 blur-[80px] pointer-events-none" />

      {/* TIMER SECTION */}
      <div className="flex items-center justify-between bg-slate-950/40 rounded-[2rem] p-2 px-5 border border-white/5">
         <div className="flex items-center gap-2 text-slate-500">
             <Clock size={16} />
             <span className="text-[11px] font-black uppercase tracking-tighter">{t('timer')}</span>
         </div>

         <div className="flex items-center gap-4">
             <button 
                onClick={() => { onAdjustTimer(-10); triggerHaptic(); }}
                disabled={timerDuration <= 10}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 disabled:opacity-20 transition-all hover:bg-slate-700"
             >
                <Minus size={16} />
             </button>

             <button 
                onClick={() => { onToggleTimerActive(); triggerHaptic(); }}
                className={`flex flex-col items-center justify-center min-w-[70px] transition-all duration-500 ${isTimerActive ? 'scale-110' : 'opacity-40'}`}
             >
                <span className={`font-mono text-xl font-bold leading-none ${isCountingDown ? 'text-orange-400' : 'text-white'}`}>
                    {isCountingDown ? formatTime(timerRemaining!) : `${timerDuration}m`}
                </span>
                {isCountingDown && (
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-0.5 h-0.5 rounded-full bg-orange-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                    ))}
                  </div>
                )}
             </button>

             <button 
                onClick={() => { onAdjustTimer(10); triggerHaptic(); }}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 transition-all hover:bg-slate-700"
             >
                <Plus size={16} />
             </button>
         </div>
      </div>

      {/* MAIN ACTIONS */}
      <div className="flex gap-3 h-20">
          <button
            onClick={handleMainAction}
            className={`flex-1 flex items-center justify-center gap-4 h-full rounded-[2.2rem] border transition-all duration-500 active:scale-95 relative overflow-hidden group
                ${isPlaying 
                    ? 'bg-orange-500 border-orange-400 text-slate-950 shadow-[0_15px_40px_rgba(249,115,22,0.3)]' 
                    : 'bg-white border-white text-slate-950 shadow-xl'}`}
          >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

              <div className={`p-3 rounded-full transition-all duration-500 ${isPlaying ? 'bg-slate-950/10' : 'bg-slate-900/5'}`}>
                {isPlaying ? (
                    <Pause size={28} fill="currentColor" />
                ) : (
                    <Play size={28} fill="currentColor" className="ml-1" />
                )}
              </div>
              
              <span className="text-sm font-black uppercase tracking-widest">
                {isPlaying ? t('pause') : (isPaused ? t('start') : t('start'))}
              </span>
          </button>

          <button
            onClick={() => { onStop(); triggerHaptic(); }}
            className="w-20 flex flex-col items-center justify-center gap-1 h-full rounded-[2.2rem] bg-slate-800/40 border border-white/5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-95 group"
          >
              <Square size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-tighter">{t('finish')}</span>
          </button>
      </div>
    </div>
  );
};
