import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial Real-time Listener
    useEffect(() => {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const productsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching products from Firebase:", error);
            // Fallback to empty or local if needed, but for now just log
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addProduct = async (newProduct) => {
        try {
            await addDoc(collection(db, 'products'), {
                ...newProduct,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Check console." + (error.message ? " " + error.message : ""));
        }
    };

    const deleteProduct = async (id) => {
        try {
            await deleteDoc(doc(db, 'products', id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product.");
        }
    };

    const updateProduct = async (id, updatedProduct) => {
        try {
            await updateDoc(doc(db, 'products', id), updatedProduct);
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product.");
        }
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, deleteProduct, updateProduct, loading }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => useContext(ProductContext);
