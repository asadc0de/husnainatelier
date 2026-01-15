import React, { createContext, useContext, useState } from 'react';
import { useProduct } from './ProductContext';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { products: allProducts } = useProduct();

    const searchResults = searchQuery.length > 0
        ? allProducts.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    const toggleSearch = () => {
        setIsSearchOpen(prev => !prev);
        if (!isSearchOpen) {
            setSearchQuery(''); // Clear query when opening
        }
    };

    const closeSearch = () => {
        setIsSearchOpen(false);
        setSearchQuery('');
    };

    return (
        <SearchContext.Provider value={{
            isSearchOpen,
            setIsSearchOpen,
            searchQuery,
            setSearchQuery,
            searchResults,
            toggleSearch,
            closeSearch
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);
