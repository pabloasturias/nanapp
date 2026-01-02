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
                    {/* 
                       Redesigned "Zen Baby" - Minimalist & Premium
                       Inspired by modern line art icons (e.g. Noun Project, Oura aesthetics).
                       
                       Key Changes to fix "Monkey" look:
                       1. REMOVED side poking ears (main cause of primate look).
                       2. Increased forehead ratio (Kindchenschema: huge forehead = cute baby).
                       3. Features are tiny and placed lower on the face.
                       4. "Curl" is sleek and integrated.
                    */}

                    {/* HEAD SHAPE: Pure, smooth, slightly weighted at bottom for cheeks. No ears. */}
                    <path
                        className="svg-icon-path path-face"
                        d="
                           M 100 35
                           C 145 35, 175 70, 175 110
                           C 175 155, 145 185, 100 185
                           C 55 185, 25 155, 25 110
                           C 25 70, 55 35, 100 35
                           Z
                        "
                        /* A slightly modified circle, wider at cheeks? 
                           Let's stick to a near-perfect super-ellipse for maximum premium feel.
                        */
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* THE CURL: Floating floating elegantly above/on forehead */}
                    <path
                        className="svg-icon-path path-face"
                        d="M 100 35 C 100 35, 90 20, 105 15 C 115 12, 120 25, 110 32"
                        strokeLinecap="round"
                        style={{ animationDelay: '0.5s' }}
                    />

                    {/* FEATURES: Placed LOWER (y=120+) to emphasize forehead */}

                    {/* Eyes: Gentle peaceful arches. Not too wide. */}
                    {/* Left Eye */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 70 115 Q 80 105, 90 115"
                        strokeLinecap="round"
                    />

                    {/* Right Eye */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 110 115 Q 120 105, 130 115"
                        strokeLinecap="round"
                    />

                    {/* Mouth: Tiny, subtle smile. High up near eyes to be cute. */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 92 135 Q 100 140, 108 135"
                        strokeLinecap="round"
                    />

                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
