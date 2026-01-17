import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [userId, setUserId] = useState(null);

    // Initialize User/Guest ID
    useEffect(() => {
        let storedId = localStorage.getItem('guest_user_id');
        if (!storedId) {
            storedId = 'guest_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('guest_user_id', storedId);
        }
        setUserId(storedId);
    }, []);

    // Sync Cart with Firestore
    useEffect(() => {
        if (!userId) return;

        const cartRef = doc(db, 'carts', userId);
        const unsubscribe = onSnapshot(cartRef, (docSnap) => {
            if (docSnap.exists()) {
                setCartItems(docSnap.data().items || []);
            } else {
                setCartItems([]);
            }
        });

        return () => unsubscribe();
    }, [userId]);

    const addToCart = async (product, quantity = 1) => {
        if (!userId) return;

        const updatedCart = [...cartItems];
        const existingItemIndex = updatedCart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].quantity += quantity;
        } else {
            updatedCart.push({ ...product, quantity });
        }

        // Optimistic update for UI speed
        setCartItems(updatedCart);
        setIsCartOpen(true);

        try {
            const cartRef = doc(db, 'carts', userId);
            await setDoc(cartRef, { items: updatedCart }, { merge: true });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    };

    const removeFromCart = async (productId) => {
        if (!userId) return;

        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart); // Optimistic

        try {
            const cartRef = doc(db, 'carts', userId);
            await setDoc(cartRef, { items: updatedCart }, { merge: true });
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1 || !userId) return;

        const updatedCart = cartItems.map(item =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedCart); // Optimistic

        try {
            const cartRef = doc(db, 'carts', userId);
            await setDoc(cartRef, { items: updatedCart }, { merge: true });
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const toggleCart = () => setIsCartOpen(prev => !prev);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return acc + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            toggleCart,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
