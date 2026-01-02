import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800); // Wait for fade out
        }, 3500); // Extended slightly for the drawing to finish comfortably

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <div className="loader-container mb-8">
                <svg className="loader-svg w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
                    {/* 
                      Geometric Baby Face Construction:
                      Centered at 100,105
                    */}

                    {/* HEAD SHAPE: Main circle, gap at top for curl */}
                    {/* Starts at roughly 1 o'clock (120, 70) and goes around to 11 o'clock (80, 70) */}
                    <path
                        className="svg-icon-path path-face"
                        d="M 125 57 A 65 65 0 1 1 75 57"
                        style={{ animationDelay: '0s' }}
                    />

                    {/* EARS: Perfect semicircles attached to the head sides */}
                    {/* Left Ear attached around x=35 */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 36 105 C 15 105, 15 85, 36 85"
                        transform="rotate(-15, 36, 95)" /* Tweaked angle for cuteness */
                        style={{ animationDelay: '1.2s' }}
                    />
                    {/* Right Ear */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 164 105 C 185 105, 185 85, 164 85"
                        transform="rotate(15, 164, 95)"
                        style={{ animationDelay: '1.2s' }}
                    />

                    {/* CURL: The signature single hair curl at the top */}
                    <path
                        className="svg-icon-path path-face"
                        d="M 100 75 C 95 60, 85 50, 100 45 C 115 40, 120 55, 110 65"
                        style={{ animationDelay: '0.8s' }}
                    />

                    {/* EYES: Symmetrical sleeping arcs */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 65 110 Q 80 95, 95 110"
                        style={{ animationDelay: '1.8s' }}
                    />
                    <path
                        className="svg-icon-path path-features"
                        d="M 105 110 Q 120 95, 135 110"
                        style={{ animationDelay: '1.8s' }}
                    />

                    {/* MOUTH: Gentle smile */}
                    <path
                        className="svg-icon-path path-features"
                        d="M 85 145 Q 100 155, 115 145"
                        style={{ animationDelay: '2.2s' }}
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
