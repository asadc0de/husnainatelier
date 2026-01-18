import React from 'react';

const LoadingSpinner = () => {
    return (
        <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 font-sans text-sm tracking-widest uppercase text-gray-500">Loading...</span>
        </div>
    );
};

export default LoadingSpinner;
