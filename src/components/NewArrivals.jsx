import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import heroBg from '../assets/hero_pastel.png';
import kurtiImg from '../assets/kurti.png';
import lehengaImg from '../assets/lehenga.png';

gsap.registerPlugin(ScrollTrigger);

const products = [
    { id: 1, name: 'Emerald Silk Kurta', price: '$149.00', image: kurtiImg },
    { id: 2, name: 'Noor Lehenga', price: '$329.00', image: lehengaImg },
    { id: 3, name: 'Velvet Gown', price: '$499.00', image: heroBg },
    { id: 4, name: 'Sapphire Drape', price: '$229.00', image: kurtiImg },
];

const NewArrivals = () => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const viewAllRef = useRef(null);
    const cardsRef = useRef([]);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            }
        });

        tl.fromTo(titleRef.current,
            { x: -30, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
        )
            .fromTo(viewAllRef.current,
                { x: 30, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "<"
            )
            .fromTo(cardsRef.current,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
                "-=0.4"
            );
    }, []);

    return (
        <section ref={containerRef} className="py-16 bg-white">
            <div className="container mx-auto px-8 md:px-12">
                {/* Header */}
                <div className="flex justify-between items-end mb-10">
                    <h2 ref={titleRef} className="text-3xl md:text-4xl font-serif text-primary">
                        New Arrivals
                    </h2>
                    <a
                        ref={viewAllRef}
                        href="#"
                        className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
                    >
                        View all pieces
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                    {products.map((product, index) => (
                        <div
                            key={product.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group cursor-pointer"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-gray-100">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <button className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-full group-hover:translate-y-0 bg-white text-primary text-xs uppercase tracking-widest px-6 py-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 shadow-sm">
                                    Quick View
                                </button>
                            </div>
                            <div className="text-center">
                                <h3 className="font-serif text-lg mb-2 text-primary">{product.name}</h3>
                                <p className="font-sans text-xs tracking-widest text-gray-500">{product.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
