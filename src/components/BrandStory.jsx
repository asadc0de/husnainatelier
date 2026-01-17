"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { useAnimation } from '../context/AnimationContext';
import storyBg from '../assets/story_wide.png';
import ImageWithLoader from '../components/ImageWithLoader';

gsap.registerPlugin(ScrollTrigger);

const BrandStory = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const { hasPlayedIntro } = useAnimation();

    useEffect(() => {
        if (hasPlayedIntro) {
            if (textRef.current) {
                gsap.set(textRef.current.children, { y: 0, opacity: 1 });
            }
            return;
        }

        // Parallax effect for background
        const bgImage = containerRef.current?.querySelector('.brand-story-img');

        if (bgImage) {
            gsap.fromTo(bgImage,
                { scale: 1.1 },
                {
                    scale: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                }
            );
        }

        // Text fade in
        if (textRef.current) {
            gsap.fromTo(textRef.current.children,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.2,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 60%",
                    }
                }
            );
        }
    }, [hasPlayedIntro]);

    return (
        <section className="w-full py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-5xl font-serif text-black uppercase tracking-widest">
                    The Story
                </h2>
            </div>

            <div ref={containerRef} className="relative w-full h-[85vh] overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <ImageWithLoader
                        src={storyBg}
                        alt="Brand Story"
                        loading="lazy"
                        className="w-full h-full object-cover brand-story-img"
                    />
                    {/* Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Centered Content */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 text-white">
                    <div ref={textRef} className="max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-tight mb-8">
                            Refined craftsmanship meeting <br />
                            <span className="italic">contemporary silhouettes.</span>
                        </h2>
                        <Link href="/shop" className="px-10 py-4 bg-white text-black uppercase tracking-widest text-xs font-bold hover:bg-gray-200 transition-all duration-300 inline-block">
                            Shop
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
