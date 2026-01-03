import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800);
        }, 3600); // 4s animation cycle roughly, wait nearly a full cycle

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="loader-container mb-8">
                <svg className="loader-svg w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path className="baby-icon-path draw-outline"
                        d="
             M 50 20 
             Q 56 12, 56 18 T 50 23 
             C 35 23, 22 35, 22 50
             C 18 50, 18 60, 22 60
             C 25 80, 40 90, 50 90
             C 60 90, 75 80, 78 60
             C 82 60, 82 50, 78 50
             C 78 35, 65 23, 50 23
          " />

                    <path className="baby-icon-path draw-features" d="M 35 40 Q 40 35, 45 40" />
                    <path className="baby-icon-path draw-features" d="M 55 40 Q 60 35, 65 40" />

                    <path className="baby-icon-path draw-features" d="M 38 48 Q 40 46, 42 48" />
                    <path className="baby-icon-path draw-features" d="M 58 48 Q 60 46, 62 48" />

                    <path className="baby-icon-path draw-features" d="M 48 58 Q 50 60, 52 58" />

                    <path className="baby-icon-path draw-features" d="M 42 68 Q 50 75, 58 68" />
                    <path className="baby-icon-path draw-features" d="M 48 78 Q 50 80, 52 78" />
                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
