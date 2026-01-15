import React, { useState } from 'react';
import logo from '../assets/logo.png';

const ImageWithLoader = ({ src, alt, className, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    return (
        <>
            {/* Loader Overlay */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex justify-center items-center bg-[#a4a4a4] z-10">
                    <img
                        src={logo}
                        alt="Loading..."
                        className="h-8 w-auto animate-pulse opacity-50"
                    />
                </div>
            )}

            {/* Actual Image */}
            <img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setIsLoaded(true);
                    setHasError(true);
                }}
                {...props}
            />
        </>
    );
};

export default ImageWithLoader;
