import React from 'react';

interface VisualizerProps {
  isActive: boolean;
  type: 'calm' | 'pulse';
}

export const Visualizer: React.FC<VisualizerProps> = ({ isActive, type }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-[3000ms] ${isActive ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Deep Background Layer */}
      <div className="absolute inset-0 bg-[#020617]" />
      
      {/* Animated Gradient Mesh */}
      <div className={`absolute inset-0 opacity-40 transition-all duration-[5000ms] ${isActive ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.2)_0%,transparent_50%)] animate-[spin_20s_linear_infinite]" />
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_20%_80%,rgba(124,58,237,0.1)_0%,transparent_40%)] animate-[spin_25s_linear_infinite_reverse]" />
      </div>

      {/* Primary Breathing Light (Core) */}
      <div className={`absolute w-[600px] h-[600px] rounded-full bg-orange-400/5 blur-[120px] 
        ${isActive ? 'animate-[pulse_10s_ease-in-out_infinite]' : ''}`} 
      />
      
      {/* Secondary Organic Orbs */}
      <div className={`absolute top-[10%] left-[20%] w-80 h-80 rounded-full bg-indigo-500/10 blur-[100px] mix-blend-plus-lighter
        ${isActive ? 'animate-[bounce_15s_infinite]' : ''}`} 
      />

      <div className={`absolute bottom-[15%] right-[10%] w-96 h-96 rounded-full bg-orange-300/10 blur-[130px] mix-blend-plus-lighter
        ${isActive ? 'animate-[pulse_12s_ease-in-out_infinite_reverse]' : ''}`} 
      />
      
      {/* Dust / Stars Particles */}
      {isActive && (
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full blur-[1px] animate-[float_var(--d)_ease-in-out_infinite]"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                '--d': `${5 + Math.random() * 10}s`,
                animationDelay: `${Math.random() * 5}s`
              } as any}
            />
          ))}
        </div>
      )}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,rgba(2,6,23,0.8)_100%)]" />
    </div>
  );
};