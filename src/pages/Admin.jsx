import React, { useState } from 'react';
import { useProduct } from '../context/ProductContext';
import { Upload, Minus, Plus, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

const Admin = () => {
    const { addProduct } = useProduct();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        category: 'Bridal',
        image: '',
        additionalImages: ['', '', '']
    });

    const categories = ['Bridal', 'Casual', 'Festive', 'Modern', 'Accessories'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (index === undefined) {
                    // Main Image
                    setFormData(prev => ({ ...prev, image: reader.result }));
                } else {
                    // Additional Images
                    const newImages = [...formData.additionalImages];
                    newImages[index] = reader.result;
                    setFormData(prev => ({ ...prev, additionalImages: newImages }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.price || !formData.image) {
            alert("Please fill in all required fields (Name, Price, Image)");
            return;
        }

        addProduct(formData);
        alert('Product added successfully!');
        setFormData({
            name: '',
            price: '',
            description: '',
            category: 'Bridal',
            image: '',
            additionalImages: ['', '', '']
        });
    };

    return (
        <div className="min-h-screen pt-32 pb-16 container mx-auto px-6 md:px-12">
            <h1 className="font-serif text-4xl text-center mb-12">Admin Panel - Add Product</h1>

            <div className="flex flex-col lg:flex-row gap-16">

                {/* LEFT COLUMN: LIVE PREVIEW (Mimicking ProductDetails.jsx) */}
                <div className="w-full lg:w-1/2 border border-gray-200 p-4 bg-white shadow-sm relative">
                    <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 uppercase tracking-widest pointer-events-none z-10">Preview</div>

                    {/* Preview Image Gallery Logic (Simplified for single image) */}
                    <div className="w-full">
                        <div className="h-[580px] w-full bg-gray-100 mb-[1px] overflow-hidden relative group">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Product Preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center text-gray-400 bg-gray-50 uppercase tracking-widest text-sm">
                                    No Image Selected
                                </div>
                            )}
                            {/* Visual Mockups of details elements */}
                            {formData.image && (
                                <>
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-2 rounded-full">
                                        <ZoomIn size={20} className="text-white" />
                                    </div>
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 z-10">
                                        <ChevronLeft size={32} />
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 z-10">
                                        <ChevronRight size={32} />
                                    </div>
                                </>
                            )}
                        </div>
                        {/* Live Thumbnails Preview */}
                        <div className="grid grid-cols-4 gap-[1px]">
                            {[formData.image, ...formData.additionalImages].slice(0, 4).map((img, i) => (
                                <div key={i} className={`aspect-square bg-gray-100 border-b-2 ${i === 0 ? 'border-primary opacity-100' : 'border-transparent opacity-60'}`}>
                                    {img ? (
                                        <img src={img} className="w-full h-full object-cover" alt={`thumb-${i}`} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] bg-gray-50">
                                            Empty
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Preview Details */}
                    <div className="mt-8 px-4">
                        <div className="flex justify-between items-start mb-8">
                            <h1 className="font-serif text-4xl md:text-5xl text-primary break-words max-w-[70%]">
                                {formData.name || 'Product Name'}
                            </h1>
                            <span className="font-serif text-2xl text-gray-500">
                                {formData.price || 'Rs. 0.00'}
                            </span>
                        </div>

                        <div className="border-t border-gray-100 py-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-primary">Description</h3>
                                <Minus size={16} />
                            </div>
                            <div className="text-sm text-gray-500 font-sans leading-relaxed space-y-4 whitespace-pre-line">
                                {formData.description || 'Product description will appear here...'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: EDITOR FORM */}
                <div className="w-full lg:w-1/2">
                    <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100 sticky top-32">
                        <h2 className="font-serif text-2xl mb-8">Product Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block font-serif text-lg mb-2">Product Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none"
                                    placeholder="e.g. Emerald Silk Kurta"
                                    required
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block font-serif text-lg mb-2">Price *</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none"
                                    placeholder="e.g. Rs. 14,900"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block font-serif text-lg mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none bg-white"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block font-serif text-lg mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="6"
                                    className="w-full border border-gray-300 p-3 font-sans focus:border-black outline-none resize-none"
                                    placeholder="Enter full product description..."
                                ></textarea>
                            </div>

                            {/* Image Upload */}
                            <div>
                                <label className="block font-serif text-lg mb-2">Product Images *</label>
                                {/* Main Image */}
                                <div className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors relative h-64">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageChange(e)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    />
                                    {formData.image ? (
                                        <img src={formData.image} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-10" />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <Upload size={32} className="mb-2" />
                                            <span className="font-sans text-sm tracking-widest uppercase">Upload Main Image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Additional Images */}
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {formData.additionalImages.map((img, index) => (
                                        <div key={index} className="border-2 border-dashed border-gray-300 relative aspect-square cursor-pointer hover:bg-gray-50 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e, index)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                            />
                                            {img ? (
                                                <img src={img} alt={`Sub ${index}`} className="absolute inset-0 w-full h-full object-cover z-10" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                                                    <Plus size={24} />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity mt-6"
                            >
                                Publish Product
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
