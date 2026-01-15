import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
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
            gsap.set(titleRef.current, { x: 0, opacity: 1 });
            gsap.set(viewAllRef.current, { x: 0, opacity: 1 });
            gsap.set(cardsRef.current, { y: 0, opacity: 1 });
            return;
        }

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
    }, [hasPlayedIntro]);

    return (
        <section ref={containerRef} className="py-16 bg-transparent">
            <div className="w-full">
                {/* Header */}
                <div className="flex justify-between items-end mb-10 px-8">
                    <h2 ref={titleRef} className="text-3xl md:text-4xl font-serif text-primary">
                        New Arrivals
                    </h2>
                    <Link
                        ref={viewAllRef}
                        to="/category/modern"
                        className="text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1"
                    >
                        View all pieces
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                    {displayedProducts.map((product, index) => (
                        <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            ref={el => cardsRef.current[index] = el}
                            className="group cursor-pointer block"
                        >
                            <div className="relative overflow-hidden aspect-[3/4] mb-6 bg-gray-100">
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
