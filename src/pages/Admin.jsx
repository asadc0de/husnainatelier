import React, { useState, useEffect } from 'react';
import { useProduct } from '../context/ProductContext';
import { Upload, Minus, Plus, ChevronLeft, ChevronRight, ZoomIn, Edit, Trash2, ArrowLeft } from 'lucide-react';

const Admin = () => {
    const { products, addProduct, updateProduct, deleteProduct } = useProduct();
    const [view, setView] = useState('list'); // 'list' or 'form'
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const initialFormState = {
        name: '',
        price: '',
        description: '',
        category: 'Bridal',
        image: '',
        additionalImages: ['', '', '']
    };

    const [formData, setFormData] = useState(initialFormState);

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

        if (isEditing) {
            updateProduct(editId, formData);
            alert('Product updated successfully!');
        } else {
            addProduct(formData);
            alert('Product added successfully!');
        }

        // Reset and go back to list
        setFormData(initialFormState);
        setIsEditing(false);
        setEditId(null);
        setView('list');
    };

    const handleEditClick = (product) => {
        setFormData({
            name: product.name,
            price: product.price,
            description: product.description || '',
            category: product.category,
            image: product.image,
            additionalImages: product.additionalImages || ['', '', '']
        });
        setEditId(product.id);
        setIsEditing(true);
        setView('form');
    };

    const handleDeleteClick = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            deleteProduct(id);
        }
    };

    const handleAddNewClick = () => {
        setFormData(initialFormState);
        setIsEditing(false);
        setEditId(null);
        setView('form');
    };

    const handleBackClick = () => {
        if (window.confirm('Unsaved changes will be lost. Go back?')) {
            setView('list');
            setFormData(initialFormState);
            setIsEditing(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-16 container mx-auto px-6 md:px-12 bg-[#FFF7E4]">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                {view === 'list' ? (
                    <>
                        <h1 className="font-serif text-3xl md:text-4xl text-black">Product Inventory</h1>
                        <button
                            onClick={handleAddNewClick}
                            className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <Plus size={16} /> Add New Product
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={handleBackClick}
                            className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors uppercase tracking-widest text-xs font-bold"
                        >
                            <ArrowLeft size={16} /> Back to List
                        </button>
                        <h1 className="font-serif text-3xl md:text-4xl text-black">
                            {isEditing ? 'Edit Product' : 'Add New Product'}
                        </h1>
                        <div className="w-40"></div> {/* Spacer for balance */}
                    </>
                )}
            </div>

            {/* LIST VIEW */}
            {view === 'list' && (
                <div className="overflow-x-auto border border-gray-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Image</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="p-3 font-serif text-sm font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleEditClick(product)}
                                    >
                                        <td className="p-2 pl-3">
                                            <div className="w-10 h-12 bg-gray-100 overflow-hidden rounded-sm">
                                                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-3 font-medium text-sm text-gray-800">{product.name}</td>
                                        <td className="p-3 text-xs text-gray-500 uppercase tracking-widest">{product.category}</td>
                                        <td className="p-3 font-serif text-sm text-gray-800">{product.price}</td>
                                        <td className="p-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEditClick(product); }}
                                                    className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded-md transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteClick(product.id); }}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400 font-serif italic text-sm">
                                        No products found. Click "Add New Product" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORM VIEW */}
            {view === 'form' && (
                <div className="flex flex-col lg:flex-row gap-16 animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* LEFT COLUMN: LIVE PREVIEW */}
                    <div className="w-full lg:w-1/2 border border-gray-200 p-4 bg-white shadow-sm relative sticky top-32 self-start">
                        <div className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 uppercase tracking-widest pointer-events-none z-10">Live Preview</div>

                        {/* Preview Image Gallery Logic */}
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
                                {/* Visual Mockups */}
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
                        <div className="bg-white p-8 md:p-12 shadow-sm border border-gray-100">
                            <h2 className="font-serif text-2xl mb-8">{isEditing ? 'Update Product' : 'Create Product'}</h2>
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
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={handleBackClick}
                                        className="w-1/3 bg-white text-black border border-gray-300 py-4 text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="w-2/3 bg-black text-white py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity"
                                    >
                                        {isEditing ? 'Save Changes' : 'Publish Product'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
