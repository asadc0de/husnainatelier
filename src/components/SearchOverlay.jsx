"use client";

import React, { useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useSearch } from '../context/SearchContext';

const SearchOverlay = () => {
    const { isSearchOpen, closeSearch, searchQuery, setSearchQuery, searchResults } = useSearch();
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isSearchOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.fromTo(contentRef.current,
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, delay: 0.1, ease: 'power2.out' }
            );
            // Focus input when opened
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
        }
    }, [isSearchOpen]);

    // if (!isSearchOpen) return null; // REMOVED to allow GSAP to animate out and keep refs

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 bg-white/95 z-[80] hidden opacity-0 overflow-y-auto"
        >
            <div ref={contentRef} className="container mx-auto px-6 md:px-12 pt-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-16">
                    <span className="font-serif text-xl tracking-widest">SEARCH</span>
                    <button onClick={closeSearch} className="hover:opacity-60 transition-opacity">
                        <X size={24} color="black" />
                    </button>
                </div>

                {/* Input */}
                <div className="relative mb-20">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Type to search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full text-4xl md:text-6xl font-serif border-b border-gray-200 py-6 outline-none bg-transparent placeholder-gray-300 text-black"
                    />
                    <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400" size={32} />
                </div>

                {/* Results */}
                {searchQuery && (
                    <>
                        {/* Collection Button Check */}
                        {(() => {
                            const categories = ['Bridal', 'Casual', 'Festive', 'Modern', 'Accessories'];
                            const matchingCategory = searchQuery.length >= 2
                                ? categories.find(c => c.toLowerCase().startsWith(searchQuery.toLowerCase()))
                                : null;

                            if (matchingCategory) {
                                return (
                                    <div className="flex justify-center mb-12">
                                        <Link
                                            href={`/category/${matchingCategory.toLowerCase()}`}
                                            onClick={closeSearch}
                                            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
                                        >
                                            View Full {matchingCategory} Collection
                                        </Link>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {searchResults.length > 0 ? (
                                searchResults.map(product => (
                                    <Link
                                        href={`/product/${product.id}`}
                                        key={product.id}
                                        onClick={closeSearch}
                                        className="group cursor-pointer"
                                    >
                                        <div className="aspect-[3/4] bg-gray-100 mb-4 overflow-hidden relative">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex justify-between items-baseline">
                                            <div>
                                                <h4 className="font-serif text-lg text-black group-hover:text-gray-600 transition-colors">{product.name}</h4>
                                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">{product.category}</p>
                                            </div>
                                            <span className="font-sans text-sm text-gray-500">{product.price}</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-400 font-sans tracking-widest mt-10">No results found for "{searchQuery}"</p>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchOverlay;
