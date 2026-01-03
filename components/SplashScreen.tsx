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
                <svg className="loader-svg w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* SVG Based on User Uploaded Image 
                        Line Color: Orange (#f97316) set in CSS
                        Background: Dark Blue (#0f172a) from parent div
                    */}

                    {/* HEAD: Open at top for curl. Round shape. */}
                    {/* Starts at 1 o'clock, goes round to 11 o'clock */}
                    <path
                        className="baby-icon-path draw-outline"
                        d="M 120 50 A 70 70 0 1 1 80 50"
                    />

                    {/* EARS: Simple semicircles on sides */}
                    <path
                        className="baby-icon-path draw-outline"
                        d="M 30 100 C 20 100, 20 80, 30 80"
                        transform="rotate(-15, 30, 90)" /* Adjust to fit head curve better */
                        style={{ display: 'none' }} /* The path A command above puts it at x~30? No. */
                    />

                    {/* EARS RE-IMPLEMENTATION: Attached to head path visually */}
                    {/* Left Ear */}
                    <path className="baby-icon-path draw-features" d="M 32 105 C 15 105, 15 75, 32 75" />

                    {/* Right Ear */}
                    <path className="baby-icon-path draw-features" d="M 168 105 C 185 105, 185 75, 168 75" />


                    {/* CURL: Spiral at top */}
                    <path
                        className="baby-icon-path draw-outline"
                        d="M 100 70 C 90 60, 90 40, 100 35 C 110 30, 120 40, 110 50"
                    />

                    {/* EYES: Happy Arcs (Inverted U) */}
                    <path className="baby-icon-path draw-features" d="M 65 110 Q 80 95, 95 110" />
                    <path className="baby-icon-path draw-features" d="M 105 110 Q 120 95, 135 110" />

                    {/* MOUTH: Small Smile */}
                    <path className="baby-icon-path draw-features" d="M 85 140 Q 100 155, 115 140" />

                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
