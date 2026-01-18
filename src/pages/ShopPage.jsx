"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useProduct } from '../context/ProductContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageWithLoader from '../components/ImageWithLoader';
import LoadingSpinner from '../components/LoadingSpinner';

gsap.registerPlugin(ScrollTrigger);

const ShopPage = () => {
    const { products } = useProduct();
    const [visibleCount, setVisibleCount] = useState(12);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const loaderRef = useRef(null);
    const gridRef = useRef(null);

    // Filter available products (if needed) - currently showing all sorted by latest (from context)
    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    useEffect(() => {
        // Animation for the grid on first load
        if (visibleCount === 12 && gridRef.current) {
            gsap.fromTo(gridRef.current,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }
            );
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                console.log(target.isIntersecting, hasMore, isLoadingMore);
                if (target.isIntersecting && hasMore && !isLoadingMore) {
                    setIsLoadingMore(true);
                    // Simulate network delay or just load
                    setTimeout(() => {
                        setVisibleCount(prev => prev + 12);
                        setIsLoadingMore(false);
                    }, 500); // Small delay for UX to show spinner
                }
            },
            {
                root: null,
                rootMargin: '100px', // Load before reaching the very bottom
                threshold: 0.1,
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, isLoadingMore]);


    return (
        <div className="min-h-screen pt-32 pb-16 w-full bg-[#FFF7E4]">

            {/* Page Header */}
            <div className="text-center mb-20 px-4">
                <h1 className="font-serif text-4xl md:text-6xl text-primary mb-6">Shop All</h1>
                <p className="font-sans text-sm tracking-[0.2em] text-gray-500 uppercase max-w-xl mx-auto">
                    Explore our complete range of bespoke designs, from bridal masterpieces to modern essentials.
                </p>
            </div>

            {/* Product Grid - Unified */}
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                {visibleProducts.map((product) => (
                    <Link
                        href={`/product/${product.id}`}
                        key={product.id}
                        className="group cursor-pointer block"
                    >
                        <div className="relative overflow-hidden aspect-[3/4] mb-4 bg-gray-100">
                            <ImageWithLoader
                                src={product.image}
                                alt={product.name}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        <div className="flex justify-between items-baseline px-4 pb-8">
                            <h3 className="font-serif text-lg text-primary group-hover:text-gray-600 transition-colors">{product.name}</h3>
                            <p className="font-sans text-sm tracking-widest text-gray-500">{product.price}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Loading Indicator / Observer Target */}
            {hasMore && (
                <div ref={loaderRef} className="flex justify-center mt-12 mb-8">
                    <LoadingSpinner />
                </div>
            )}

            {/* End of List Message */}
            {!hasMore && products.length > 0 && (
                <div className="text-center mt-12 mb-8 text-gray-400">
                    <p className="font-serif italic text-sm">You've reached the end of the collection.</p>
                </div>
            )}

            {products.length === 0 && (
                <div className="text-center mt-12 mb-8 text-gray-400">
                    <p className="font-serif italic text-sm">No products found.</p>
                </div>
            )}

            {/* Bottom Call to Action */}
            <div className="mt-20 text-center px-4">
                <p className="font-serif text-2xl mb-8 italic text-gray-400">Looking for something specific?</p>
                <div className="flex flex-wrap justify-center gap-4">
                    {[...new Set(products.map(p => p.category))].slice(0, 5).map(cat => (
                        <Link key={cat} href={`/category/${cat.toLowerCase()}`} className="px-6 py-3 border border-black/20 text-black text-xs font-bold uppercase tracking-widest hover:border-black hover:bg-black hover:text-white transition-colors">
                            {cat}
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ShopPage;
