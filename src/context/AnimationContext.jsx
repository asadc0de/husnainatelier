import React, { createContext, useContext, useState } from 'react';

const AnimationContext = createContext();

export const AnimationProvider = ({ children }) => {
    const [hasPlayedIntro, setHasPlayedIntro] = useState(false);

    return (
        <AnimationContext.Provider value={{ hasPlayedIntro, setHasPlayedIntro }}>
            {children}
        </AnimationContext.Provider>
    );
};

export const useAnimation = () => useContext(AnimationContext);
