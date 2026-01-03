import React, { useEffect, useState } from 'react';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    if (!isVisible) return null;

    return (
        <div className={`fixed inset-0 z-[200] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-800 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* 
                Icon Container
                Color Updated: #fec76f (Light Orange/Gold)
            */}
            <div
                className="mb-8 w-[180px] h-[180px] animate-[pulse_3s_ease-in-out_infinite]"
                style={{
                    backgroundColor: '#fec76f',
                    maskImage: 'url("/icons/icon-splash.png")',
                    maskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    WebkitMaskImage: 'url("/icons/icon-splash.png")',
                    WebkitMaskSize: 'contain',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center'
                }}
            />

            <div className="text-center animate-[fade-in_1s_ease-out_0.5s_both]">
                {/* Text 1: White */}
                <h1 className="text-3xl font-bold text-white font-['Quicksand'] mb-2 tracking-tight">nanapp</h1>
                {/* Text 2: #fec76f */}
                <p className="text-[10px] font-medium uppercase tracking-[0.3em]" style={{ color: '#fec76f' }}>the sound of silence</p>
            </div>
        </div>
    );
};
