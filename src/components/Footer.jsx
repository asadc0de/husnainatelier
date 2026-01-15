import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="pt-24 pb-8 bg-[#050505] text-[#FFF7E4] border-t border-[#FFF7E4]/20 min-h-screen flex flex-col justify-between">
            <div className="container mx-auto px-6 md:px-12 flex-1 flex flex-col justify-start">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 w-full">
                    <div className="max-w-md">
                        <h2 className="text-3xl md:text-5xl font-serif text-[#FFF7E4]">Experience the Atelier</h2>
                    </div>

                    <div className="flex gap-16 md:gap-32 text-sm font-sans text-[#FFF7E4]/60">
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#FFF7E4] mb-2">Shop</h4>
                            <Link to="/category/modern" className="hover:text-[#FFF7E4] transition-colors">New Arrivals</Link>
                            <Link to="/category/bridal" className="hover:text-[#FFF7E4] transition-colors">Bridal</Link>
                            <Link to="/category/festive" className="hover:text-[#FFF7E4] transition-colors">Festive</Link>
                            <Link to="/category/accessories" className="hover:text-[#FFF7E4] transition-colors">Accessories</Link>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="font-bold text-[#FFF7E4] mb-2">About</h4>
                            <Link to="/" className="hover:text-[#FFF7E4] transition-colors">Our Story</Link>
                            <Link to="/" className="hover:text-[#FFF7E4] transition-colors">Contact</Link>
                            <Link to="/" className="hover:text-[#FFF7E4] transition-colors">Bookings</Link>
                            <Link to="/" className="hover:text-[#FFF7E4] transition-colors">Legal</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                {/* Massive Brand Text - Full Width */}
                <div className="w-full border-b border-[#FFF7E4]/20 pb-2 overflow-hidden">
                    <h1 className="text-[16vw] leading-[0.8] font-serif font-medium tracking-tight text-[#FFF7E4] w-full text-center whitespace-nowrap">
                        HUSNAIN ATELIER
                    </h1>
                </div>

                <div className="container mx-auto px-6 md:px-12">
                    {/* Copyright Line */}
                    <div className="flex justify-between items-center mt-4 text-xs font-sans text-[#FFF7E4]/40 uppercase tracking-wider">
                        <p>&copy; {new Date().getFullYear()} Husnain Atelier</p>
                        <p>All Rights Reserved</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
