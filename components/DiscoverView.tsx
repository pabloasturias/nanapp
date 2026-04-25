import React from 'react';
import { ProductsView } from './ProductsView';

export const DiscoverView: React.FC = () => {
    // Simply render the ProductsView (Resources) as the sole Discover view, per requirements.
    return (
        <div className="flex-1 min-h-0 flex flex-col h-full bg-slate-950">
            <ProductsView />
        </div>
    );
};
