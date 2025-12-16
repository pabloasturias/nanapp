import React from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';

export const ReloadPrompt: React.FC = () => {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (!offlineReady && !needRefresh) return null;

    return (
        <div className="fixed bottom-24 left-4 right-4 z-[60] flex justify-center animate-[slide-up_0.3s_ease-out]">
            <div className="bg-slate-900/90 backdrop-blur-md border border-indigo-500/30 p-4 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-4 max-w-sm w-full">
                <div className="flex-1">
                    {offlineReady ? (
                        <div className="text-sm text-slate-300">
                            <span className="font-bold text-emerald-400">¡App lista offline!</span>
                            <br /> Funciona sin internet.
                        </div>
                    ) : (
                        <div className="text-sm text-white">
                            <span className="font-bold text-indigo-400">Nueva versión disponible</span>
                            <br /> <span className="text-xs text-slate-400">Actualiza para ver el contenido nuevo.</span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    {needRefresh && (
                        <button
                            className="bg-indigo-500 hover:bg-indigo-600 active:scale-95 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                            onClick={() => updateServiceWorker(true)}
                        >
                            <RefreshCw size={14} className="animate-spin-slow" />
                            Actualizar
                        </button>
                    )}
                    <button
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                        onClick={close}
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
