import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import brandBg from '../assets/lehenga.png';

gsap.registerPlugin(ScrollTrigger);

const BrandStory = () => {
    const contentRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(contentRef.current.children,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 75%",
                }
            }
        );
    }, []);

    return (
        <section className="py-32 bg-[#faf9f6]"> {/* Extremely light warm gray/white */}
            <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center gap-16">

                {/* Image Side (Optional based on design, but let's keep it text focused for now or add a small image)
                    Design showed text on right, image on left typically, or just centered text. 
                    Let's follow "Refined craftsmanship meeting contemporary silhouettes" which looks like a centered block or split.
                    I'll do a Split Layout: Image Left, Text Right as is classic luxury.
                */}

                <div className="w-full md:w-1/2 h-[75vh] md:h-auto md:aspect-[4/5] bg-gray-200 relative overflow-hidden">
                    {/* Placeholder image box */}
                    <img src={brandBg} alt="Atelier detail" className="w-full h-full object-cover opacity-90" />
                </div>

                <div className="w-full md:w-1/2" ref={contentRef}>
                    <p className="text-xs font-sans uppercase tracking-[0.25em] text-gray-500 mb-6">Atelier 2026</p>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-primary leading-tight mb-8">
                        Refined craftsmanship meeting <br />
                        <span className="italic">contemporary silhouettes.</span>
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-10 max-w-md font-sans font-light">
                        Our latest edit explores the intersection of traditional embroidery and stark, modern lines. Handwoven pieces sourced from the heart of the Punjab, tailored for the global woman.
                    </p>
                    <button className="px-10 py-4 border border-primary text-primary uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all duration-300">
                        Explore The Edit
                    </button>
                </div>

            </div>
        </section>
    );
};

export default BrandStory;
