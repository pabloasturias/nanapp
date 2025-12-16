import React from 'react';
import { Product } from '../types';
import { ExternalLink, ShoppingBag } from 'lucide-react';

interface ProductCardProps {
    product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const isClickable = product.url && product.url !== '#' && product.url.trim() !== '';

    return (
        <a
            href={isClickable ? product.url : undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={`
                group relative flex flex-col p-5 rounded-3xl border border-white/5 
                transition-all duration-300
                ${isClickable
                    ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/30 cursor-pointer active:scale-95'
                    : 'bg-white/5 opacity-80 cursor-default'}
            `}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="text-3xl p-2 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    {product.icon}
                </div>
                {isClickable && (
                    <ExternalLink size={16} className="text-slate-500 group-hover:text-indigo-300 transition-colors" />
                )}
            </div>

            <h3 className="text-orange-50 font-bold text-lg mb-1 leading-tight group-hover:text-indigo-200 transition-colors">
                {product.name}
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                {product.desc}
            </p>

            {isClickable && (
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                    <ShoppingBag size={14} />
                    <span>Ver en Tienda</span>
                </div>
            )}
        </a>
    );
};
