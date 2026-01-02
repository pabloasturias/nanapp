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
                      Refined Baby Face - "Melon Shape" + Integrated Ears 
                      Style: Single continuous stroke outline, thin constant weight, golden #D4AF37
                    */}

                    {/* 
                       THE SILHOUETTE
                       Starts at top center (gap for curl), curves smoothly into ears, then down to chin.
                       Using Bezier curves to ensure the "seamless flow" from cheeks to ears.
                    */}
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
                        /* 
                           Explanation of points:
                           1. Start Top-Rightish (110,45) - Gap for curl
                           2. Curve to Right Ear Top (150,80)
                           3. Right Ear Loop (out to 182,105, back to 152,128) - "Flows seamlessly"
                           4. Right Cheek to Chin (100,175) is handled by the curve from 152,128
                              Wait, standard cubic bezier from 152,128 to 100,175 might need control points.
                              Adjusted control points in path d above for smoother melon shape.
                        */
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* THE CURL - Stylized spiral at top center */}
                    <path
                        className="svg-icon-path path-face"
                        d="M 100 65 C 90 55, 90 35, 100 30 C 110 30, 110 50, 100 55"
                        style={{ animationDelay: '0.5s' }}
                    />

                    {/* FEATURES - Minimalist */}

                    {/* Eyebrows - Simple high arcs */}
                    <path className="svg-icon-path path-features" d="M 65 95 Q 75 90, 85 95" />
                    <path className="svg-icon-path path-features" d="M 115 95 Q 125 90, 135 95" />

                    {/* Eyes - Sleeping arcs (Inverse U) */}
                    <path className="svg-icon-path path-features" d="M 68 115 Q 75 120, 82 115" />
                    <path className="svg-icon-path path-features" d="M 118 115 Q 125 120, 132 115" />

                    {/* Nose - Tiny curve/dot */}
                    <path className="svg-icon-path path-features" d="M 98 128 Q 100 130, 102 128" />

                    {/* Mouth - Small smile */}
                    <path className="svg-icon-path path-features" d="M 85 145 Q 100 152, 115 145" />

                </svg>
            </div>

            <div className="text-center animate-[fade-in_1s_ease-out_1.5s_both]">
                <h1 className="text-3xl font-bold text-orange-500 font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                <p className="text-orange-400 text-xs font-medium uppercase tracking-[0.3em]">the sound of silence</p>
            </div>
        </div>
    );
};
