import React from 'react';

interface VisualizerProps {
  isActive: boolean;
  type: 'calm' | 'pulse';
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive, type }) => {
  return (
    <div className={`pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-[2000ms] ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Background Gradient Mesh (Deep Blue & Warmth) */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950/40" />

      {/* Main Breathing Orb (Soft Orange/Peach) */}
      <div className={`absolute w-[500px] h-[500px] rounded-full bg-orange-400/10 blur-[120px] 
        ${isActive ? 'animate-[pulse_8s_ease-in-out_infinite]' : ''}`} 
      />
      
      {/* Secondary Organic Shapes (Soft Blue & Beige) */}
      <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-400/5 blur-[90px] mix-blend-screen
        ${isActive ? 'animate-[bounce_10s_infinite]' : ''}`} 
      />

      <div className={`absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-orange-200/5 blur-[100px] mix-blend-screen
        ${isActive ? 'animate-[pulse_6s_cubic-bezier(0.4,0,0.6,1)_infinite]' : ''}`} 
      />
      
      {/* Center Focus (Warm Glow) */}
      <div className={`absolute w-40 h-40 rounded-full border border-orange-300/10 blur-md scale-150
         ${isActive ? 'animate-[ping_4s_cubic-bezier(0,0,0.2,1)_infinite]' : ''}`}
      />
    </div>
  );
};