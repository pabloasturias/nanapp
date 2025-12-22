import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out
        }, 2000); // Show for 2 seconds

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="relative w-64 h-64 animate-[float_6s_ease-in-out_infinite]">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-blue-500/20 blur-[50px] rounded-full animate-pulse" />

                <img
                    src="./images/splash.png"
                    alt="nanapp"
                    className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                />
            </div>

            <div className="mt-8 text-center animate-[fade-in_1s_ease-out_0.5s_both]">
                <h1 className="text-3xl font-bold text-orange-50 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-200/60 text-xs font-medium uppercase tracking-[0.3em]">Sound of Sleep</p>
            </div>
        </div>
    );
};
