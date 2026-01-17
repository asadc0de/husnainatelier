"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useAnimation } from '../context/AnimationContext';
import { useProduct } from '../context/ProductContext'; // Import context
import ImageWithLoader from '../components/ImageWithLoader';

gsap.registerPlugin(ScrollTrigger);

const NewArrivals = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const viewAllRef = useRef(null);
    const cardsRef = useRef([]);

    const { products } = useProduct(); // Get products from context
    const displayedProducts = products.slice(0, 4); // Display first 4

    const { hasPlayedIntro } = useAnimation();

    useEffect(() => {
        if (hasPlayedIntro) {
            // Skip animation, show content immediately
            if (titleRef.current) gsap.set(titleRef.current, { x: 0, opacity: 1 });
            if (viewAllRef.current) gsap.set(viewAllRef.current, { x: 0, opacity: 1 });
            if (cardsRef.current && cardsRef.current.length > 0) {
                gsap.set(cardsRef.current, { y: 0, opacity: 1 });
            }
            return;
        }

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        if (titleRef.current) {
            tl.fromTo(titleRef.current,
                { x: -30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
            );
        }

        if (viewAllRef.current) {
            tl.fromTo(viewAllRef.current,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "<"
            );
        }

        if (cardsRef.current && cardsRef.current.length > 0) {
            tl.fromTo(cardsRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.4"
            );
        }
    }, [hasPlayedIntro, products]);

    return (
        <section ref={containerRef} className="py-16 bg-[#FFF7E4]">
            <div className="w-full">
                <div className="flex justify-between items-end mb-10 px-8">
                    <h2 ref={titleRef} className="text-3xl md:text-4xl font-serif text-primary">
                        New Arrivals
                    </h2>
                    <Link
                        ref={viewAllRef}
                        href="/category/modern"
                        className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
                    >
                        View all pieces
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                    {displayedProducts.map((product, index) => (
                        <Link
                            href={`/product/${product.id}`}
                            key={product.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group cursor-pointer block"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-6">
                                <ImageWithLoader
                                    src={product.image}
                                    alt={product.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            </div>
                            <div className="flex justify-between items-baseline px-4 pb-8">
                                <h3 className="font-serif text-lg text-primary">{product.name}</h3>
                                <p className="font-sans text-sm tracking-widest text-gray-500">{product.price}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
