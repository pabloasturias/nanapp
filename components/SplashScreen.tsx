import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade out
        }, 3000); // Show for 3 seconds (timed to match animation completion before loop reset)

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="loader-container mb-8">
                <svg className="loader-svg w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    <path className="svg-icon-path path-face" d="M100 55 C 105 55, 110 50, 110 45 C 110 35, 95 35, 95 45 C 95 50, 98 55, 100 58 C 80 60, 60 80, 60 110 C 60 115, 50 115, 50 125 C 50 135, 60 135, 60 130 C 60 160, 80 180, 100 180 C 120 180, 140 160, 140 130 C 140 135, 150 135, 150 125 C 150 115, 140 115, 140 110 C 140 80, 120 60, 100 58" />
                    <path className="svg-icon-path path-features" d="M75 120 Q 85 110, 95 120" />
                    <path className="svg-icon-path path-features" d="M125 120 Q 135 110, 145 120" />
                    <path className="svg-icon-path path-features" d="M90 150 Q 100 160, 110 150" />
                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_0.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
