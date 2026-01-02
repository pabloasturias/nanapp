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
                <svg className="loader-svg w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    {/* Face Outline - Melon Shape with Ears */}
                    <path
                        className="svg-icon-path path-face"
                        d="
                           M 110 45                   
                           C 135 45, 148 65, 150 80   
                           C 165 80, 182 85, 182 105   
                           C 182 125, 165 130, 152 128 
                           C 148 160, 125 175, 100 175 
                           C 75 175, 52 160, 48 128    
                           C 35 130, 18 125, 18 105    
                           C 18 85, 35 80, 50 80       
                           C 52 65, 65 45, 90 45
                        "
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Curl */}
                    <path
                        className="svg-icon-path path-face"
                        d="M 100 65 C 90 55, 90 35, 100 30 C 110 30, 110 50, 100 55"
                        style={{ animationDelay: '0.5s' }}
                    />

                    {/* 
                       FEATURES - Laughing Expression 
                       Eyes: Inverted U (∩) for happy closing eyes
                       Mouth: Broad smile
                    */}

                    {/* Left Eye (Happy Inverted U) */}
                    <path className="svg-icon-path path-features" d="M 65 115 Q 75 100, 85 115" />

                    {/* Right Eye (Happy Inverted U) */}
                    <path className="svg-icon-path path-features" d="M 115 115 Q 125 100, 135 115" />

                    {/* Tiny Nose (kept as it adds center balance) */}
                    <path className="svg-icon-path path-features" d="M 98 130 Q 100 132, 102 130" />

                    {/* Big Happy Smile */}
                    <path className="svg-icon-path path-features" d="M 75 145 Q 100 160, 125 145" />

                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
