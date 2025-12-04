import React from 'react';
import { X, Brain, Ear, Shield, Moon, ShoppingBag, ExternalLink, ArrowRight, Package, HeartHandshake } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- CONFIGURACIÓN DE AFILIADOS (AWIN) ---
// Sustituye 'url' por tus Deep Links generados en el panel de Awin
const PRODUCTS = [
    {
        id: 1,
        name: "Humidificador Ultrasónico",
        desc: "Mantiene la humedad ideal para evitar sequedad nasal.",
        url: "https://www.awin1.com/cread.php?awinmid=YOUR_ID&awinaffid=YOUR_ID&clickref=nanapp_humidifier", 
        icon: "💧"
    },
    {
        id: 2,
        name: "Saco de Dormir Bebé",
        desc: "Más seguro que las mantas sueltas, temperatura constante.",
        url: "https://www.awin1.com/cread.php?awinmid=YOUR_ID&awinaffid=YOUR_ID&clickref=nanapp_sleepsack",
        icon: "😴" 
    },
    {
        id: 3,
        name: "Swaddle (Arrullo)",
        desc: "Evita el reflejo de Moro y recrea la presión del útero.",
        url: "https://www.awin1.com/cread.php?awinmid=YOUR_ID&awinaffid=YOUR_ID&clickref=nanapp_swaddle",
        icon: "🌯"
    },
    {
        id: 4,
        name: "Fular Portabebés",
        desc: "Calma inmediata gracias al contacto piel con piel.",
        url: "https://www.awin1.com/cread.php?awinmid=YOUR_ID&awinaffid=YOUR_ID&clickref=nanapp_carrier",
        icon: "🦘"
    },
    {
        id: 5,
        name: "Luz Nocturna Roja",
        desc: "Ilumina sin interrumpir la producción de melatonina.",
        url: "https://www.awin1.com/cread.php?awinmid=YOUR_ID&awinaffid=YOUR_ID&clickref=nanapp_redlight",
        icon: "💡"
    }
];

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-stone-900/90 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-[scale-in_0.3s_ease-out] flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-orange-900/50 to-stone-800/50 p-6 pb-8">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-xl text-white shadow-lg">
                        <Brain size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white leading-tight">Ciencia del Sueño</h2>
                        <p className="text-xs text-orange-200 font-medium uppercase tracking-wider mt-1">Métodos probados</p>
                    </div>
                </div>
                <button 
                    onClick={onClose}
                    className="p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 -mt-4 bg-stone-900 rounded-t-3xl border-t border-white/5 space-y-8">
            
            {/* --- Educational Content: Ruido Blanco --- */}
            <div className="space-y-6">
                <div className="flex gap-4">
                    <div className="mt-1 text-teal-400 shrink-0"><Ear size={20} /></div>
                    <div>
                        <h3 className="text-stone-200 font-bold mb-1">Efecto "Vientre Materno"</h3>
                        <p className="text-sm text-stone-400 leading-relaxed">
                            El útero es ruidoso (aprox. 90dB). El silencio asusta a los recién nacidos. El ruido blanco imita ese confort sonoro familiar y enmascara ruidos bruscos.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Educational Content: Técnicas Adicionales --- */}
            <div className="space-y-6 pt-4 border-t border-stone-800">
                <h3 className="text-orange-300 text-xs font-bold uppercase tracking-wider mb-2">Otras Técnicas de Relajación</h3>
                
                {/* Swaddling */}
                <div className="flex gap-4">
                    <div className="mt-1 text-indigo-400 shrink-0"><Package size={20} /></div>
                    <div>
                        <h3 className="text-stone-200 font-bold mb-1">Swaddling (Envoltura)</h3>
                        <p className="text-sm text-stone-400 leading-relaxed">
                            Envolver al bebé firmemente (pero con espacio para caderas) evita que el <strong>Reflejo de Moro</strong> (sobresalto involuntario) lo despierte, recreando la contención del útero.
                        </p>
                    </div>
                </div>

                {/* Porteo */}
                <div className="flex gap-4">
                    <div className="mt-1 text-rose-400 shrink-0"><HeartHandshake size={20} /></div>
                    <div>
                        <h3 className="text-stone-200 font-bold mb-1">Porteo Ergonómico</h3>
                        <p className="text-sm text-stone-400 leading-relaxed">
                            El contacto piel con piel regula la temperatura y el ritmo cardíaco del bebé. El movimiento al caminar lo mece naturalmente, calmando el llanto en minutos.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- Affiliate Section (Awin) --- */}
            <div className="pt-6 border-t border-stone-800">
                <div className="flex items-center gap-2 mb-4">
                    <ShoppingBag className="text-orange-400" size={18} />
                    <h3 className="text-stone-200 font-bold">Nuestros Favoritos</h3>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                    {PRODUCTS.map((product) => (
                        <a 
                            key={product.id}
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer nofollow" // Important for Affiliate Links
                            className="group flex items-center gap-4 p-3 rounded-xl bg-stone-800 border border-stone-700 hover:border-orange-500/50 hover:bg-stone-800/80 transition-all active:scale-[0.98]"
                        >
                            <div className="w-10 h-10 flex items-center justify-center bg-stone-900 rounded-lg text-xl border border-white/5 shrink-0">
                                {product.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-stone-200 truncate group-hover:text-orange-200 transition-colors">
                                    {product.name}
                                </h4>
                                <p className="text-[11px] text-stone-500 truncate">
                                    {product.desc}
                                </p>
                            </div>
                            <ExternalLink size={16} className="text-stone-500 group-hover:text-orange-400 transition-colors" />
                        </a>
                    ))}
                </div>
                <p className="text-[9px] text-stone-600 mt-3 text-center">
                    * Recomendaciones independientes. Algunos enlaces pueden generar comisiones.
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};