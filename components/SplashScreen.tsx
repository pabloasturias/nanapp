import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800);
        }, 3600);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="loader-container mb-8">
                <svg className="loader-svg w-full h-full" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <gStroke stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">

                        {/* Main Contour: Continuous line from Curl -> Head -> Ears */}
                        <path
                            id="main-contour"
                            className="draw-outline"
                            stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"
                            d="M 52 22 C 55 22, 56 17, 51 17 C 47 17, 48 24, 50 25 C 33 25, 20 37, 20 53 C 16 53, 16 62, 20 62 C 23 82, 38 92, 50 92 C 62 92, 77 82, 80 62 C 84 62, 84 53, 80 53 C 80 37, 67 25, 50 25"
                        />

                        {/* Features Group: Eyes and Mouth */}
                        <g id="features" className="draw-features" stroke="#f97316" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M 35 45 C 38 41, 44 41, 47 45" />
                            <path d="M 53 45 C 56 41, 62 41, 65 45" />
                            <path d="M 40 65 C 45 72, 55 72, 60 65" />
                        </g>

                    </gStroke>
                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
