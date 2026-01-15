
import React, { useState, useEffect } from 'react';
import { ChevronRight, Minus, Plus, ChevronLeft, ZoomIn, X } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProduct } from '../context/ProductContext';
import heroImg from '../assets/hero_wide.png';
import kurtiImg from '../assets/kurti.png';
import lehengaImg from '../assets/lehenga.png';

const ProductDetails = () => {
    const { id } = useParams();
    const { products } = useProduct();
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    // Find product by ID (ensure type match)
    const currentProduct = products.find(p => p.id == id);

    // Reset selected image when product changes
    useEffect(() => {
        setSelectedImage(0);
    }, [id]);

    if (!currentProduct) {
        return <div className="min-h-screen pt-32 text-center">Product not found.</div>;
    }

    // Mock gallery logic: Use the product's image, plus some static fallbacks for "gallery" feel if the product only has one image.
    // In a real app, product would have an images array. Here we'll just repeat the main image or mix well-known assets if it differs.
    // For simplicity and to support "uploaded" images:
    // If it's a new product (blob/dataURL), valid. If static, valid.
    // Construct gallery: Main + Additional, filtering out empties
    let images = [currentProduct.image];
    if (currentProduct.additionalImages && currentProduct.additionalImages.length > 0) {
        const validAdditional = currentProduct.additionalImages.filter(img => img);
        if (validAdditional.length > 0) {
            images = [currentProduct.image, ...validAdditional];
        } else {
            // Fallback for demo if no additional images
            images = [
                currentProduct.image,
                currentProduct.image === lehengaImg ? kurtiImg : lehengaImg,
                currentProduct.image === heroImg ? kurtiImg : heroImg,
                currentProduct.image
            ];
        }
    } else {
        // Fallback for demo/legacy mock data
        images = [
            currentProduct.image,
            currentProduct.image === lehengaImg ? kurtiImg : lehengaImg,
            currentProduct.image === heroImg ? kurtiImg : heroImg,
            currentProduct.image
        ];
    }

    const nextImage = (e) => {
        e?.stopPropagation();
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e?.stopPropagation();
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const relatedProducts = products.filter(p => p.id != id).slice(0, 3);

    return (
        <>
            {/* Zoom Overlay */}
            {isZoomOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex justify-center items-center" onClick={() => setIsZoomOpen(false)}>
                    {/* Close Button */}
                    <button className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors">
                        <X size={32} />
                    </button>

                    {/* Navigation - Large */}
                    <button
                        className="absolute left-8 text-white hover:text-gray-300 transition-colors p-4"
                        onClick={prevImage}
                    >
                        <ChevronLeft size={48} />
                    </button>
                    <button
                        className="absolute right-8 text-white hover:text-gray-300 transition-colors p-4"
                        onClick={nextImage}
                    >
                        <ChevronRight size={48} />
                    </button>

                    <div className="h-[90vh] max-w-[90vw] relative" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[selectedImage]}
                            alt="Full Screen"
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>
            )}

            <div className="pt-32 pb-0 w-full">
                {/* ... existing code ... */}

                <div className="flex flex-col lg:flex-row mb-0">
                    {/* Image Gallery */}
                    <div className="w-full lg:w-1/2">
                        {/* Main Image with Navigation & Zoom Trigger */}
                        <div className="h-[580px] w-full bg-gray-100 mb-[1px] overflow-hidden relative group">
                            <img
                                src={images[selectedImage]}
                                alt="Product Main"
                                className="h-full w-full object-cover cursor-zoom-in"
                                onClick={() => setIsZoomOpen(true)}
                            />

                            {/* Zoom Icon Hint */}
                            <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                <ZoomIn size={20} className="text-white" />
                            </div>

                            {/* Minimal Navigation Arrows */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </div>
                        <div className="grid grid-cols-4 gap-[1px]">
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className={`aspect-square bg-gray-100 cursor-pointer overflow-hidden border-b-2 transition-all ${selectedImage === index ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="w-full lg:w-1/2 px-6 md:px-12 lg:px-24 py-12">
                        <div className="flex justify-between items-start mb-8">
                            <h1 className="font-serif text-4xl md:text-5xl text-primary">{currentProduct.name}</h1>
                            <span className="font-serif text-2xl text-gray-500">{currentProduct.price}</span>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mb-12">
                            <button
                                onClick={() => addToCart(currentProduct)}
                                className="flex-1 bg-white text-black border border-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer"
                            >
                                Add to Cart
                            </button>
                            <button className="flex-1 bg-white text-black border border-black py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors cursor-pointer">
                                Buy Now
                            </button>
                        </div>

                        {/* Description */}
                        <div className="border-t border-gray-100 py-6">
                            <div className="flex justify-between items-center mb-4 cursor-pointer">
                                <h3 className="text-sm font-bold text-primary">Description</h3>
                                <Minus size={16} />
                            </div>
                            <div className="text-sm text-gray-500 font-sans leading-relaxed space-y-4">
                                <p>{currentProduct.description || "Fresh rosewater mist that has been handcrafted from our own rose garden. Perfect for a refreshing spritz to begin the start of your morning or afternoon."}</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Rose Water</li>
                                    <li>Essential Oils</li>
                                    <li>Hyaluronic Acid</li>
                                </ul>
                            </div>
                        </div>

                        {/* Shipping & Reviews Omitted as requested */}
                        <div className="border-t border-gray-100 py-6 opacity-50">
                            <div className="flex justify-between items-center cursor-default">
                                <h3 className="text-sm font-bold text-primary">Shipping</h3>
                                <Plus size={16} />
                            </div>
                        </div>
                        <div className="border-t border-gray-100 py-6 opacity-50">
                            <div className="flex justify-between items-center cursor-default">
                                <h3 className="text-sm font-bold text-primary">Reviews</h3>
                                <Plus size={16} />
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* You May Also Like - Full Width */}
            <div className="w-full">
                <div className="pt-16 border-t border-gray-100">
                    <h3 className="font-serif text-3xl text-center mb-12">You May Also Like</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-[1px]">
                        {relatedProducts.map((product) => (
                            <div key={product.id} className="group cursor-pointer block">
                                <div className="relative overflow-hidden aspect-[4/5] mb-6 bg-gray-100">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                <div className="flex justify-between items-baseline px-4 pb-8">
                                    <h4 className="font-serif text-lg text-primary">{product.name}</h4>
                                    <p className="font-sans text-sm tracking-widest text-gray-500">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetails;
