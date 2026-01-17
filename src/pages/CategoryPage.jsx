"use client";

import React, { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useProduct } from '../context/ProductContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageWithLoader from '../components/ImageWithLoader';

gsap.registerPlugin(ScrollTrigger);

const CategoryPage = () => {
    const { category } = useParams();
    const { products } = useProduct();
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const gridRef = useRef(null);

    // Filter products (case-insensitive)
    const filteredProducts = products.filter(p =>
        p.category.toLowerCase() === category.toLowerCase()
    );

    useEffect(() => {
        // Animation on mount
        const tl = gsap.timeline();

        tl.fromTo(titleRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        );
    }, [category]); // Re-run animation when category changes

    return (
        <div ref={containerRef} className="min-h-screen pt-32 pb-16 w-full bg-[#FFF7E4]">
            {/* Header */}
            <div className="text-center mb-16">
                <span className="text-xs font-sans tracking-[0.3em] uppercase text-gray-500 mb-4 block">Collection</span>
                <h1 ref={titleRef} className="font-serif text-4xl md:text-6xl text-primary capitalize">
                    {category}
                </h1>
            </div>

            {/* Product Grid */}
            <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
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
                    ))
                ) : (
                    <div className="col-span-full h-64 flex flex-col justify-center items-center text-gray-400">
                        <p className="font-sans text-lg tracking-widest uppercase mb-4">No Items Found</p>
                        <p className="font-serif italic">This collection is currently being curated.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
