import React, { useState, useEffect, useRef } from 'react';
import { Search, Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useSearch } from '../context/SearchContext';
import logo from '../assets/logo.png';

const Navbar = () => {
    const [isShopOpen, setIsShopOpen] = useState(false);
    const [isWhiteText, setIsWhiteText] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const { toggleCart, cartCount } = useCart();
    const { toggleSearch } = useSearch();
    const lastScrollY = useRef(0);

    // Color & Scroll detection
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Visibility Logic: Hide on Scroll Down, Show on Scroll Up
            if (currentScrollY > lastScrollY.current && currentScrollY > 20) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            // Background Logic: Show (if visible) when not at top
            setIsScrolled(currentScrollY > 20);

            lastScrollY.current = currentScrollY;

            // Color detection logic
            const x = window.innerWidth / 2;
            const y = 40; // Approx middle of navbar height
            const element = document.elementFromPoint(x, y);

            if (element) {
                const darkSection = element.closest('[data-theme="dark"]');
                setIsWhiteText(!!darkSection);
            } else {
                setIsWhiteText(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Check initially
        handleScroll();
        // Check on resize
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    const textColorClass = isScrolled || !isWhiteText ? 'text-black' : 'text-white';

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 pointer-events-none ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isScrolled ? 'bg-[#FFF7E4]/90 backdrop-blur-md py-4 shadow-sm' : 'py-8'}`}>
                <div className="container mx-auto px-8 md:px-12 flex justify-between items-center pointer-events-auto">

                    {/* Left: Shop */}
                    <div className="flex-1">
                        <div
                            className="relative inline-block"
                            onMouseEnter={() => setIsShopOpen(true)}
                            onMouseLeave={() => setIsShopOpen(false)}
                        >
                            <div
                                className={`font-sans text-sm uppercase tracking-[0.2em] font-medium hover:opacity-70 transition-opacity py-4 flex items-center gap-2 cursor-pointer ${textColorClass}`}
                                onClick={() => setIsShopOpen(!isShopOpen)}
                            >
                                Shop <ChevronDown size={14} className={`transition-transform duration-300 ${isShopOpen ? 'rotate-180' : ''}`} />
                            </div>

                            {/* Dropdown */}
                            <div className={`absolute left-0 top-full pt-4 min-w-[200px] z-[100] ${isShopOpen ? 'block' : 'hidden'}`}>
                                <div className="bg-white text-black p-6 flex flex-col gap-4 shadow-xl border border-gray-100">
                                    <Link to="/category/bridal" className="font-serif text-lg hover:text-gray-500 transition-colors">Bridal</Link>
                                    <Link to="/category/casual" className="font-serif text-lg hover:text-gray-500 transition-colors">Casual</Link>
                                    <Link to="/category/festive" className="font-serif text-lg hover:text-gray-500 transition-colors">Festive</Link>
                                    <Link to="/category/modern" className="font-serif text-lg hover:text-gray-500 transition-colors">Modern</Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center: HA Logo */}
                    <div className="flex-1 text-center flex justify-center">
                        <Link to="/" className="hover:opacity-70 transition-opacity block">
                            <img
                                src={logo}
                                alt="Husnain Atelier"
                                className={`h-8 w-auto transition-all duration-300 ${!isScrolled && isWhiteText ? 'invert' : ''}`}
                            />
                        </Link>
                    </div>

                    {/* Right: Search & Cart */}
                    <div className={`flex-1 flex justify-end items-center gap-6 ${textColorClass}`}>
                        <Search size={20} className="cursor-pointer hover:opacity-70 transition-opacity" onClick={toggleSearch} />
                        <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={toggleCart}>
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className={`absolute -top-1 -right-1 text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center ${isWhiteText ? 'bg-white text-black' : 'bg-black text-white'}`}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </nav>



        </>
    );
};

export default Navbar;
