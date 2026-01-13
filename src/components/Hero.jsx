import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import heroBg from '../assets/Pakistani Coord Kurtas.jpg';

const Hero = () => {
    const heroRef = useRef(null);
    const textContainerRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(heroRef.current,
            { scale: 1.1 },
            { scale: 1, duration: 2, ease: "power2.out" }
        )
            .fromTo(textContainerRef.current.children,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power3.out" },
                "-=1.5"
            );
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Background Image */}
            <div
                ref={heroRef}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    backgroundPosition: 'top center'
                }}
            >
                {/* Gradient Overlay: Bottom to Top Black */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center text-white z-10 pt-20">
                <div ref={textContainerRef} className="flex flex-col items-center">
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-wide leading-none mb-8">
                        HUSNAIN <br /> ATELIER
                    </h1>
                    <p className="text-sm md:text-base font-sans uppercase tracking-[0.3em] mb-12 text-gray-100">
                        Luxuries custom design for formal and bridal
                    </p>
                    <button className="px-10 py-3 bg-white text-primary rounded-full text-xs font-sans font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors">
                        Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
