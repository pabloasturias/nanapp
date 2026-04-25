import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const SplashScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 800);
        }, 3500); // slightly longer to appreciate the animation

        return () => clearTimeout(timer);
    }, [onComplete]);

    const containerVariants = {
        hidden: { opacity: 1 },
        exit: { 
            opacity: 0, 
            scale: 1.1,
            transition: { duration: 0.8, ease: "easeInOut" } 
        }
    };

    const logoVariants = {
        hidden: { scale: 0.5, opacity: 0, rotate: -20 },
        visible: { 
            scale: 1, 
            opacity: 1, 
            rotate: 0,
            transition: { 
                type: "spring", 
                stiffness: 100, 
                damping: 20, 
                duration: 1.2 
            } 
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                delay: 0.5, 
                duration: 0.8, 
                ease: "easeOut" 
            } 
        }
    };

    const subtitleVariants = {
        hidden: { opacity: 0, letterSpacing: "0.1em" },
        visible: { 
            opacity: 1, 
            letterSpacing: "0.3em",
            transition: { 
                delay: 1.2, 
                duration: 1, 
                ease: "easeOut" 
            } 
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    exit="exit"
                    className="fixed inset-0 z-[200] bg-[#0A0F1C] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background glow effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

                    <motion.div 
                        variants={logoVariants}
                        initial="hidden"
                        animate="visible"
                        className="mb-8 w-[160px] h-[160px] relative flex items-center justify-center"
                    >
                        {/* Outer rotating ring */}
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-full border border-orange-200/10 border-t-orange-300/40"
                        />
                        <motion.div 
                            animate={{ rotate: -360 }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-4 rounded-full border border-indigo-200/10 border-b-indigo-400/30"
                        />

                        {/* App Logo */}
                        <motion.img 
                            src="/app_logo.png"
                            alt="nanapp logo"
                            animate={{ 
                                filter: ["drop-shadow(0 0 10px rgba(253,186,116,0.2))", "drop-shadow(0 0 30px rgba(253,186,116,0.5))", "drop-shadow(0 0 10px rgba(253,186,116,0.2))"] 
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="w-[100px] h-[100px] z-10 rounded-full object-cover shadow-2xl border border-white/5"
                        />
                    </motion.div>

                    <div className="text-center relative z-10">
                        <motion.h1 
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-4xl font-bold text-white font-['Quicksand'] mb-2 tracking-tight drop-shadow-lg"
                        >
                            nanapp
                        </motion.h1>
                        <motion.p 
                            variants={subtitleVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-[10px] font-medium uppercase text-orange-200/80 drop-shadow-md"
                        >
                            the sound of silence
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
