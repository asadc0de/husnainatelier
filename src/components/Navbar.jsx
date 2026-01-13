import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { gsap } from 'gsap';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Mobile menu animation
    useEffect(() => {
        if (isMenuOpen) {
            gsap.fromTo(menuRef.current,
                { x: '100%' },
                { x: '0%', duration: 0.5, ease: 'power3.out' }
            );
        }
    }, [isMenuOpen]);

    return (
        <>
            <nav className="fixed w-full z-50 py-8 transition-all duration-300">
                <div className="container mx-auto px-8 md:px-12 flex justify-between items-center text-primary">

                    {/* Left: Shop */}
                    <div className="flex-1">
                        <a href="#" className="font-sans text-sm uppercase tracking-[0.2em] font-medium hover:text-gray-600 transition-colors">
                            Shop
                        </a>
                    </div>

                    {/* Center: HA Logo */}
                    <div className="flex-1 text-center">
                        <span className="font-serif text-3xl font-bold tracking-widest">
                            HA
                        </span>
                    </div>

                    {/* Right: Search */}
                    <div className="flex-1 flex justify-end">
                        <Search size={20} className="cursor-pointer hover:opacity-70 transition-opacity" />
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay (kept minimal for functional continuity) */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50" onClick={() => setIsMenuOpen(false)}>
                    <div ref={menuRef} className="absolute right-0 top-0 h-full w-[80%] bg-white text-primary p-10 flex flex-col" onClick={e => e.stopPropagation()}>
                        <button className="self-end mb-10" onClick={() => setIsMenuOpen(false)}>
                            <X size={24} />
                        </button>
                        {/* Items here would be added if needed */}
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
