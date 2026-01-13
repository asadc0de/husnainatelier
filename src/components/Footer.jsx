import React from 'react';
import { Instagram, Facebook, ArrowRight } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white pt-24 pb-8 text-primary border-t border-gray-100">
            <div className="container mx-auto px-8 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">

                    {/* Brand / Contact */}
                    <div className="md:col-span-1">
                        <h2 className="text-xl font-serif font-bold tracking-[0.1em] mb-6">HUSNAIN ATELIER</h2>
                        <div className="text-sm text-gray-500 font-sans space-y-4 leading-relaxed">
                            <p>Defining contemporary luxury with heritage craftsmanship.</p>
                            <div className="flex space-x-4 pt-2">
                                <a href="#" className="hover:text-secondary transition-colors"><Instagram size={18} /></a>
                                <a href="#" className="hover:text-secondary transition-colors"><Facebook size={18} /></a>
                            </div>
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="font-serif text-sm font-bold uppercase tracking-widest mb-6">Shop</h4>
                        <ul className="space-y-3 text-xs md:text-sm text-gray-500 font-sans tracking-wide">
                            <li className="hover:text-primary cursor-pointer transition-colors">New Arrivals</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Bridal</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Festive Collection</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Accessories</li>
                        </ul>
                    </div>

                    {/* Atelier */}
                    <div>
                        <h4 className="font-serif text-sm font-bold uppercase tracking-widest mb-6">Atelier</h4>
                        <ul className="space-y-3 text-xs md:text-sm text-gray-500 font-sans tracking-wide">
                            <li className="hover:text-primary cursor-pointer transition-colors">Our Story</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Book Appointment</li>
                            <li className="hover:text-primary cursor-pointer transition-colors">Customer Care</li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-serif text-sm font-bold uppercase tracking-widest mb-6">Newsletter</h4>
                        <p className="text-xs text-gray-500 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <div className="flex border-b border-primary pb-2">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400"
                            />
                            <button className="text-xs uppercase tracking-widest font-bold hover:text-secondary transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    <p>&copy; 2026 Husnain Atelier.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-primary transition-colors">Instagram</a>
                        <a href="#" className="hover:text-primary transition-colors">Facebook</a>
                        <a href="#" className="hover:text-primary transition-colors">Pinterest</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
