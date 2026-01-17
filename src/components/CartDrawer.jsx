"use client";

import React, { useEffect, useRef } from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
    const {
        cartItems,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const drawerRef = useRef(null);
    const overlayRef = useRef(null);

    useEffect(() => {
        if (isCartOpen) {
            gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, display: 'block' });
            gsap.to(drawerRef.current, { x: '0%', duration: 0.5, ease: 'power3.out' });
        } else {
            gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, display: 'none' });
            gsap.to(drawerRef.current, { x: '100%', duration: 0.5, ease: 'power3.in' });
        }
    }, [isCartOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 z-[60] hidden opacity-0"
                onClick={() => setIsCartOpen(false)}
            ></div>

            {/* Drawer */}
            <div
                ref={drawerRef}
                className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white z-[70] translate-x-full shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="font-serif text-xl text-black">Shopping Bag ({cartItems.length})</h2>
                    <button onClick={() => setIsCartOpen(false)} className="hover:opacity-60 transition-opacity">
                        <X size={24} color="black" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col justify-center items-center text-gray-400">
                            <p className="font-sans text-sm tracking-widest uppercase">Your bag is empty</p>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="w-20 h-24 bg-gray-100 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-serif text-sm text-black max-w-[140px]">{item.name}</h4>
                                            <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <p className="font-sans text-xs text-gray-500 mt-1">{item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center border border-gray-200">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-1 hover:bg-gray-100 transition-colors"
                                                disabled={item.quantity <= 1}
                                            >
                                                <Minus size={12} color="black" />
                                            </button>
                                            <span className="font-sans text-xs w-8 text-center text-black">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="p-1 hover:bg-gray-100 transition-colors"
                                            >
                                                <Plus size={12} color="black" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-serif text-lg text-black">Subtotal</span>
                        <span className="font-sans text-lg font-bold text-black">Rs. {cartTotal.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-center text-gray-500 mb-4">Shipping & taxes calculated at checkout</p>
                    <button className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity">
                        Checkout
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
