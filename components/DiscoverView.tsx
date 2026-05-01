import React from 'react';
import { ProductsView } from './ProductsView';

export const DiscoverView: React.FC = () => {
    return (
        <div className="flex-1 min-h-0 flex flex-col h-full bg-slate-950 pb-8">
            <ProductsView />
        </div>
    );
};
