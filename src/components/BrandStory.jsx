import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { useAnimation } from '../context/AnimationContext';
import storyBg from '../assets/story_wide.png';

gsap.registerPlugin(ScrollTrigger);

const BrandStory = () => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    const { hasPlayedIntro } = useAnimation();

    useEffect(() => {
        if (hasPlayedIntro) {
            gsap.set(textRef.current.children, { y: 0, opacity: 1 });
            return;
        }

        // Parallax effect for background (always runs for visual appeal, or can trigger one-time?)
        // Let's keep parallax always running as it's scroll-bound interaction, not an "intro" animation.
        // Actually, user said "animation on full landing page first render work".
        // Usually parallax is fine to keep, but the text fade-in is the "intro".
        gsap.fromTo(containerRef.current.querySelector('img'),
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

        // Text fade in
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
    }, [hasPlayedIntro]);

    return (
        <section ref={containerRef} className="relative w-full h-screen overflow-hidden mt-24">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={storyBg}
                    alt="Brand Story"
                    className="w-full h-full object-cover"
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
                    <Link to="/category/bridal" className="px-10 py-4 bg-white text-black uppercase tracking-widest text-xs font-bold hover:bg-secondary hover:text-white transition-all duration-300 inline-block">
                        Shop
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BrandStory;
