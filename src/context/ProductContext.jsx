import React, { createContext, useContext, useState, useEffect } from 'react';
import heroBg from '../assets/hero_pastel.png';
import kurtiImg from '../assets/kurti.png';
import lehengaImg from '../assets/lehenga.png';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    // Initial mock data
    const defaultProducts = [
        { id: 1, name: 'Emerald Silk Kurta', price: 'Rs. 14,900', image: kurtiImg, category: 'Festive', description: 'A beautiful emerald green silk kurta with intricate embroidery.' },
        { id: 2, name: 'Noor Lehenga', price: 'Rs. 32,900', image: lehengaImg, category: 'Bridal', description: 'Elegant bridal lehenga with heavy embellishments.' },
        { id: 3, name: 'Velvet Gown', price: 'Rs. 49,900', image: heroBg, category: 'Modern', description: 'Luxurious velvet gown perfect for evening parties.' },
        { id: 4, name: 'Sapphire Drape', price: 'Rs. 22,900', image: kurtiImg, category: 'Festive', description: 'Sapphire blue drape with golden borders.' },
        { id: 101, name: 'Rosewater Mist', price: 'Rs. 1,400', image: lehengaImg, category: 'Accessories', description: 'Fresh rosewater mist for a refreshing glow.' },
    ];

    const [products, setProducts] = useState(() => {
        const savedProducts = localStorage.getItem('products');
        return savedProducts ? JSON.parse(savedProducts) : defaultProducts;
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (newProduct) => {
        // Generate a simple unique ID
        const productWithId = { ...newProduct, id: Date.now() };
        // Add new product to the beginning of the list
        setProducts(prev => [productWithId, ...prev]);
    };

    return (
        <ProductContext.Provider value={{ products, addProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => useContext(ProductContext);
