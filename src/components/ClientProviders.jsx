"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import SearchOverlay from './SearchOverlay';
import { AnimationProvider } from '../context/AnimationContext';
import { CartProvider } from '../context/CartContext';
import { SearchProvider } from '../context/SearchContext';
import { ProductProvider } from '../context/ProductContext';

export default function ClientProviders({ children }) {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <ProductProvider>
            <SearchProvider>
                <CartProvider>
                    <AnimationProvider>
                        <CartDrawer />
                        <SearchOverlay />
                        <div className="min-h-screen flex flex-col justify-between">
                            <Navbar />
                            {children}
                            <Footer />
                        </div>
                    </AnimationProvider>
                </CartProvider>
            </SearchProvider>
        </ProductProvider>
    );
}
