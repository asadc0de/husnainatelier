import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import NewArrivals from '../components/NewArrivals';
import Categories from '../components/Categories';
import BrandStory from '../components/BrandStory';
import { useAnimation } from '../context/AnimationContext';
import heroBg from '../assets/hero_pastel.png';
import kurtiImg from '../assets/kurti.png';
import womenFestiveImg from '../assets/women_festive.jpg';
import lehengaImg from '../assets/lehenga.png'; // Keeping purely as backup or if needed elsewhere, but effectively replacing usage below
import womenCasualImg from '../assets/women_casual.jpg';
import womenBridalImg from '../assets/women_bridal.jpg';
import menSherwaniImg from '../assets/hero_wide.png';
import menFestiveImg from '../assets/Pakistani Coord Kurtas.jpg';
import menCasualImg from '../assets/story_full.jpg';

const Home = () => {
    const { setHasPlayedIntro } = useAnimation();

    const womenCollections = [
        { name: 'Bridal', image: womenBridalImg, link: '/category/bridal' },
        { name: 'Festive', image: womenFestiveImg, link: '/category/festive' },
        { name: 'Casual', image: womenCasualImg, link: '/category/casual' },
    ];

    const menCollections = [
        { name: 'Sherwani', image: menSherwaniImg, link: '/category/sherwani' }, // Using wide hero as placeholder for Sherwani
        { name: 'Festive', image: menFestiveImg, link: '/category/festive' },
        { name: 'Casual', image: menCasualImg, link: '/category/casual' },
    ];

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
            <Categories title="Women's Collection" collections={womenCollections} />
            <Categories title="Men's Collection" collections={menCollections} />
            <BrandStory />
        </>
    );
};

export default Home;
