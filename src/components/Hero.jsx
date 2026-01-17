"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useAnimation } from '../context/AnimationContext';
import heroBg from '../assets/hero_wide.png';

const Hero = () => {
    const heroRef = useRef(null);
    const textContainerRef = useRef(null);

    const { hasPlayedIntro, setHasPlayedIntro } = useAnimation();

    useEffect(() => {
        if (hasPlayedIntro) {
            // Skip animation if already played
            if (heroRef.current) {
                gsap.set(heroRef.current, { scale: 1 });
            }
            if (textContainerRef.current) {
                gsap.set(textContainerRef.current.children, { y: 0, opacity: 1 });
            }
            return;
        }

        const tl = gsap.timeline();

        if (heroRef.current) {
            tl.fromTo(heroRef.current,
                { scale: 1.1 },
                { scale: 1, duration: 2, ease: "power2.out" }
            );
        }

        if (textContainerRef.current) {
            tl.fromTo(textContainerRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power3.out",
                    onComplete: () => setHasPlayedIntro(true)
                },
                "-=1.5"
            );
        }
    }, [hasPlayedIntro, setHasPlayedIntro]);

    return (
        <div className="relative h-screen w-full overflow-hidden" data-theme="dark">
            {/* Background Image */}
            <div
                ref={heroRef}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${heroBg.src})`,
                    backgroundPosition: 'top center'
                }}
            >
                {/* Gradient Overlay: Bottom to Top Black */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center text-white z-10 pt-20">
                <div ref={textContainerRef} className="flex flex-col items-center">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif tracking-wide leading-none mb-8">
                        HUSNAIN <br /> ATELIER
                    </h1>
                    <p className="text-sm md:text-base font-sans uppercase tracking-[0.3em] mb-12 text-gray-100">
                        Luxuries custom design for formal and bridal
                    </p>
                    <Link href="/shop" className="px-10 py-3 bg-white text-black text-xs font-sans font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors cursor-pointer inline-block">
                        Shop
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Hero;
