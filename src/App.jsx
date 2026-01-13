import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import NewArrivals from './components/NewArrivals';
import Categories from './components/Categories';
import BrandStory from './components/BrandStory';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <NewArrivals />
      <Categories />
      <BrandStory />
      <Footer />
    </div>
  );
}

export default App;
