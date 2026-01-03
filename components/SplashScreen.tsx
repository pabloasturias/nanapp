import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800);
        }, 3500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="loader-container mb-8">
                <svg className="loader-svg w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">

                    <path className="baby-icon-path draw-outline"
                        d="M 50 22 
                             C 55 22, 56 16, 50 16 
                             C 45 16, 48 24, 50 25 
                             C 70 25, 75 40, 75 48 
                             C 82 48, 82 58, 75 58 
                             C 75 75, 65 85, 50 85 
                             C 35 85, 25 75, 25 58 
                             C 18 58, 18 48, 25 48 
                             C 25 40, 30 25, 50 25" />

                    <path className="baby-icon-path draw-features" d="M 38 45 Q 42 40, 46 45" />
                    <circle className="baby-icon-path draw-features" cx="42" cy="48" r="1.5" style={{ fill: '#D4AF37' }} />

                    <path className="baby-icon-path draw-features" d="M 54 45 Q 58 40, 62 45" />
                    <circle className="baby-icon-path draw-features" cx="58" cy="48" r="1.5" style={{ fill: '#D4AF37' }} />

                    <path className="baby-icon-path draw-features" d="M 48 55 Q 50 56, 52 55" />
                    <path className="baby-icon-path draw-features" d="M 45 65 Q 50 70, 55 65" />
                    <path className="baby-icon-path draw-features" d="M 48 70 Q 50 72, 52 70" />
                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
