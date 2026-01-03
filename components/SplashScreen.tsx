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
                {/* 
                    Exact recreation of the uploaded Baby Face Icon.
                    ViewBox 0 0 100 100 for easier coordinate mapping.
                */}
                <svg className="loader-svg w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">

                    {/* 
                        HEAD OUTLINE:
                        Starts to the left of the top curl, goes CCW around to the right of the curl.
                        Circular shape centered approx at 50,55.
                    */}
                    <path
                        className="baby-icon-path draw-outline"
                        d="M 46 26
                           A 33 33 0 1 0 54 26"
                    />

                    {/*
                        EARS:
                        Attached to the sides of the head circle.
                        Located roughly at y=55.
                        Left Ear: x=17
                        Right Ear: x=83
                    */}
                    {/* Left Ear */}
                    <path
                        className="baby-icon-path draw-features"
                        d="M 17 55 C 14 55, 14 45, 17 45"
                        transform="rotate(-10, 17, 50) translate(2, 4)"
                    />
                    {/* Actually, let's draw them ON the path coordinates to be safer */}
                    <path className="baby-icon-path draw-outline" d="M 18 52 C 12 52, 12 62, 18 62" />
                    <path className="baby-icon-path draw-outline" d="M 82 52 C 88 52, 88 62, 82 62" />


                    {/* 
                        CURL:
                        A spiral spring starting from the top center gap.
                    */}
                    <path
                        className="baby-icon-path draw-outline"
                        d="M 50 33 
                           C 50 25, 56 22, 54 18
                           C 52 15, 48 18, 48 20
                           C 48 22, 52 22, 52 20"
                    />

                    {/* 
                        EYES:
                        Happy closed eyes (inverted Arches).
                        Centered around y=55.
                    */}
                    <path className="baby-icon-path draw-features" d="M 35 55 Q 40 48, 45 55" />
                    <path className="baby-icon-path draw-features" d="M 55 55 Q 60 48, 65 55" />

                    {/* 
                        MOUTH:
                        Simple smile below eyes.
                    */}
                    <path className="baby-icon-path draw-features" d="M 42 70 Q 50 78, 58 70" />

                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
