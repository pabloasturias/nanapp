import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade out
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="loader-container mb-8">
                <svg className="loader-svg w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    {/* Face Outline with Hair Curl - Continuous elegant line */}
                    {/* Starts at top, does a curl, then traces the face circle */}
                    <path
                        className="svg-icon-path path-face"
                        d="M 100 30 
                           C 110 5, 130 15, 115 32 
                           C 155 35, 175 70, 175 105 
                           C 175 150, 145 180, 100 180 
                           C 55 180, 25 150, 25 105 
                           C 25 70, 45 35, 85 32"
                    />

                    {/* Sleeping Eyes - Arched downwards for relaxation */}
                    <path className="svg-icon-path path-features" d="M 65 110 Q 80 100, 95 110" />
                    <path className="svg-icon-path path-features" d="M 105 110 Q 120 100, 135 110" />

                    {/* Small Smile */}
                    <path className="svg-icon-path path-features" d="M 85 140 Q 100 150, 115 140" />
                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_0.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
