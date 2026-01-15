import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import NewArrivals from '../components/NewArrivals';
import Categories from '../components/Categories';
import BrandStory from '../components/BrandStory';
import { useAnimation } from '../context/AnimationContext';

const Home = () => {
    const { setHasPlayedIntro } = useAnimation();

    useEffect(() => {
        // Set flag to true only when leaving the Home page
        return () => {
            setHasPlayedIntro(true);
        };
    }, [setHasPlayedIntro]);

    return (
        <>
            <Hero />
            <NewArrivals />
            <Categories />
            <BrandStory />
        </>
    );
};

export default Home;
