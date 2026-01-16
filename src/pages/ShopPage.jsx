import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ImageWithLoader from '../components/ImageWithLoader';

gsap.registerPlugin(ScrollTrigger);

const ShopPage = () => {
    const { products } = useProduct();

    // Get unique categories
    const categories = [...new Set(products.map(p => p.category))];

    useEffect(() => {
        // Animation for sections
        const sections = document.querySelectorAll('.shop-section');
        sections.forEach(section => {
            gsap.fromTo(section,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                    }
                }
            );
        });
    }, [categories]);

    return (
        <div className="min-h-screen pt-32 pb-16 w-full bg-[#FFF7E4]">

            {/* Page Header */}
            <div className="text-center mb-20 px-4">
                <h1 className="font-serif text-4xl md:text-6xl text-primary mb-6">Shop All</h1>
                <p className="font-sans text-sm tracking-[0.2em] text-gray-500 uppercase max-w-xl mx-auto">
                    Explore our complete range of bespoke designs, from bridal masterpieces to modern essentials.
                </p>
            </div>

            {/* Collection Sections */}
            <div className="flex flex-col gap-12">
                {categories.map((category) => {
                    const categoryProducts = products
                        .filter(p => p.category === category)
                        .slice(0, 8); // Limit to 8 items per category

                    if (categoryProducts.length === 0) return null;

                    return (
                        <div key={category} className="shop-section w-full">
                            {/* Section Header */}
                            <div className="px-8 md:px-12 flex justify-between items-end mb-10 border-b border-black/5 pb-4 mx-4 md:mx-0">
                                <h2 className="text-3xl font-serif text-primary capitalize">
                                    {category}
                                </h2>
                                <Link
                                    to={`/category/${category.toLowerCase()}`}
                                    className="text-xs uppercase tracking-[0.2em] text-black hover:text-primary transition-colors pb-1 hidden sm:block"
                                >
                                    View Full Collection
                                </Link>
                            </div>

                            {/* Product Grid - Full Width */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]">
                                {categoryProducts.map((product) => (
                                    <Link
                                        to={`/product/${product.id}`}
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

                            {/* Mobile View All Button */}
                            <div className="sm:hidden px-4 mt-8 flex justify-center">
                                <Link
                                    to={`/category/${category.toLowerCase()}`}
                                    className="text-xs uppercase tracking-[0.2em] text-gray-500 border-b border-gray-300 pb-1"
                                >
                                    View Full Collection
                                </Link>
                            </div>

                            {/* Separator Line */}
                            <div className="w-full h-[1px] bg-black/10 mt-16"></div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Call to Action */}
            <div className="mt-32 text-center px-4">
                <p className="font-serif text-2xl mb-8 italic text-gray-400">Can't find what you're looking for?</p>
                <Link to="/category/casual" className="px-10 py-4 border border-black text-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                    Browse All Categories
                </Link>
            </div>

        </div>
    );
};

export default ShopPage;
